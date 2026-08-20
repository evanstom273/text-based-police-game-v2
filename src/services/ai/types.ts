/**
 * Precinct Command — AI & Gemini Integration Types
 */

export type AIConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

export const DEFAULT_GEMINI_MODEL = 'gemini-3.1-flash-lite';

export interface GeminiConfig {
	/** Backend server URL that proxies Gemini requests */
	backendUrl: string;
	/** Gemini model identifier */
	model: string;
	/** Request timeout in milliseconds */
	timeoutMs: number;
	/** Default temperature for generation (0.0 to 1.0) */
	temperature: number;
	/** Optional custom system prompt header */
	systemPrompt?: string;
}

export interface AIConnectionTestResult {
	success: boolean;
	model?: string;
	latencyMs?: number;
	configured?: boolean;
	errorMessage?: string;
}

export interface GenerateOptions {
	model?: string;
	prompt: string;
	system?: string;
	temperature?: number;
	stream?: boolean;
	format?: 'json' | undefined;
	onToken?: (token: string) => void;
}

export interface ChatMessage {
	role: 'system' | 'user' | 'assistant';
	content: string;
}

export interface ChatOptions {
	model?: string;
	messages: ChatMessage[];
	temperature?: number;
	stream?: boolean;
	format?: 'json' | undefined;
	onToken?: (token: string) => void;
}
