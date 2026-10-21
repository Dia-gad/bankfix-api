BEGIN;

CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(120) NOT NULL CHECK (char_length(trim(name)) >= 2),
  email VARCHAR(254) NOT NULL,
  password_hash VARCHAR(100) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'requester' CHECK (role IN ('requester', 'admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email_lower ON users (LOWER(email));

ALTER TABLE maintenance_requests
  ADD COLUMN IF NOT EXISTS created_by_user_id BIGINT NULL REFERENCES users(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_requests_owner ON maintenance_requests(created_by_user_id);

COMMIT;
