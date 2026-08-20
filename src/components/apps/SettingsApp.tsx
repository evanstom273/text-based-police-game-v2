import React, { useState } from 'react';
import { useAI } from '../../context/AIContext';
import { DEFAULT_GEMINI_MODEL } from '../../services/ai/types';
import {
	Cpu,
	RefreshCw,
	CheckCircle2,
	AlertTriangle,
	Play,
	Sliders,
	Terminal,
	Server,
	Info,
} from 'lucide-react';

export const SettingsApp: React.FC<{ windowId: string; appId: string }> = () => {
	const {
		config,
		status,
		latencyMs,
		lastError,
		isTesting,
		updateConfig,
		testConnection,
		generateText,
	} = useAI();

	const [backendInput, setBackendInput] = useState(config.backendUrl);
	const [testPrompt, setTestPrompt] = useState(
		'Generate a brief, 2-sentence police radio report from Officer Miller confirming a suspect in custody at 4th Precinct.'
	);
	const [testOutput, setTestOutput] = useState('');
	const [isRunningPrompt, setIsRunningPrompt] = useState(false);
	const [tokenCount, setTokenCount] = useState(0);
	const [activeTab, setActiveTab] = useState<'network' | 'diagnostic'>('network');

	const handleApplyBackend = (url: string) => {
		setBackendInput(url);
		updateConfig({ backendUrl: url });
	};

	const handleRunDiagnosticTest = async () => {
		updateConfig({ backendUrl: backendInput });
		await testConnection();
	};

	const handleExecutePrompt = async () => {
		if (!testPrompt.trim()) return;
		setIsRunningPrompt(true);
		setTestOutput('');
		setTokenCount(0);

		try {
			await generateText({
				prompt: testPrompt,
				stream: true,
				onToken: (token) => {
					setTokenCount((c) => c + 1);
					setTestOutput((prev) => prev + token);
				},
			});
		} catch (err: unknown) {
			const msg = err instanceof Error ? err.message : String(err);
			setTestOutput(`[ERROR]: ${msg}`);
		} finally {
			setIsRunningPrompt(false);
		}
	};

	return (
		<div className="flex flex-col h-full bg-slate-50 text-slate-900 text-xs font-sans select-text overflow-hidden">
			<div className="px-4 py-3 bg-white border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
				<div className="flex items-center gap-3">
					<div className="w-8 h-8 rounded-lg bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-700 shadow-2xs">
						<Cpu className="w-4 h-4" />
					</div>
					<div>
						<div className="font-semibold text-xs text-slate-900 flex items-center gap-2">
							<span>AI Neural Engine & Gemini Interface</span>
							<span className="font-mono text-[9px] font-bold text-sky-700 bg-sky-50 border border-sky-200 px-1.5 py-0.2 rounded">
								SYS-08
							</span>
						</div>
						<div className="text-[11px] text-slate-500">
							Gemini API via Backend Proxy ({DEFAULT_GEMINI_MODEL})
						</div>
					</div>
				</div>

				<div className="flex items-center gap-2">
					{status === 'connected' ? (
						<div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-50 border border-emerald-200 text-emerald-800 font-semibold text-[11px]">
							<span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
							<span>ONLINE</span>
							{latencyMs !== null && (
								<span className="font-mono font-normal opacity-80 text-[10px]">({latencyMs}ms)</span>
							)}
						</div>
					) : status === 'connecting' || isTesting ? (
						<div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-blue-50 border border-blue-200 text-blue-800 font-semibold text-[11px]">
							<RefreshCw className="w-3 h-3 animate-spin text-blue-600" />
							<span>CONNECTING...</span>
						</div>
					) : status === 'error' ? (
						<div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-red-50 border border-red-200 text-red-800 font-semibold text-[11px]">
							<AlertTriangle className="w-3.5 h-3.5 text-red-600" />
							<span>OFFLINE / ERROR</span>
						</div>
					) : (
						<div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-100 border border-slate-200 text-slate-600 font-semibold text-[11px]">
							<span className="w-2 h-2 rounded-full bg-slate-400"></span>
							<span>DISCONNECTED</span>
						</div>
					)}
				</div>
			</div>

			<div className="flex border-b border-slate-200 bg-white px-4">
				<button
					onClick={() => setActiveTab('network')}
					className={`py-2 px-3 font-medium text-xs border-b-2 transition flex items-center gap-1.5 ${
						activeTab === 'network'
							? 'border-blue-600 text-blue-700 font-semibold'
							: 'border-transparent text-slate-600 hover:text-slate-900'
					}`}
				>
					<Server className="w-3.5 h-3.5" />
					API Configuration
				</button>
				<button
					onClick={() => setActiveTab('diagnostic')}
					className={`py-2 px-3 font-medium text-xs border-b-2 transition flex items-center gap-1.5 ${
						activeTab === 'diagnostic'
							? 'border-blue-600 text-blue-700 font-semibold'
							: 'border-transparent text-slate-600 hover:text-slate-900'
					}`}
				>
					<Terminal className="w-3.5 h-3.5" />
					Live Test Console
				</button>
			</div>

			<div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
				{activeTab === 'network' && (
					<div className="space-y-4 max-w-2xl">
						<div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-[11px] text-blue-900 flex items-start gap-2.5">
							<Info className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
							<div className="space-y-1">
								<strong className="block">Gemini API Key Setup:</strong>
								<p>
									Set <code className="bg-blue-100 px-1 rounded">GEMINI_API_KEY</code> in your server
									environment before starting the backend. The key is never stored in the browser.
								</p>
								<pre className="p-2 bg-slate-900 text-slate-200 rounded font-mono text-[10px] mt-1 overflow-x-auto">
									export GEMINI_API_KEY="your-api-key-here"{'\n'}
									npm run dev:server
								</pre>
							</div>
						</div>

						<div className="p-4 bg-white border border-slate-200 rounded-lg shadow-2xs space-y-3">
							<div className="flex items-center justify-between">
								<span className="font-semibold text-xs text-slate-900 flex items-center gap-1.5">
									<Server className="w-4 h-4 text-blue-600" />
									Backend Server Endpoint
								</span>
								<span className="font-mono text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded border border-slate-200">
									{DEFAULT_GEMINI_MODEL}
								</span>
							</div>

							<div className="space-y-1.5">
								<span className="text-[11px] text-slate-500 block">Backend Presets:</span>
								<div className="flex flex-wrap gap-2">
									<button
										onClick={() => handleApplyBackend('http://localhost:3847')}
										className={`px-2.5 py-1 rounded text-xs font-medium border transition ${
											backendInput.includes('3847')
												? 'bg-blue-50 text-blue-700 border-blue-300 font-semibold'
												: 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
										}`}
									>
										Local Backend (localhost:3847)
									</button>
									<button
										onClick={() => handleApplyBackend(window.location.origin)}
										className={`px-2.5 py-1 rounded text-xs font-medium border transition ${
											backendInput === window.location.origin
												? 'bg-blue-50 text-blue-700 border-blue-300 font-semibold'
												: 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
										}`}
									>
										Current Origin (proxied)
									</button>
								</div>
							</div>

							<div className="space-y-1.5">
								<div className="flex gap-2">
									<input
										type="text"
										value={backendInput}
										onChange={(e) => setBackendInput(e.target.value)}
										placeholder="http://localhost:3847"
										className="flex-1 bg-slate-50 border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 font-mono"
									/>
									<button
										onClick={handleRunDiagnosticTest}
										disabled={isTesting}
										className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded text-xs transition flex items-center gap-1.5 shadow-2xs disabled:opacity-50"
									>
										<RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
										Test & Connect
									</button>
								</div>

								{lastError && (
									<div className="p-2.5 bg-red-50 border border-red-200 rounded text-[11px] text-red-700 flex items-start gap-2">
										<AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
										<div>{lastError}</div>
									</div>
								)}
							</div>
						</div>

						<div className="p-4 bg-white border border-slate-200 rounded-lg shadow-2xs space-y-3">
							<span className="font-semibold text-xs text-slate-900 flex items-center gap-1.5">
								<Sliders className="w-4 h-4 text-blue-600" />
								Generation Parameters
							</span>

							<div className="space-y-2">
								<label className="text-[11px] text-slate-600 block">Active Model:</label>
								<input
									type="text"
									value={config.model}
									readOnly
									className="w-full bg-slate-100 border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-700 font-mono cursor-not-allowed"
								/>

								<div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
									<span>Temperature ({config.temperature})</span>
									<input
										type="range"
										min="0"
										max="1"
										step="0.05"
										value={config.temperature}
										onChange={(e) => updateConfig({ temperature: parseFloat(e.target.value) })}
										className="w-36 accent-blue-600"
									/>
								</div>
							</div>
						</div>

						<div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded text-[11px] text-emerald-900 flex items-center gap-2">
							<CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
							<span>
								All AI inference requests are routed through the backend proxy to Gemini{' '}
								{DEFAULT_GEMINI_MODEL}.
							</span>
						</div>
					</div>
				)}

				{activeTab === 'diagnostic' && (
					<div className="space-y-3 max-w-2xl">
						<div className="p-4 bg-white border border-slate-200 rounded-lg shadow-2xs space-y-3">
							<div className="flex items-center justify-between">
								<span className="font-semibold text-xs text-slate-900 flex items-center gap-1.5">
									<Terminal className="w-4 h-4 text-blue-600" />
									Model Generation Diagnostic Test
								</span>
								<span className="text-[11px] font-mono text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
									Target: {config.model}
								</span>
							</div>

							<div className="space-y-2">
								<label className="text-[11px] text-slate-600 block">Prompt Payload:</label>
								<textarea
									rows={3}
									value={testPrompt}
									onChange={(e) => setTestPrompt(e.target.value)}
									className="w-full bg-slate-50 border border-slate-300 rounded p-2.5 text-xs text-slate-900 font-sans focus:outline-none focus:border-blue-500"
								/>
							</div>

							<div className="flex items-center gap-3">
								<button
									onClick={handleExecutePrompt}
									disabled={isRunningPrompt || status !== 'connected'}
									className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded text-xs transition flex items-center gap-1.5 shadow-2xs disabled:opacity-50"
								>
									{isRunningPrompt ? (
										<>
											<RefreshCw className="w-3.5 h-3.5 animate-spin" />
											Streaming Response...
										</>
									) : (
										<>
											<Play className="w-3.5 h-3.5" />
											Run Live Prompt Test
										</>
									)}
								</button>

								{isRunningPrompt && (
									<span className="text-[11px] text-slate-500 font-mono animate-pulse">
										Receiving tokens ({tokenCount})...
									</span>
								)}
							</div>

							{testOutput && (
								<div className="space-y-1.5 pt-2">
									<div className="flex items-center justify-between">
										<span className="text-[11px] font-semibold text-slate-700 block">Model Stream Response:</span>
										<span className="text-[10px] text-slate-400 font-mono">{tokenCount} tokens received</span>
									</div>
									<div className="p-3 bg-slate-900 text-slate-100 rounded-md font-mono text-xs whitespace-pre-wrap leading-relaxed max-h-56 overflow-y-auto border border-slate-800">
										{testOutput}
									</div>
								</div>
							)}
						</div>
					</div>
				)}
			</div>

			<div className="px-4 py-2 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-500 flex items-center justify-between">
				<span>Public Safety Workstation — AI Configuration Terminal</span>
				<span>Gemini {DEFAULT_GEMINI_MODEL}</span>
			</div>
		</div>
	);
};
