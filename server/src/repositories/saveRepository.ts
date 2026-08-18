import type { PrecinctDatabase } from '../db/types.js';

export interface SaveGameRecord {
  id: string;
  save_name: string;
  precinct_name: string;
  current_game_date: string;
  current_shift: string;
  budget_cents: number;
  reputation_score: number;
  state_json: string;
  created_at: number;
  updated_at: number;
}

export function listSaveGames(db: PrecinctDatabase): Omit<SaveGameRecord, 'state_json'>[] {
  return db
    .prepare(
      `SELECT id, save_name, precinct_name, current_game_date, current_shift, budget_cents, reputation_score, created_at, updated_at 
       FROM save_games 
       ORDER BY updated_at DESC`
    )
    .all() as Omit<SaveGameRecord, 'state_json'>[];
}

export function getSaveGameById(db: PrecinctDatabase, id: string): SaveGameRecord | undefined {
  return db.prepare('SELECT * FROM save_games WHERE id = ?').get(id) as SaveGameRecord | undefined;
}

export function upsertSaveGame(
  db: PrecinctDatabase,
  save: {
    id: string;
    save_name: string;
    precinct_name?: string;
    current_game_date: string;
    current_shift?: string;
    budget_cents?: number;
    reputation_score?: number;
    state: Record<string, unknown>;
  }
): void {
  const now = Date.now();
  const existing = getSaveGameById(db, save.id);

  if (existing) {
    db.prepare(
      `UPDATE save_games 
       SET save_name = ?, precinct_name = ?, current_game_date = ?, current_shift = ?, budget_cents = ?, reputation_score = ?, state_json = ?, updated_at = ?
       WHERE id = ?`
    ).run(
      save.save_name,
      save.precinct_name ?? existing.precinct_name,
      save.current_game_date,
      save.current_shift ?? existing.current_shift,
      save.budget_cents ?? existing.budget_cents,
      save.reputation_score ?? existing.reputation_score,
      JSON.stringify(save.state),
      now,
      save.id
    );
  } else {
    db.prepare(
      `INSERT INTO save_games (id, save_name, precinct_name, current_game_date, current_shift, budget_cents, reputation_score, state_json, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(
      save.id,
      save.save_name,
      save.precinct_name ?? '4th Precinct',
      save.current_game_date,
      save.current_shift ?? 'shift_b',
      save.budget_cents ?? 50000000,
      save.reputation_score ?? 75,
      JSON.stringify(save.state),
      now,
      now
    );
  }
}

export function deleteSaveGame(db: PrecinctDatabase, id: string): boolean {
  const res = db.prepare('DELETE FROM save_games WHERE id = ?').run(id);
  return Number(res.changes) > 0;
}
