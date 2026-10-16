BEGIN;

CREATE TABLE IF NOT EXISTS facilities (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(160) NOT NULL,
  location_label VARCHAR(200) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS assets (
  id BIGSERIAL PRIMARY KEY,
  facility_id BIGINT NOT NULL REFERENCES facilities(id) ON DELETE RESTRICT,
  name VARCHAR(160) NOT NULL,
  asset_type VARCHAR(80) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT assets_id_facility_unique UNIQUE (id, facility_id)
);

CREATE TABLE IF NOT EXISTS maintenance_requests (
  id BIGSERIAL PRIMARY KEY,
  facility_id BIGINT NOT NULL REFERENCES facilities(id) ON DELETE RESTRICT,
  asset_id BIGINT NULL,
  title VARCHAR(160) NOT NULL CHECK (char_length(trim(title)) >= 3),
  description VARCHAR(2000),
  priority VARCHAR(10) NOT NULL DEFAULT 'medium' CHECK (priority IN ('low','medium','high','urgent')),
  status VARCHAR(20) NOT NULL DEFAULT 'open' CHECK (status IN ('open','in_progress','resolved','cancelled')),
  reported_by VARCHAR(120) NOT NULL,
  reported_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT request_asset_same_facility_fk
    FOREIGN KEY (asset_id, facility_id) REFERENCES assets(id, facility_id) ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS work_assignments (
  id BIGSERIAL PRIMARY KEY,
  maintenance_request_id BIGINT NOT NULL REFERENCES maintenance_requests(id) ON DELETE CASCADE,
  assignee_label VARCHAR(120) NOT NULL,
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  notes VARCHAR(1000)
);

CREATE INDEX IF NOT EXISTS idx_requests_facility_status ON maintenance_requests(facility_id, status);
CREATE INDEX IF NOT EXISTS idx_requests_reported_at ON maintenance_requests(reported_at DESC);
CREATE INDEX IF NOT EXISTS idx_assets_facility ON assets(facility_id);
CREATE INDEX IF NOT EXISTS idx_assignments_request ON work_assignments(maintenance_request_id);

COMMIT;
