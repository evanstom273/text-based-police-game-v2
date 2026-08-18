import type { PrecinctDatabase } from '../db/types.js';

export function getAllSettings(db: PrecinctDatabase): Record<string, unknown> {
  const rows = db.prepare('SELECT key, value_json FROM precinct_settings').all() as { key: string; value_json: string }[];
  const result: Record<string, unknown> = {};
  for (const row of rows) {
    try {
      result[row.key] = JSON.parse(row.value_json);
    } catch {
      result[row.key] = row.value_json;
    }
  }
  return result;
}

export function getSetting(db: PrecinctDatabase, key: string): unknown {
  const row = db.prepare('SELECT value_json FROM precinct_settings WHERE key = ?').get(key) as { value_json: string } | undefined;
  if (!row) return undefined;
  try {
    return JSON.parse(row.value_json);
  } catch {
    return row.value_json;
  }
}

export function setSetting(db: PrecinctDatabase, key: string, value: unknown): void {
  const now = Date.now();
  db.prepare(
    `INSERT INTO precinct_settings (key, value_json, updated_at) 
     VALUES (?, ?, ?)
     ON CONFLICT(key) DO UPDATE SET value_json = excluded.value_json, updated_at = excluded.updated_at`
  ).run(key, JSON.stringify(value), now);
}
