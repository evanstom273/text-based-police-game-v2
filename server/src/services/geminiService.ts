import type { ServerConfig } from '../config.js';

const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta';

export interface GeminiChatMessage {
	role: 'system' | 'user' | 'assistant';
	content: string;
}

export interface GeminiChatRequest {
	model?: string;
	messages: GeminiChatMessage[];
	temperature?: number;
	stream?: boolean;
	format?: 'json';
}

function getApiKey(config: ServerConfig): string | null {
	const key = config.geminiApiKey?.trim();
	return key || null;
}

function buildGeminiPayload(request: GeminiChatRequest, config: ServerConfig) {
	const systemMessages = request.messages.filter((m) => m.role === 'system');
	const conversationMessages = request.messages.filter((m) => m.role !== 'system');

	const systemInstruction =
		systemMessages.length > 0
			? { parts: [{ text: systemMessages.map((m) => m.content).join('\n\n') }] }
			: undefined;

	const contents = conversationMessages.map((message) => ({
		role: message.role === 'assistant' ? 'model' : 'user',
		parts: [{ text: message.content }],
	}));

	const generationConfig: Record<string, unknown> = {
		temperature: request.temperature ?? 0.7,
		maxOutputTokens: 2048,
	};

	if (request.format === 'json') {
		generationConfig.responseMimeType = 'application/json';
	}

	return {
		...(systemInstruction ? { systemInstruction } : {}),
		contents,
		generationConfig,
	};
}

export async function checkGeminiHealth(
	config: ServerConfig
): Promise<{ ok: boolean; error?: string; model?: string }> {
	const apiKey = getApiKey(config);
	if (!apiKey) {
		return { ok: false, error: 'GEMINI_API_KEY is not configured on the server' };
	}

	const url = `${GEMINI_API_BASE}/models/${config.geminiModel}:generateContent?key=${apiKey}`;

	try {
		const response = await fetch(url, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				contents: [{ role: 'user', parts: [{ text: 'ping' }] }],
				generationConfig: { maxOutputTokens: 8, temperature: 0 },
			}),
			signal: AbortSignal.timeout(15000),
		});

		if (!response.ok) {
			const text = await response.text().catch(() => '');
			return {
				ok: false,
				error: `HTTP ${response.status}${text ? `: ${text.slice(0, 160)}` : ''}`,
			};
		}

		return { ok: true, model: config.geminiModel };
	} catch (err) {
		const message = err instanceof Error ? err.message : String(err);
		return { ok: false, error: message };
	}
}

export async function generateGeminiChat(
	config: ServerConfig,
	request: GeminiChatRequest
): Promise<Response> {
	const apiKey = getApiKey(config);
	if (!apiKey) {
		return new Response(JSON.stringify({ error: 'GEMINI_API_KEY is not configured on the server' }), {
			status: 503,
			headers: { 'Content-Type': 'application/json' },
		});
	}

	const model = request.model || config.geminiModel;
	const payload = buildGeminiPayload(request, config);
	const action = request.stream ? 'streamGenerateContent' : 'generateContent';
	const streamParam = request.stream ? '&alt=sse' : '';
	const url = `${GEMINI_API_BASE}/models/${model}:${action}?key=${apiKey}${streamParam}`;

	const response = await fetch(url, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(payload),
		signal: AbortSignal.timeout(120000),
	});

	if (!response.ok) {
		const text = await response.text().catch(() => '');
		return new Response(
			JSON.stringify({ error: `Gemini API error (${response.status}): ${text.slice(0, 500)}` }),
			{
				status: response.status,
				headers: { 'Content-Type': 'application/json' },
			}
		);
	}

	if (!request.stream) {
		const data = await response.json();
		const text =
			data.candidates?.[0]?.content?.parts
				?.map((part: { text?: string }) => part.text || '')
				.join('') || '';

		return new Response(JSON.stringify({ text }), {
			status: 200,
			headers: { 'Content-Type': 'application/json' },
		});
	}

	const headers = new Headers();
	headers.set('Content-Type', 'text/event-stream');
	headers.set('Cache-Control', 'no-cache');
	headers.set('Connection', 'keep-alive');

	const stream = new ReadableStream({
		async start(controller) {
			const encoder = new TextEncoder();
			const reader = response.body?.getReader();
			if (!reader) {
				controller.close();
				return;
			}

			const decoder = new TextDecoder();
			let buffer = '';

			try {
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
							const token =
								data.candidates?.[0]?.content?.parts
									?.map((part: { text?: string }) => part.text || '')
									.join('') || '';

							if (token) {
								controller.enqueue(encoder.encode(`data: ${JSON.stringify({ token })}\n\n`));
							}
						} catch {
							// Skip malformed SSE chunks
						}
					}
				}

				controller.enqueue(encoder.encode('data: [DONE]\n\n'));
			} catch (err) {
				const message = err instanceof Error ? err.message : String(err);
				controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: message })}\n\n`));
			} finally {
				controller.close();
			}
		},
	});

	return new Response(stream, { status: 200, headers });
}
