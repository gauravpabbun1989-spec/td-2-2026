-- Add conservative click-intent attribution to the first FreeSWITCH ringing event.
-- Existing ringing events remain explicitly unverified; no postbacks are enabled.
ALTER TABLE call_ringing_events ADD COLUMN click_id TEXT;
ALTER TABLE call_ringing_events ADD COLUMN attribution_status TEXT NOT NULL DEFAULT 'not_verified';
ALTER TABLE call_ringing_events ADD COLUMN attribution_method TEXT;
ALTER TABLE call_ringing_events ADD COLUMN matched_intent_id TEXT;

CREATE INDEX IF NOT EXISTS idx_call_ringing_events_attribution
  ON call_ringing_events(attribution_status, ringing_at);
