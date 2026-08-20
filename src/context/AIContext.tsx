import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type {
	GeminiConfig,
	AIConnectionStatus,
	AIConnectionTestResult,
	GenerateOptions,
	ChatOptions,
} from '../services/ai/types';
import { DEFAULT_GEMINI_MODEL } from '../services/ai/types';
import {
	testGeminiConnection,
	generateGeminiCompletion,
	generateGeminiChat,
} from '../services/ai/geminiClient';

const STORAGE_KEY = 'precinct_command_gemini_config';

const DEFAULT_CONFIG: GeminiConfig = {
	apiKey: '',
	model: DEFAULT_GEMINI_MODEL,
	timeoutMs: 60000,
	temperature: 0.7,
	systemPrompt: 'You are the Public Safety AI Core operating inside the Precinct Command law enforcement workstation.',
};

interface AIContextType {
	config: GeminiConfig;
	status: AIConnectionStatus;
	latencyMs: number | null;
	lastError: string | null;
	isTesting: boolean;
	updateConfig: (newConfig: Partial<GeminiConfig>) => void;
	testConnection: (apiKeyOverride?: string) => Promise<AIConnectionTestResult>;
	generateText: (options: GenerateOptions) => Promise<string>;
	generateChat: (options: ChatOptions) => Promise<string>;
}

const AIContext = createContext<AIContextType | null>(null);

export const AIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [config, setConfig] = useState<GeminiConfig>(() => {
		if (typeof window !== 'undefined') {
			try {
				const saved = localStorage.getItem(STORAGE_KEY);
				if (saved) {
					const parsed = JSON.parse(saved);
					return {
						...DEFAULT_CONFIG,
						...parsed,
						model: DEFAULT_GEMINI_MODEL,
					};
				}
			} catch {
				// Fallback to default
			}
		}
		return DEFAULT_CONFIG;
	});

	const [status, setStatus] = useState<AIConnectionStatus>('disconnected');
	const [latencyMs, setLatencyMs] = useState<number | null>(null);
	const [lastError, setLastError] = useState<string | null>(null);
	const [isTesting, setIsTesting] = useState(false);

	const testConnection = useCallback(
		async (apiKeyOverride?: string): Promise<AIConnectionTestResult> => {
			setIsTesting(true);
			setStatus('connecting');
			setLastError(null);

			const result = await testGeminiConnection(config, { apiKey: apiKeyOverride });

			if (result.success) {
				setStatus('connected');
				setLatencyMs(result.latencyMs ?? null);
			} else {
				setStatus('error');
				setLastError(result.errorMessage || 'Connection failed');
			}

			setIsTesting(false);
			return result;
		},
		[config]
	);

	const updateConfig = useCallback((newConfig: Partial<GeminiConfig>) => {
		setConfig((prev) => {
			const updated = { ...prev, ...newConfig, model: DEFAULT_GEMINI_MODEL };
			try {
				localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
			} catch {
				// Ignore
			}
			return updated;
		});
	}, []);

	const generateText = useCallback(
		async (options: GenerateOptions): Promise<string> => {
			return generateGeminiCompletion(config, options);
		},
		[config]
	);

	const generateChat = useCallback(
		async (options: ChatOptions): Promise<string> => {
			return generateGeminiChat(config, options);
		},
		[config]
	);

	useEffect(() => {
		if (!config.apiKey.trim()) {
			setStatus('disconnected');
			return;
		}

		let isMounted = true;

		const check = async () => {
			setStatus('connecting');
			const result = await testGeminiConnection(config);
			if (!isMounted) return;

			if (result.success) {
				setStatus('connected');
				setLatencyMs(result.latencyMs ?? null);
			} else {
				setStatus('disconnected');
			}
		};

		check();

		return () => {
			isMounted = false;
		};
	}, [config.apiKey]);

	return (
		<AIContext.Provider
			value={{
				config,
				status,
				latencyMs,
				lastError,
				isTesting,
				updateConfig,
				testConnection,
				generateText,
				generateChat,
			}}
		>
			{children}
		</AIContext.Provider>
	);
};

export const useAI = (): AIContextType => {
	const context = useContext(AIContext);
	if (!context) {
		throw new Error('useAI must be used within an AIProvider');
	}
	return context;
};
