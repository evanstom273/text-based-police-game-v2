import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { loadConfig } from './config.js';
import { getDb } from './db/connection.js';
import { createPrecinctRoutes } from './routes/precinct.js';

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

app.get('/health', (c) => {
	return c.json({
		ok: true,
		service: 'precinct-command',
		version: '1.0.0',
		dataDir: config.dataDir,
	});
});

const precinctRoutes = createPrecinctRoutes(config);
app.route('/api/precinct', precinctRoutes);

getDb(config);

console.log(`Precinct Command server starting on port ${config.port}`);
console.log(`Data directory: ${config.dataDir}`);

serve({
	fetch: app.fetch,
	port: config.port,
});
