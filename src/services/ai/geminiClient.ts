import type {
	GeminiConfig,
	AIConnectionTestResult,
	GenerateOptions,
	ChatOptions,
	ChatMessage,
} from './types';

const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta';

function getApiKey(config: GeminiConfig, overrideKey?: string): string {
	return (overrideKey ?? config.apiKey).trim();
}

function buildGeminiPayload(
	messages: ChatMessage[],
	options: { temperature?: number; format?: 'json' }
) {
	const systemMessages = messages.filter((m) => m.role === 'system');
	const conversationMessages = messages.filter((m) => m.role !== 'system');

	const systemInstruction =
		systemMessages.length > 0
			? { parts: [{ text: systemMessages.map((m) => m.content).join('\n\n') }] }
			: undefined;

	const contents = conversationMessages.map((message) => ({
		role: message.role === 'assistant' ? 'model' : 'user',
		parts: [{ text: message.content }],
	}));

	const generationConfig: Record<string, unknown> = {
		temperature: options.temperature ?? 0.7,
		maxOutputTokens: 2048,
	};

	if (options.format === 'json') {
		generationConfig.responseMimeType = 'application/json';
	}

	return {
		...(systemInstruction ? { systemInstruction } : {}),
		contents,
		generationConfig,
	};
}

function extractGeminiText(data: {
	candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
}): string {
	return (
		data.candidates?.[0]?.content?.parts
			?.map((part) => part.text || '')
			.join('') || ''
	);
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
 * Tests the Gemini API key with a minimal generation request.
 */
export async function testGeminiConnection(
	config: GeminiConfig,
	options?: { apiKey?: string }
): Promise<AIConnectionTestResult> {
	const apiKey = getApiKey(config, options?.apiKey);

	if (!apiKey) {
		return {
			success: false,
			configured: false,
			errorMessage: 'No API key provided. Enter your Gemini API key to continue.',
		};
	}

	const startTime = performance.now();
	const controller = new AbortController();
	const timeoutId = setTimeout(() => controller.abort(), config.timeoutMs || 15000);

	try {
		const url = `${GEMINI_API_BASE}/models/${config.model}:generateContent?key=${encodeURIComponent(apiKey)}`;
		const response = await fetch(url, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				contents: [{ role: 'user', parts: [{ text: 'ping' }] }],
				generationConfig: { maxOutputTokens: 8, temperature: 0 },
			}),
			signal: controller.signal,
		});

		clearTimeout(timeoutId);
		const latencyMs = Math.round(performance.now() - startTime);

		if (!response.ok) {
			const text = await response.text().catch(() => '');
			let errorMessage = `HTTP ${response.status}`;

			try {
				const parsed = JSON.parse(text);
				errorMessage = parsed.error?.message || errorMessage;
			} catch {
				if (text) errorMessage = text.slice(0, 200);
			}

			if (response.status === 400 || response.status === 403) {
				errorMessage = `Invalid API key: ${errorMessage}`;
			}

			return {
				success: false,
				configured: true,
				latencyMs,
				errorMessage,
			};
		}

		return {
			success: true,
			model: config.model,
			latencyMs,
			configured: true,
		};
	} catch (err: unknown) {
		clearTimeout(timeoutId);
		const errorMsg = err instanceof Error ? err.message : String(err);

		return {
			success: false,
			configured: Boolean(apiKey),
			errorMessage: errorMsg.includes('abort')
				? 'Connection timed out. Check your network and try again.'
				: `Connection failed: ${errorMsg}`,
		};
	}
}

/**
 * Executes a text generation prompt via Gemini.
 */
export async function generateGeminiCompletion(
	config: GeminiConfig,
	options: GenerateOptions
): Promise<string> {
	const messages: ChatMessage[] = [];

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
	const apiKey = getApiKey(config);
	const model = options.model || config.model;

	if (!apiKey) {
		throw new Error('No Gemini API key configured. Add your key in System Settings.');
	}

	if (!model) {
		throw new Error('No Gemini model configured. Please check System Settings.');
	}

	const isStreaming = Boolean(options.stream && options.onToken);
	const payload = buildGeminiPayload(options.messages, {
		temperature: options.temperature ?? config.temperature ?? 0.7,
		format: options.format,
	});

	const action = isStreaming ? 'streamGenerateContent' : 'generateContent';
	const streamParam = isStreaming ? '&alt=sse' : '';
	const url = `${GEMINI_API_BASE}/models/${model}:${action}?key=${encodeURIComponent(apiKey)}${streamParam}`;

	const response = await fetch(url, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(payload),
	});

	if (!response.ok) {
		const errText = await response.text().catch(() => response.statusText);
		let message = errText;

		try {
			const parsed = JSON.parse(errText);
			message = parsed.error?.message || message;
		} catch {
			// Use raw text
		}

		throw new Error(`Gemini API error (${response.status}): ${message}`);
	}

	if (!isStreaming) {
		const data = await response.json();
		return cleanDialogueOutput(extractGeminiText(data));
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
				const data = JSON.parse(jsonStr);
				const token = extractGeminiText(data);
				if (token) {
					fullText += token;
					options.onToken?.(token);
				}
			} catch {
				// Skip malformed SSE chunks
			}
		}
	}

	return cleanDialogueOutput(fullText);
}

export function maskApiKey(apiKey: string): string {
	if (!apiKey) return '';
	if (apiKey.length <= 8) return '••••••••';
	return `${apiKey.slice(0, 4)}${'•'.repeat(Math.min(apiKey.length - 8, 16))}${apiKey.slice(-4)}`;
}
