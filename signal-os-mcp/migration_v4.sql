-- Migration v4: activate tasks table as the general planning board
-- Run via: wrangler d1 execute signal-os-db --remote --file=migration_v4.sql

ALTER TABLE tasks ADD COLUMN application_id INTEGER REFERENCES applications(id);
ALTER TABLE tasks ADD COLUMN updated_at DATETIME DEFAULT CURRENT_TIMESTAMP;

CREATE INDEX IF NOT EXISTS idx_tasks_module ON tasks(module);
CREATE INDEX IF NOT EXISTS idx_tasks_application ON tasks(application_id);
