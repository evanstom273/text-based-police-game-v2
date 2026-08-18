/**
 * Precinct Command — AI & Ollama Integration Types
 */

export type AIConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

export interface OllamaModelInfo {
  name: string;
  modified_at?: string;
  size?: number;
  digest?: string;
  details?: {
    format?: string;
    family?: string;
    families?: string[];
    parameter_size?: string;
    quantization_level?: string;
  };
}

export interface OllamaConfig {
  /** Target Ollama host URL (e.g. http://localhost:11434 or http://100.x.y.z:11434) */
  hostUrl: string;
  /** Currently selected model tag (e.g. llama3.2, mistral, gemma2:2b) */
  selectedModel: string;
  /** Request timeout in milliseconds (default: 60000) */
  timeoutMs: number;
  /** Default temperature for generation (0.0 to 1.0) */
  temperature: number;
  /** Whether Tailscale network routing helper is enabled */
  isTailscale: boolean;
  /** Optional custom system prompt header */
  systemPrompt?: string;
}

export interface AIConnectionTestResult {
  success: boolean;
  version?: string;
  latencyMs?: number;
  models: OllamaModelInfo[];
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
