-- ============================================================================
-- TunnelSight — PostgreSQL schema (source of truth for teammates)
-- Mirrors the SQLAlchemy models in backend/app/models/ :
--   users          <- app/models/user.py
--   sessions       <- app/models/session.py
--   analyses       <- app/models/analysis.py
--   password_resets<- app/models/password_reset.py
--   profiles       <- app/models/profile.py
-- If you change a model, update this file too (and vice versa).
--
-- Usage (local Postgres, no Docker):
--   psql -U <your_pg_user> -d postgres -c "CREATE DATABASE tunnelsight;"
--   psql -U <your_pg_user> -d tunnelsight -f backend/schema.sql
-- Later NeonDB: run this same file with NeonDB's psql connection string.
-- Idempotent: safe to re-run (CREATE TABLE IF NOT EXISTS + indexes).
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ---------------------------------------------------------------- users ---
CREATE TABLE IF NOT EXISTS users (
    id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    email         VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,          -- bcrypt hash, never plaintext
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS ix_users_email ON users (email);

-- ------------------------------------------------------------- sessions ---
-- Server-side sessions. id = opaque token in the `ts_session` httpOnly
-- cookie (session auth, no JWT). Row deleted on logout/expiry.
CREATE TABLE IF NOT EXISTS sessions (
    id         VARCHAR(64) PRIMARY KEY,           -- secrets.token_urlsafe(32)
    user_id    UUID        NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS ix_sessions_user_id ON sessions (user_id);

-- ------------------------------------------------------------- analyses ---
-- Per-user analysis history. Phase 1: status is 'pending'; config_json and
-- anomaly_score are filled by later pipeline phases.
CREATE TABLE IF NOT EXISTS analyses (
    id            UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id       UUID         NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    filename      VARCHAR(255) NOT NULL,          -- uploaded capture name
    status        VARCHAR(32)  NOT NULL DEFAULT 'pending',
    config_json   JSONB        NULL,              -- normalized IPsec evidence (roadmap S9)
    anomaly_score DOUBLE PRECISION NULL,         -- Isolation Forest 0..1
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS ix_analyses_user_id ON analyses (user_id);

-- ------------------------------------------------------ password_resets ---
-- Single-use reset tokens. Only token_hash is stored; the raw token goes
-- to the user's email. Consume by setting used_at; reject expired/used.
CREATE TABLE IF NOT EXISTS password_resets (
    id         UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id    UUID         NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL UNIQUE,     -- sha256(raw_token)
    expires_at TIMESTAMPTZ  NOT NULL,            -- e.g. now() + interval '1 hour'
    used_at    TIMESTAMPTZ  NULL,
    created_at TIMESTAMPTZ  NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS ix_password_resets_user_id ON password_resets (user_id);
CREATE INDEX IF NOT EXISTS ix_password_resets_token_hash ON password_resets (token_hash);

-- ------------------------------------------------------------ profiles ---
-- Analyst profile, 1-to-1 with users. Row auto-created on registration.
CREATE TABLE IF NOT EXISTS profiles (
    id           UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id      UUID         NOT NULL UNIQUE REFERENCES users (id) ON DELETE CASCADE,
    display_name VARCHAR(255) NULL,
    organization VARCHAR(255) NULL,
    role         VARCHAR(255) NULL,
    timezone     VARCHAR(64)  NULL,
    created_at   TIMESTAMPTZ  NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS ix_profiles_user_id ON profiles (user_id);
