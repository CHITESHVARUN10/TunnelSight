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
-- Per-user analysis history. status 'pending' on upload; pipeline fills
-- config_json + ML/rule-engine columns. Mirrors app/models/analysis.py.
CREATE TABLE IF NOT EXISTS analyses (
    id            UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id       UUID         NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    filename      VARCHAR(255) NOT NULL,          -- uploaded capture name
    status        VARCHAR(32)  NOT NULL DEFAULT 'pending',
    config_json   JSONB        NULL,              -- normalized IPsec evidence (roadmap S9)
    anomaly_score DOUBLE PRECISION NULL,         -- Isolation Forest score
    traffic_label VARCHAR(32)  NULL,              -- RF classifier: video/web/voip/icmp/email
    traffic_confidence DOUBLE PRECISION NULL,    -- max class probability 0..1
    security_score INTEGER     NULL,              -- rule-engine total 0..100
    risk_level    VARCHAR(32)  NULL,              -- LOW/MEDIUM/HIGH/CRITICAL
    findings_json JSONB        NULL,              -- rule-engine findings list [{severity, category, description}]
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS ix_analyses_user_id ON analyses (user_id);
-- Upgrade path for databases created before these columns existed (idempotent):
ALTER TABLE analyses ADD COLUMN IF NOT EXISTS anomaly_score DOUBLE PRECISION NULL;
ALTER TABLE analyses ADD COLUMN IF NOT EXISTS traffic_label VARCHAR(32) NULL;
ALTER TABLE analyses ADD COLUMN IF NOT EXISTS traffic_confidence DOUBLE PRECISION NULL;
ALTER TABLE analyses ADD COLUMN IF NOT EXISTS security_score INTEGER NULL;
ALTER TABLE analyses ADD COLUMN IF NOT EXISTS risk_level VARCHAR(32) NULL;
ALTER TABLE analyses ADD COLUMN IF NOT EXISTS findings_json JSONB NULL;

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
