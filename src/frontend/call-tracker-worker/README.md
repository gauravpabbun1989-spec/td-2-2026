# TicketDepart call-tracker Worker

This directory is the source-controlled implementation for the existing Cloudflare Worker `ticketdepart-call-tracker`.

## Bindings and secrets

The Wrangler configuration binds the existing D1 database `ticketdepart-call-tracking` as `DB`. Keep these existing values as Cloudflare Worker secrets; do not add them to Git:

- `CALL_INGEST_SECRET`
- `INGEST_SECRET`
- `TRAFFICSTARS_POSTBACK_KEY`

## Click-to-call correlation

The browser records a TrafficStars click and a phone-call intent. The single-DID PSTN route (DID `1030605` to agent extension `1001`) does not transport the browser click ID. No caller-number or SIP-header value currently joins those two records.

The Worker therefore uses a deliberately conservative *candidate* match:
- Look back 10 minutes from the FreeSWITCH call's `created_at`, allowing 30 seconds of clock skew into the future.
- Match only when the open intents in that interval contain exactly one distinct TrafficStars click ID.
- If multiple click IDs are present, mark the intents ambiguous and leave the call unlinked. If there are no intents, leave it unmatched.
- Reserve the selected intent to one FreeSWITCH call UUID. Repeated syncs do not rematch an existing call.
- Candidate matches are explicitly labeled `candidate` with method `unique_intent_time_window`; they are not verified attribution.

This is best-effort correlation, not proof that a caller came from that click. It may miss calls when no intent beacon arrives, and a coincidental unrelated call can still fall in the interval. Do not treat candidates as accepted-call conversions without a separate verification step.

## Ringing conversion event

FreeSWITCH must notify `POST /v1/calls/ringing` as soon as the inbound call is actually offered/ringing on extension `1001`. The request uses the existing `CALL_INGEST_SECRET` bearer authentication and contains only:
- `call_uuid` (FreeSWITCH UUID)
- `destination` (`1030605`)
- `agent_extension` (`1001`)
- `ringing_at` (ISO timestamp)

The Worker stores one `call_ringing_events` row per call UUID with Goal ID `6487`. Repeated notifications are idempotent. Calls that reach FreeSWITCH but never ring are not recorded as conversions; unanswered/missed calls that did ring are recorded.

This endpoint records the conversion event but deliberately does not send a TrafficStars postback yet. The existing time-window click match is only a candidate and can misattribute unrelated calls. A safe postback requires verified click attribution. The local FreeSWITCH event listener still needs to be configured to call this endpoint on the real ringing event; this PR does not alter the live server or deploy the Worker.

## Qualification and postbacks

Unanswered calls, voicemail, and test calls must not count as accepted calls. Qualification must use the actual answered agent leg and billable duration. No numeric minimum duration has been approved yet, so this Worker does not mark calls accepted. The `/v1/calls/accepted` endpoint continues to return HTTP 409. No accepted-call conversion rows or TrafficStars postbacks are created. The separate ringing event is recorded as described above.

## Migration and deployment

Apply `migrations/0002_intent_call_correlation.sql` to the existing D1 database before deploying the updated Worker. This PR only adds the migration file and Worker code; it does not run the migration, deploy the Worker, change FreeSWITCH, or send TrafficStars postbacks.

The GitHub Actions workflow validates the Worker bundle and focused tests.
