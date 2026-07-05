-- Migration v5: projects + project_prep tables
-- Separate from applications/role_prep by design — different stage vocabulary,
-- different field set, different lifecycle. Shared UI component, separate data/write paths.
-- Run via: wrangler d1 execute signal-os-db --remote --file=migration_v5.sql

CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    category TEXT DEFAULT '',
    stage TEXT NOT NULL DEFAULT 'Not Started',
    next_action TEXT,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS project_prep (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id INTEGER NOT NULL,
    section_key TEXT NOT NULL,
    section_title TEXT NOT NULL,
    content TEXT DEFAULT '',
    sort_order INTEGER DEFAULT 0,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id)
);

CREATE INDEX IF NOT EXISTS idx_project_prep_project ON project_prep(project_id);

-- Point existing tasks at projects instead of (or alongside) applications.
-- A task can be linked to a project, an application, or neither (general/signal_os_build).
ALTER TABLE tasks ADD COLUMN project_id INTEGER REFERENCES projects(id);
CREATE INDEX IF NOT EXISTS idx_tasks_project ON tasks(project_id);

-- Seed the Maintel SE Transformation project so we have somewhere to move
-- the existing thinking into once the board exists.
INSERT INTO projects (title, category, stage, next_action, notes)
VALUES (
  'Maintel — SE Team Transformation',
  'in-role',
  'Not Started',
  'Build out sections once the board UI exists',
  'Transforming a reactive, ticket-taking Pre-Sales motion (7 SEs, legacy CPE/PBX background) into a proactive, consultative, measured team.'
);

INSERT INTO project_prep (project_id, section_key, section_title, sort_order)
SELECT id, 'approach', 'Approach', 1 FROM projects WHERE title = 'Maintel — SE Team Transformation';

INSERT INTO project_prep (project_id, section_key, section_title, sort_order)
SELECT id, 'team_assessment', 'Team & Stakeholder Assessment', 2 FROM projects WHERE title = 'Maintel — SE Team Transformation';

INSERT INTO project_prep (project_id, section_key, section_title, sort_order)
SELECT id, 'operating_model', 'Operating Model', 3 FROM projects WHERE title = 'Maintel — SE Team Transformation';

INSERT INTO project_prep (project_id, section_key, section_title, sort_order)
SELECT id, 'activity_log', 'Activity Log', 4 FROM projects WHERE title = 'Maintel — SE Team Transformation';
