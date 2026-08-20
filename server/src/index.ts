import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { loadConfig } from './config.js';
import { getDb } from './db/connection.js';
import { createPrecinctRoutes } from './routes/precinct.js';
import { checkGeminiHealth, generateGeminiChat } from './services/geminiService.js';

const config = loadConfig();
const app = new Hono();

app.use(
	'*',
	cors({
		origin: (origin) => origin || '*',
		allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
		allowHeaders: ['Content-Type'],
	})
);

app.get('/health', async (c) => {
	const gemini = await checkGeminiHealth(config);
	return c.json({
		ok: true,
		service: 'precinct-command',
		version: '1.0.0',
		dataDir: config.dataDir,
		gemini: gemini.ok,
		geminiError: gemini.error,
		geminiModel: config.geminiModel,
		geminiConfigured: Boolean(config.geminiApiKey),
	});
});

const precinctRoutes = createPrecinctRoutes(config);
app.route('/api/precinct', precinctRoutes);

app.get('/api/ai/health', async (c) => {
	const start = Date.now();
	const gemini = await checkGeminiHealth(config);
	return c.json({
		success: gemini.ok,
		model: config.geminiModel,
		latencyMs: Date.now() - start,
		errorMessage: gemini.error,
		configured: Boolean(config.geminiApiKey),
	});
});

app.post('/api/ai/chat', async (c) => {
	try {
		const body = await c.req.json();
		const response = await generateGeminiChat(config, {
			model: body.model,
			messages: body.messages ?? [],
			temperature: body.temperature,
			stream: body.stream,
			format: body.format,
		});

		return response;
	} catch (err) {
		const message = err instanceof Error ? err.message : String(err);
		return c.json({ error: `Gemini proxy error: ${message}` }, 502);
	}
});

getDb(config);

console.log(`Precinct Command server starting on port ${config.port}`);
console.log(`Data directory: ${config.dataDir}`);
console.log(`Gemini model: ${config.geminiModel}`);
console.log(`Gemini API key: ${config.geminiApiKey ? 'configured' : 'NOT SET'}`);

serve({
	fetch: app.fetch,
	port: config.port,
});
