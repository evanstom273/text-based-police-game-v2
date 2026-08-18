import type {
  OllamaConfig,
  OllamaModelInfo,
  AIConnectionTestResult,
  GenerateOptions,
  ChatOptions,
} from './types';

export function normalizeHostUrl(url: string): string {
  let trimmed = url.trim();
  if (!trimmed) return 'http://localhost:3847';
  if (!/^https?:\/\//i.test(trimmed)) {
    trimmed = `http://${trimmed}`;
  }
  return trimmed.replace(/\/+$/, '');
}

/**
 * Strips internal thinking tags, reasoning processes, and artifacts from output text.
 */
export function cleanDialogueOutput(text: string): string {
  if (!text) return '';
  return text
    .replace(/<think>[\s\S]*?<\/think>/gi, '') // Strip full think tags
    .replace(/^<think>[\s\S]*$/gi, '')         // Strip unfinished open think tags
    .replace(/Thinking Process:[\s\S]*?\n\n/gi, '') // Strip thinking process blocks
    .trim();
}

/**
 * Tests connection to Ollama host and retrieves available models with roundtrip latency.
 */
export async function testOllamaConnection(
  config: OllamaConfig
): Promise<AIConnectionTestResult> {
  const host = normalizeHostUrl(config.hostUrl);
  const startTime = performance.now();

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), config.timeoutMs || 10000);

    // Call /api/tags to list models
    const tagsResponse = await fetch(`${host}/api/tags`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!tagsResponse.ok) {
      return {
        success: false,
        errorMessage: `HTTP ${tagsResponse.status}: ${tagsResponse.statusText}`,
        models: [],
      };
    }

    const latencyMs = Math.round(performance.now() - startTime);
    const data = await tagsResponse.json();
    const models: OllamaModelInfo[] = Array.isArray(data.models) ? data.models : [];

    // Optional: Get Ollama version
    let version: string | undefined = undefined;
    try {
      const versionRes = await fetch(`${host}/api/version`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
      });
      if (versionRes.ok) {
        const vData = await versionRes.json();
        version = vData.version;
      }
    } catch {
      // Non-critical
    }

    return {
      success: true,
      version,
      latencyMs,
      models,
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    const isHttpsApp = typeof window !== 'undefined' && window.location.protocol === 'https:';
    const isHttpTarget = host.startsWith('http://') && !host.includes('localhost') && !host.includes('127.0.0.1');

    let hint = '';
    if (isHttpsApp && isHttpTarget) {
      hint = ' Browser blocked unencrypted HTTP connection from HTTPS page (Mixed Content). Use Tailscale HTTPS (https://*.ts.net) or run locally.';
    }

    return {
      success: false,
      errorMessage: errorMsg.includes('abort')
        ? 'Connection timed out. Check host URL, Tailscale, or backend status.'
        : `Connection failed: ${errorMsg}.${hint}`,
      models: [],
    };
  }
}

/**
 * Fetches all local models currently installed on the host.
 */
export async function fetchOllamaModels(config: OllamaConfig): Promise<OllamaModelInfo[]> {
  const host = normalizeHostUrl(config.hostUrl);
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch(`${host}/api/tags`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!response.ok) return [];
    const data = await response.json();
    return Array.isArray(data.models) ? data.models : [];
  } catch {
    clearTimeout(timeoutId);
    return [];
  }
}

/**
 * Executes a text generation prompt via /api/chat with streaming.
 */
export async function generateOllamaCompletion(
  config: OllamaConfig,
  options: GenerateOptions
): Promise<string> {
  const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [];

  if (options.system || config.systemPrompt) {
    messages.push({
      role: 'system',
      content: options.system || config.systemPrompt || '',
    });
  }

  messages.push({
    role: 'user',
    content: options.prompt,
  });

  return generateOllamaChat(config, {
    model: options.model,
    messages,
    temperature: options.temperature,
    stream: options.stream,
    format: options.format,
    onToken: options.onToken,
  });
}

/**
 * Executes a multi-turn chat completion with clean dialogue streaming.
 */
export async function generateOllamaChat(
  config: OllamaConfig,
  options: ChatOptions
): Promise<string> {
  const host = normalizeHostUrl(config.hostUrl);
  const model = options.model || config.selectedModel;

  if (!model) {
    throw new Error('No Ollama model selected. Please select a model in System Settings.');
  }

  const isStreaming = Boolean(options.stream && options.onToken);

  const payload: Record<string, unknown> = {
    model,
    messages: options.messages,
    stream: isStreaming,
    think: false, // Clean direct dialogue output
    options: {
      temperature: options.temperature ?? config.temperature ?? 0.7,
      num_predict: 250,
    },
  };

  if (options.format === 'json') {
    payload.format = 'json';
  }

  const response = await fetch(`${host}/api/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errText = await response.text().catch(() => response.statusText);
    throw new Error(`Ollama Chat Error (${response.status}): ${errText}`);
  }

  if (!isStreaming) {
    const data = await response.json();
    const raw = data.message?.content || data.response || '';
    return cleanDialogueOutput(raw);
  }

  const reader = response.body?.getReader();
  if (!reader) throw new Error('Response body stream is not readable.');

  const decoder = new TextDecoder('utf-8');
  let fullText = '';
  let buffer = '';
  let inThinkTag = false;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';

    for (const line of lines) {
      if (!line.trim()) continue;
      try {
        const json = JSON.parse(line);
        const token = json.message?.content || (json.response !== undefined ? json.response : '');

        if (token) {
          // Check for <think> tags in token stream
          if (token.includes('<think>')) inThinkTag = true;
          if (token.includes('</think>')) {
            inThinkTag = false;
            continue;
          }

          if (!inThinkTag) {
            const cleanToken = token.replace(/<think>|<\/think>/g, '');
            if (cleanToken) {
              fullText += cleanToken;
              options.onToken?.(cleanToken);
            }
          }
        }

        if (json.done) {
          break;
        }
      } catch {
        // Skip partial JSON chunks
      }
    }
  }

  return cleanDialogueOutput(fullText);
}
