-- Track TrafficStars S2S postback delivery for each unique ringing event.
-- A stable call UUID is sent as lead_code, making retries idempotent at TrafficStars.
ALTER TABLE call_ringing_events ADD COLUMN postback_status TEXT NOT NULL DEFAULT 'not_sent';
ALTER TABLE call_ringing_events ADD COLUMN postback_attempted_at TEXT;
ALTER TABLE call_ringing_events ADD COLUMN postback_http_status INTEGER;

CREATE INDEX IF NOT EXISTS idx_call_ringing_events_postback_status
  ON call_ringing_events(postback_status, ringing_at);
