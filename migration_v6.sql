-- Migration v6: RAG status for projects
-- Run via: wrangler d1 execute signal-os-db --remote --file=migration_v6.sql

ALTER TABLE projects ADD COLUMN rag_status TEXT DEFAULT '';
