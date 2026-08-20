import { Hono } from 'hono';
import type { ServerConfig } from '../config.js';
import { getDb } from '../db/connection.js';
import {
	listSaveGames,
	getSaveGameById,
	upsertSaveGame,
	deleteSaveGame,
} from '../repositories/saveRepository.js';
import { getAllSettings, setSetting } from '../repositories/settingsRepository.js';
import { checkGeminiHealth } from '../services/geminiService.js';

export function createPrecinctRoutes(config: ServerConfig): Hono {
	const router = new Hono();

	router.get('/health', async (c) => {
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

	router.get('/saves', (c) => {
		const db = getDb(config);
		const saves = listSaveGames(db);
		return c.json({ saves });
	});

	router.get('/saves/:id', (c) => {
		const id = c.req.param('id');
		const db = getDb(config);
		const save = getSaveGameById(db, id);
		if (!save) return c.json({ error: 'Save game not found' }, 404);

		let parsedState = {};
		try {
			parsedState = JSON.parse(save.state_json);
		} catch {
			// Return raw if parse fails
		}

		return c.json({
			save: {
				...save,
				state: parsedState,
			},
		});
	});

	router.post('/saves', async (c) => {
		const body = await c.req.json();
		if (!body.id || !body.save_name || !body.current_game_date) {
			return c.json({ error: 'Missing required fields: id, save_name, current_game_date' }, 400);
		}

		const db = getDb(config);
		upsertSaveGame(db, {
			id: body.id,
			save_name: body.save_name,
			precinct_name: body.precinct_name,
			current_game_date: body.current_game_date,
			current_shift: body.current_shift,
			budget_cents: body.budget_cents,
			reputation_score: body.reputation_score,
			state: body.state || {},
		});

		return c.json({ ok: true, id: body.id });
	});

	router.delete('/saves/:id', (c) => {
		const id = c.req.param('id');
		const db = getDb(config);
		const success = deleteSaveGame(db, id);
		if (!success) return c.json({ error: 'Save game not found' }, 404);
		return c.json({ ok: true });
	});

	router.get('/settings', (c) => {
		const db = getDb(config);
		const settings = getAllSettings(db);
		return c.json({ settings });
	});

	router.put('/settings', async (c) => {
		const body = await c.req.json();
		const db = getDb(config);
		if (body.settings && typeof body.settings === 'object') {
			for (const [k, v] of Object.entries(body.settings)) {
				setSetting(db, k, v);
			}
		}
		return c.json({ ok: true });
	});

	return router;
}
