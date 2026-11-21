-- Add conservative, reviewable intent-to-call correlation.
-- Existing call rows remain unmatched. No accepted-call or conversion state is changed.
ALTER TABLE call_intents ADD COLUMN matched_call_uuid TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS idx_call_intents_matched_call_uuid
  ON call_intents(matched_call_uuid)
  WHERE matched_call_uuid IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_call_intents_open_created_at
  ON call_intents(status, created_at);

ALTER TABLE inbound_calls ADD COLUMN attribution_status TEXT NOT NULL DEFAULT 'unmatched';
ALTER TABLE inbound_calls ADD COLUMN attribution_method TEXT;
ALTER TABLE inbound_calls ADD COLUMN matched_intent_id TEXT;
CREATE INDEX IF NOT EXISTS idx_inbound_calls_attribution_status
  ON inbound_calls(attribution_status, created_record_at);

-- Record the first FreeSWITCH ringing event as the configured TrafficStars goal.
-- One row per FreeSWITCH UUID prevents retries and repeated ring notifications
-- from creating duplicate conversion events.
CREATE TABLE IF NOT EXISTS call_ringing_events (
  call_uuid TEXT PRIMARY KEY,
  destination TEXT NOT NULL,
  agent_extension TEXT NOT NULL,
  ringing_at TEXT NOT NULL,
  goal_id TEXT NOT NULL DEFAULT '6487',
  event_type TEXT NOT NULL DEFAULT 'call_ringing',
  created_record_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_call_ringing_events_ringing_at
  ON call_ringing_events(ringing_at);
