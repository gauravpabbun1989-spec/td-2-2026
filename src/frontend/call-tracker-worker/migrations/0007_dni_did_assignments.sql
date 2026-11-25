-- Dynamic number insertion: only explicitly enabled Telxio DIDs can be assigned.
ALTER TABLE traffic_clicks ADD COLUMN clickflare_click_id TEXT;
ALTER TABLE call_ringing_events ADD COLUMN clickflare_click_id TEXT;
ALTER TABLE call_ringing_events ADD COLUMN did_assignment_id TEXT;
ALTER TABLE inbound_calls ADD COLUMN clickflare_click_id TEXT;
ALTER TABLE inbound_calls ADD COLUMN did_assignment_id TEXT;
CREATE TABLE IF NOT EXISTS tracking_dids (
  did TEXT PRIMARY KEY,
  provider TEXT NOT NULL DEFAULT 'telxio',
  enabled INTEGER NOT NULL DEFAULT 0 CHECK(enabled IN (0,1)),
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  notes TEXT
);
CREATE TABLE IF NOT EXISTS did_assignments (
  assignment_id TEXT PRIMARY KEY,
  did TEXT NOT NULL,
  trafficstars_click_id TEXT,
  clickflare_click_id TEXT,
  assigned_at TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active','expired','released','consumed')),
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  FOREIGN KEY(did) REFERENCES tracking_dids(did),
  FOREIGN KEY(trafficstars_click_id) REFERENCES traffic_clicks(click_id)
);
CREATE INDEX IF NOT EXISTS idx_did_assignments_lookup ON did_assignments(did,assigned_at,expires_at);
CREATE INDEX IF NOT EXISTS idx_did_assignments_clickflare ON did_assignments(clickflare_click_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_did_assignments_one_active_did ON did_assignments(did) WHERE status='active';
