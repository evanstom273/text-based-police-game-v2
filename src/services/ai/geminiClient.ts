import type {
	GeminiConfig,
	AIConnectionTestResult,
	GenerateOptions,
	ChatOptions,
} from './types';

export function normalizeBackendUrl(url: string): string {
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
		.replace(/<think>[\s\S]*?<\/think>/gi, '')
		.replace(/^<think>[\s\S]*$/gi, '')
		.replace(/Thinking Process:[\s\S]*?\n\n/gi, '')
		.trim();
}

/**
 * Tests connection to the backend Gemini proxy and measures roundtrip latency.
 */
export async function testGeminiConnection(
	config: GeminiConfig
): Promise<AIConnectionTestResult> {
	const backend = normalizeBackendUrl(config.backendUrl);
	const startTime = performance.now();

	try {
		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), config.timeoutMs || 10000);

		const response = await fetch(`${backend}/api/ai/health`, {
			method: 'GET',
			headers: { Accept: 'application/json' },
			signal: controller.signal,
		});

		clearTimeout(timeoutId);

		if (!response.ok) {
			return {
				success: false,
				errorMessage: `HTTP ${response.status}: ${response.statusText}`,
			};
		}

		const data = await response.json();
		const latencyMs = Math.round(performance.now() - startTime);

		return {
			success: Boolean(data.success),
			model: data.model || config.model,
			latencyMs,
			configured: data.configured,
			errorMessage: data.success ? undefined : data.errorMessage || 'Gemini API is not available',
		};
	} catch (err: unknown) {
		const errorMsg = err instanceof Error ? err.message : String(err);
		return {
			success: false,
			errorMessage: errorMsg.includes('abort')
				? 'Connection timed out. Check backend URL and server status.'
				: `Connection failed: ${errorMsg}`,
		};
	}
}

/**
 * Executes a text generation prompt via the Gemini chat endpoint.
 */
export async function generateGeminiCompletion(
	config: GeminiConfig,
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

	return generateGeminiChat(config, {
		model: options.model,
		messages,
		temperature: options.temperature,
		stream: options.stream,
		format: options.format,
		onToken: options.onToken,
	});
}

/**
 * Executes a multi-turn chat completion with optional streaming.
 */
export async function generateGeminiChat(
	config: GeminiConfig,
	options: ChatOptions
): Promise<string> {
	const backend = normalizeBackendUrl(config.backendUrl);
	const model = options.model || config.model;

	if (!model) {
		throw new Error('No Gemini model configured. Please check System Settings.');
	}

	const isStreaming = Boolean(options.stream && options.onToken);

	const payload: Record<string, unknown> = {
		model,
		messages: options.messages,
		stream: isStreaming,
		temperature: options.temperature ?? config.temperature ?? 0.7,
	};

	if (options.format === 'json') {
		payload.format = 'json';
	}

	const response = await fetch(`${backend}/api/ai/chat`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
		},
		body: JSON.stringify(payload),
	});

	if (!response.ok) {
		const errText = await response.text().catch(() => response.statusText);
		throw new Error(`Gemini Chat Error (${response.status}): ${errText}`);
	}

	if (!isStreaming) {
		const data = await response.json();
		return cleanDialogueOutput(data.text || '');
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
			const trimmed = line.trim();
			if (!trimmed.startsWith('data:')) continue;

			const jsonStr = trimmed.slice(5).trim();
			if (!jsonStr || jsonStr === '[DONE]') continue;

			try {
				const json = JSON.parse(jsonStr);
				if (json.error) {
					throw new Error(json.error);
				}

				const token = json.token || '';
				if (token) {
					fullText += token;
					options.onToken?.(token);
				}
			} catch (err) {
				if (err instanceof Error && err.message !== 'Unexpected end of JSON input') {
					throw err;
				}
			}
		}
	}

	return cleanDialogueOutput(fullText);
}
