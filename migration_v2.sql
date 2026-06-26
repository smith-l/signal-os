-- Migration v2: role prep sections and stories enhancements
-- Run via: wrangler d1 execute signal-os-db --remote --file=migration_v2.sql

CREATE TABLE IF NOT EXISTS role_prep (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  application_id INTEGER NOT NULL,
  section_key TEXT NOT NULL,
  section_title TEXT NOT NULL,
  content TEXT DEFAULT '',
  sort_order INTEGER DEFAULT 0,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (application_id) REFERENCES applications(id)
);

CREATE INDEX IF NOT EXISTS idx_role_prep_app ON role_prep(application_id);

-- Seed default prep sections for existing applications
INSERT INTO role_prep (application_id, section_key, section_title, sort_order)
SELECT id, 'overview', 'Overview', 1 FROM applications;

INSERT INTO role_prep (application_id, section_key, section_title, sort_order)
SELECT id, 'go_sheet', 'GO Sheet', 2 FROM applications;

INSERT INTO role_prep (application_id, section_key, section_title, sort_order)
SELECT id, 'interview_process', 'Interview Process', 3 FROM applications;

INSERT INTO role_prep (application_id, section_key, section_title, sort_order)
SELECT id, 'people_intel', 'People Intel', 4 FROM applications;

INSERT INTO role_prep (application_id, section_key, section_title, sort_order)
SELECT id, 'company_research', 'Company Research', 5 FROM applications;

INSERT INTO role_prep (application_id, section_key, section_title, sort_order)
SELECT id, 'stories', 'Behavioural Stories', 6 FROM applications;

INSERT INTO role_prep (application_id, section_key, section_title, sort_order)
SELECT id, 'notes', 'Notes & Activity', 7 FROM applications;
