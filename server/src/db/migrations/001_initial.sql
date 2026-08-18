-- Precinct Command: Initial SQLite Database Schema

CREATE TABLE IF NOT EXISTS save_games (
  id TEXT PRIMARY KEY,
  save_name TEXT NOT NULL,
  precinct_name TEXT NOT NULL DEFAULT '4th Precinct',
  current_game_date TEXT NOT NULL,
  current_shift TEXT NOT NULL DEFAULT 'shift_b',
  budget_cents INTEGER NOT NULL DEFAULT 50000000, -- $500,000.00
  reputation_score INTEGER NOT NULL DEFAULT 75,
  state_json TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS officer_records (
  id TEXT PRIMARY KEY,
  save_id TEXT NOT NULL,
  badge_number TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  rank_id TEXT NOT NULL,
  division_id TEXT NOT NULL,
  duty_status TEXT NOT NULL,
  shift TEXT NOT NULL,
  years_of_service INTEGER NOT NULL,
  attributes_json TEXT NOT NULL,
  skills_json TEXT NOT NULL,
  traits_json TEXT NOT NULL,
  biography TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  FOREIGN KEY (save_id) REFERENCES save_games(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS incident_records (
  id TEXT PRIMARY KEY,
  save_id TEXT NOT NULL,
  cad_number TEXT NOT NULL,
  crime_type_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  priority TEXT NOT NULL,
  status TEXT NOT NULL,
  outcome TEXT NOT NULL,
  location_json TEXT NOT NULL,
  assigned_officer_ids_json TEXT NOT NULL,
  reported_at TEXT NOT NULL,
  resolved_at TEXT,
  notes_json TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  FOREIGN KEY (save_id) REFERENCES save_games(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS precinct_settings (
  key TEXT PRIMARY KEY,
  value_json TEXT NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_officer_records_save ON officer_records(save_id);
CREATE INDEX IF NOT EXISTS idx_incident_records_save ON incident_records(save_id);
