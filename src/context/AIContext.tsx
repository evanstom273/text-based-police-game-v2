import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type {
  OllamaConfig,
  OllamaModelInfo,
  AIConnectionStatus,
  AIConnectionTestResult,
  GenerateOptions,
  ChatOptions,
} from '../services/ai/types';
import {
  testOllamaConnection,
  generateOllamaCompletion,
  generateOllamaChat,
} from '../services/ai/ollamaClient';

const STORAGE_KEY = 'precinct_command_ollama_config';

const DEFAULT_CONFIG: OllamaConfig = {
  hostUrl: 'http://localhost:11434',
  selectedModel: 'llama3.2',
  timeoutMs: 60000,
  temperature: 0.7,
  isTailscale: false,
  systemPrompt: 'You are the Public Safety AI Core operating inside the Precinct Command law enforcement workstation.',
};

interface AIContextType {
  config: OllamaConfig;
  status: AIConnectionStatus;
  models: OllamaModelInfo[];
  latencyMs: number | null;
  version: string | null;
  lastError: string | null;
  isTesting: boolean;
  updateConfig: (newConfig: Partial<OllamaConfig>) => void;
  testConnection: () => Promise<AIConnectionTestResult>;
  generateText: (options: GenerateOptions) => Promise<string>;
  generateChat: (options: ChatOptions) => Promise<string>;
}

const AIContext = createContext<AIContextType | null>(null);

export const AIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<OllamaConfig>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          return { ...DEFAULT_CONFIG, ...JSON.parse(saved) };
        }
      } catch {
        // Fallback to default
      }
    }
    return DEFAULT_CONFIG;
  });

  const [status, setStatus] = useState<AIConnectionStatus>('disconnected');
  const [models, setModels] = useState<OllamaModelInfo[]>([]);
  const [latencyMs, setLatencyMs] = useState<number | null>(null);
  const [version, setVersion] = useState<string | null>(null);
  const [lastError, setLastError] = useState<string | null>(null);
  const [isTesting, setIsTesting] = useState(false);

  // Test connection to the host
  const testConnection = useCallback(async (): Promise<AIConnectionTestResult> => {
    setIsTesting(true);
    setStatus('connecting');
    setLastError(null);

    const result = await testOllamaConnection(config);

    if (result.success) {
      setStatus('connected');
      setModels(result.models);
      setLatencyMs(result.latencyMs ?? null);
      setVersion(result.version ?? null);

      // Auto-select first model if current selection is not available
      if (result.models.length > 0) {
        const hasSelected = result.models.some((m) => m.name === config.selectedModel);
        if (!hasSelected) {
          setConfig((prev) => {
            const updated = { ...prev, selectedModel: result.models[0].name };
            try {
              localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
            } catch {
              // Ignore
            }
            return updated;
          });
        }
      }
    } else {
      setStatus('error');
      setLastError(result.errorMessage || 'Connection failed');
    }

    setIsTesting(false);
    return result;
  }, [config]);

  // Update configuration and save to storage
  const updateConfig = useCallback((newConfig: Partial<OllamaConfig>) => {
    setConfig((prev) => {
      const updated = { ...prev, ...newConfig };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // Ignore
      }
      return updated;
    });
  }, []);

  // Text completion helper
  const generateText = useCallback(
    async (options: GenerateOptions): Promise<string> => {
      return generateOllamaCompletion(config, options);
    },
    [config]
  );

  // Chat completion helper
  const generateChat = useCallback(
    async (options: ChatOptions): Promise<string> => {
      return generateOllamaChat(config, options);
    },
    [config]
  );

  // Non-blocking background health check on mount
  useEffect(() => {
    let isMounted = true;

    const check = async () => {
      setStatus('connecting');
      const result = await testOllamaConnection(config);
      if (!isMounted) return;

      if (result.success) {
        setStatus('connected');
        setModels(result.models);
        setLatencyMs(result.latencyMs ?? null);
        setVersion(result.version ?? null);

        if (result.models.length > 0) {
          const hasSelected = result.models.some((m) => m.name === config.selectedModel);
          if (!hasSelected) {
            setConfig((prev) => {
              const updated = { ...prev, selectedModel: result.models[0].name };
              try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
              } catch {
                // Ignore
              }
              return updated;
            });
          }
        }
      } else {
        setStatus('disconnected');
      }
    };

    check();

    return () => {
      isMounted = false;
    };
  }, []); // Run on initial mount

  return (
    <AIContext.Provider
      value={{
        config,
        status,
        models,
        latencyMs,
        version,
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
