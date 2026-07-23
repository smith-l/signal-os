-- Migration v8: people + people_prep tables for team member tracking
-- Mirrors projects/project_prep exactly, but stage vocabulary is support-need
-- based rather than project-lifecycle based.
-- Run via: wrangler d1 execute signal-os-db --remote --file=migration_v8.sql

CREATE TABLE IF NOT EXISTS people (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    role TEXT DEFAULT '',
    support_stage TEXT NOT NULL DEFAULT 'Steady',
    next_action TEXT,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS people_prep (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    person_id INTEGER NOT NULL,
    section_key TEXT NOT NULL,
    section_title TEXT NOT NULL,
    content TEXT DEFAULT '',
    sort_order INTEGER DEFAULT 0,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (person_id) REFERENCES people(id)
);

CREATE INDEX IF NOT EXISTS idx_people_prep_person ON people_prep(person_id);
