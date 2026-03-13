-- AgentDash Database Schema

-- Agents table: tracks all Claude Code instances
CREATE TABLE IF NOT EXISTS agents (
    agent_id TEXT PRIMARY KEY,
    agent_name TEXT,
    status TEXT DEFAULT 'working' CHECK (status IN ('working', 'starting', 'blocked', 'idle', 'finished', 'disconnected', 'crashed', 'error', 'awaiting_input')),
    terminal TEXT,
    cwd TEXT,
    last_activity TIMESTAMP,
    session_start TIMESTAMP,
    metadata TEXT, -- JSON
    current_run_id TEXT,
    current_task TEXT,
    current_session_id TEXT,
    total_runs INTEGER DEFAULT 0,
    total_tasks INTEGER DEFAULT 0,
    total_errors INTEGER DEFAULT 0,
    total_tokens INTEGER DEFAULT 0,
    total_duration_ms INTEGER DEFAULT 0,
    session_runs INTEGER DEFAULT 0,
    session_errors INTEGER DEFAULT 0,
    session_tokens INTEGER DEFAULT 0,
    source_file TEXT,
    status_since TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_agents_status ON agents(status);
CREATE INDEX IF NOT EXISTS idx_agents_last_activity ON agents(last_activity DESC);
CREATE INDEX IF NOT EXISTS idx_agents_terminal ON agents(terminal);
CREATE INDEX IF NOT EXISTS idx_agents_cwd ON agents(cwd);

-- Events table: stores all monitoring events
CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    agent_id TEXT,
    run_id TEXT,
    task_id TEXT,
    type TEXT NOT NULL,
    ts TEXT NOT NULL,
    summary TEXT,
    status TEXT,
    duration_ms INTEGER,
    tokens TEXT, -- JSON
    error TEXT,  -- JSON
    payload TEXT, -- JSON
    trace_id TEXT,
    span_id TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_events_agent_id ON events(agent_id);
CREATE INDEX IF NOT EXISTS idx_events_run_id ON events(run_id);
CREATE INDEX IF NOT EXISTS idx_events_type ON events(type);
CREATE INDEX IF NOT EXISTS idx_events_ts ON events(ts DESC);

-- Personal tasks table: user-created calendar notes/tasks
CREATE TABLE IF NOT EXISTS personal_tasks (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_personal_tasks_start ON personal_tasks(start_time);

-- User preferences table: key-value store for server-side preferences
CREATE TABLE IF NOT EXISTS user_preferences (
  key   TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Per-message token counts: one row per user/assistant message
-- Populated by the API proxy (single source of truth for token counting)
CREATE TABLE IF NOT EXISTS message_tokens (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  agent_id    TEXT NOT NULL,
  run_id      TEXT NOT NULL,
  msg_index   INTEGER NOT NULL,
  role        TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  tokens      INTEGER NOT NULL,
  cost_usd    REAL,
  model       TEXT,
  ts          TEXT NOT NULL,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_msg_tokens_agent ON message_tokens(agent_id);
CREATE INDEX IF NOT EXISTS idx_msg_tokens_run   ON message_tokens(run_id);

-- ─── Cloud / multi-tenant tables ──────────────────────────────────────────────
-- Only populated when CLOUD_MODE=true. Local installs leave all org/user columns NULL.

-- Organizations: one row per company/team that signs up
CREATE TABLE IF NOT EXISTS organizations (
  id         TEXT PRIMARY KEY,
  name       TEXT NOT NULL,
  slug       TEXT UNIQUE NOT NULL,
  plan       TEXT NOT NULL DEFAULT 'free',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Users: synced from Clerk via webhook. id = Clerk's user_id ("user_2abc...")
-- role and org_id are ours — Clerk only handles authentication.
CREATE TABLE IF NOT EXISTS users (
  id         TEXT PRIMARY KEY,
  email      TEXT UNIQUE NOT NULL,
  name       TEXT,
  org_id     TEXT REFERENCES organizations(id),
  role       TEXT CHECK (role IN ('admin', 'developer')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_email  ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_org_id ON users(org_id);

-- Org API keys: used by local Marionette installs to report events to the cloud.
-- The raw key is shown once at creation; only the SHA-256 hash is stored.
CREATE TABLE IF NOT EXISTS org_api_keys (
  id         TEXT PRIMARY KEY,
  org_id     TEXT NOT NULL REFERENCES organizations(id),
  key_hash   TEXT UNIQUE NOT NULL,
  label      TEXT,
  created_by TEXT REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_org_api_keys_org  ON org_api_keys(org_id);
CREATE INDEX IF NOT EXISTS idx_org_api_keys_hash ON org_api_keys(key_hash);

-- Add user/org attribution to existing tables (nullable — local events have none).
-- IF NOT EXISTS requires SQLite 3.37+ (shipped with better-sqlite3 v11).
ALTER TABLE events ADD COLUMN IF NOT EXISTS user_id TEXT REFERENCES users(id);
ALTER TABLE events ADD COLUMN IF NOT EXISTS org_id  TEXT REFERENCES organizations(id);
ALTER TABLE message_tokens ADD COLUMN IF NOT EXISTS user_id TEXT REFERENCES users(id);
ALTER TABLE message_tokens ADD COLUMN IF NOT EXISTS org_id  TEXT REFERENCES organizations(id);
