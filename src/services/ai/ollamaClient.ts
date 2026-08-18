import type {
  OllamaConfig,
  OllamaModelInfo,
  AIConnectionTestResult,
  GenerateOptions,
  ChatOptions,
} from './types';

export function normalizeHostUrl(url: string): string {
  let trimmed = url.trim();
  if (!trimmed) return 'http://localhost:11434';
  if (!/^https?:\/\//i.test(trimmed)) {
    trimmed = `http://${trimmed}`;
  }
  return trimmed.replace(/\/+$/, '');
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
    return {
      success: false,
      errorMessage: errorMsg.includes('abort')
        ? 'Connection timed out. Check host URL or Tailscale connection.'
        : `Connection failed: ${errorMsg}. (Ensure Ollama is running and OLLAMA_ORIGINS is configured if using a remote or web client).`,
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
 * Executes a text generation prompt with optional streaming.
 */
export async function generateOllamaCompletion(
  config: OllamaConfig,
  options: GenerateOptions
): Promise<string> {
  const host = normalizeHostUrl(config.hostUrl);
  const model = options.model || config.selectedModel;

  if (!model) {
    throw new Error('No Ollama model selected. Please select a model in System Settings.');
  }

  const isStreaming = Boolean(options.stream && options.onToken);

  const payload: Record<string, unknown> = {
    model,
    prompt: options.prompt,
    stream: isStreaming,
    options: {
      temperature: options.temperature ?? config.temperature ?? 0.7,
    },
  };

  if (options.system || config.systemPrompt) {
    payload.system = options.system || config.systemPrompt;
  }

  if (options.format === 'json') {
    payload.format = 'json';
  }

  const response = await fetch(`${host}/api/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errText = await response.text().catch(() => response.statusText);
    throw new Error(`Ollama Generation Error (${response.status}): ${errText}`);
  }

  if (!isStreaming) {
    const data = await response.json();
    return data.response || '';
  }

  // Stream reader
  const reader = response.body?.getReader();
  if (!reader) throw new Error('Response body stream is not readable.');

  const decoder = new TextDecoder('utf-8');
  let fullText = '';
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';

    for (const line of lines) {
      if (!line.trim()) continue;
      try {
        const parsed = JSON.parse(line);
        if (parsed.response) {
          fullText += parsed.response;
          options.onToken?.(parsed.response);
        }
      } catch {
        // Skip partial JSON chunks
      }
    }
  }

  return fullText;
}

/**
 * Executes a multi-turn chat completion.
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
    options: {
      temperature: options.temperature ?? config.temperature ?? 0.7,
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
    return data.message?.content || '';
  }

  const reader = response.body?.getReader();
  if (!reader) throw new Error('Response body stream is not readable.');

  const decoder = new TextDecoder('utf-8');
  let fullText = '';
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';

    for (const line of lines) {
      if (!line.trim()) continue;
      try {
        const parsed = JSON.parse(line);
        if (parsed.message?.content) {
          fullText += parsed.message.content;
          options.onToken?.(parsed.message.content);
        }
      } catch {
        // Skip partial JSON chunks
      }
    }
  }

  return fullText;
}
