-- Durable retry metadata for TrafficStars ring-event postbacks.
-- Existing rows remain not_sent and are never automatically replayed.
ALTER TABLE call_ringing_events ADD COLUMN postback_attempt_count INTEGER NOT NULL DEFAULT 0;
ALTER TABLE call_ringing_events ADD COLUMN postback_next_retry_at TEXT;
ALTER TABLE call_ringing_events ADD COLUMN postback_last_error TEXT;

CREATE INDEX IF NOT EXISTS idx_call_ringing_events_retry_due
  ON call_ringing_events(postback_status, postback_next_retry_at, postback_attempt_count);
