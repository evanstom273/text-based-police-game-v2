import { homedir } from 'node:os';
import { join, resolve } from 'node:path';
import { mkdirSync } from 'node:fs';

const DEFAULT_DATA_DIR = join(homedir(), 'PrecinctCommand-Data');
const DEFAULT_GEMINI_MODEL = 'gemini-3.1-flash-lite';

export interface ServerConfig {
	port: number;
	dataDir: string;
	dbPath: string;
	geminiApiKey: string;
	geminiModel: string;
	savesDir: string;
	backupsDir: string;
	casesDir: string;
}

function resolveDataDir(): string {
	const configured = process.env.PRECINCT_DATA_DIR?.trim();
	return configured ? resolve(configured) : DEFAULT_DATA_DIR;
}

export function loadConfig(): ServerConfig {
	const dataDir = resolveDataDir();
	const subdirs = ['saves', 'backups', 'cases'];

	mkdirSync(dataDir, { recursive: true });
	for (const sub of subdirs) {
		mkdirSync(join(dataDir, sub), { recursive: true });
	}

	const port = Number.parseInt(process.env.PRECINCT_PORT ?? '3847', 10);
	const geminiApiKey = process.env.GEMINI_API_KEY?.trim() ?? '';
	const geminiModel = (process.env.GEMINI_MODEL ?? DEFAULT_GEMINI_MODEL).trim();

	return {
		port: Number.isFinite(port) ? port : 3847,
		dataDir,
		dbPath: join(dataDir, 'precinct.db'),
		geminiApiKey,
		geminiModel,
		savesDir: join(dataDir, 'saves'),
		backupsDir: join(dataDir, 'backups'),
		casesDir: join(dataDir, 'cases'),
	};
}
