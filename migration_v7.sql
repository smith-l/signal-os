-- Migration v7: dates and milestones for timeline view
-- Run via: wrangler d1 execute signal-os-db --remote --file=migration_v7.sql

ALTER TABLE projects ADD COLUMN start_date TEXT;
ALTER TABLE projects ADD COLUMN target_end_date TEXT;

ALTER TABLE tasks ADD COLUMN due_date TEXT;
ALTER TABLE tasks ADD COLUMN is_milestone INTEGER DEFAULT 0;
