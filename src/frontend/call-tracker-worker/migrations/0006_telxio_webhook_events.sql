-- Telxio provider webhook intake. Store identifiers and hashes only; do not retain raw phone numbers or payloads.
CREATE TABLE IF NOT EXISTS telxio_webhook_events (
  provider_event_id TEXT PRIMARY KEY,
  event_type TEXT NOT NULL,
  provider_call_id TEXT,
  caller_number_hash TEXT,
  called_number TEXT,
  event_at TEXT,
  received_at TEXT NOT NULL,
  payload_sha256 TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_telxio_webhook_call_id
  ON telxio_webhook_events(provider_call_id);
CREATE INDEX IF NOT EXISTS idx_telxio_webhook_received_at
  ON telxio_webhook_events(received_at);
