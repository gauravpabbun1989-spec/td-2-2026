-- One-time DTMF tokens connect a browser click to one original FreeSWITCH call.
-- Only a SHA-256 digest is stored; the short-lived token is consumed by one call UUID.
CREATE TABLE IF NOT EXISTS call_tracking_tokens (
  token_hash TEXT PRIMARY KEY,
  click_id TEXT NOT NULL,
  created_at TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  consumed_at TEXT,
  consumed_call_uuid TEXT,
  FOREIGN KEY (click_id) REFERENCES traffic_clicks(click_id)
);

CREATE INDEX IF NOT EXISTS idx_call_tracking_tokens_expiry
  ON call_tracking_tokens(expires_at, consumed_at);
