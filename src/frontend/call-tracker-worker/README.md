# TicketDepart call-tracker Worker

This directory is the source-controlled implementation for the existing Cloudflare Worker `ticketdepart-call-tracker`.

## Bindings and secrets

The Wrangler configuration binds the existing D1 database `ticketdepart-call-tracking` as `DB`. Keep these existing values as Cloudflare Worker secrets; do not add them to Git:

- `CALL_INGEST_SECRET`
- `INGEST_SECRET`
- `TRAFFICSTARS_POSTBACK_KEY`

## Click-to-call correlation

The browser records a TrafficStars click and a phone-call intent. The single-DID PSTN route (DID `1030605` to agent extension `1001`) does not transport the browser click ID. No caller-number or SIP-header value currently joins those two records.

The Worker uses conservative *candidate* matching in two places:
- Completed-call sync looks back 10 minutes from the FreeSWITCH call's `created_at`, allowing 30 seconds of future clock skew.
- The ringing endpoint looks back 10 minutes from `ringing_at`, with the same 30-second skew allowance, so the intent is correlated at the user's configured ringing milestone.
- A match is made only when the time window contains exactly one distinct TrafficStars click ID. Multiple distinct IDs are marked `ambiguous`; no intent is `unmatched`.
- The nearest intent is reserved to one FreeSWITCH call UUID. Retries do not rematch an existing ringing event.
- Matches are labeled `candidate` with method `unique_intent_time_window`; they are not verified attribution.

## Ringing conversion event

FreeSWITCH must notify `POST /v1/calls/ringing` as soon as the inbound call is actually offered/ringing on extension `1001`. The request uses the existing `CALL_INGEST_SECRET` bearer authentication and contains only:
- `call_uuid` (FreeSWITCH UUID)
- `destination` (`1030605`)
- `agent_extension` (`1001`)
- `ringing_at` (ISO timestamp)

The Worker stores one `call_ringing_events` row per call UUID with Goal ID `6487`. Repeated notifications are idempotent. Calls that reach FreeSWITCH but never ring are not recorded as ringing events; unanswered/missed calls that did ring are recorded.

At ring time, the Worker stores the matched click ID and attribution status/method on the same ringing row. A `candidate` is still best-effort time-window attribution, not proof that the caller came from that ad click. The local FreeSWITCH event listener is already configured to call this endpoint on the real ringing event. This PR changes Worker source and tests only; it does not alter the live server or deploy the Worker.

## Qualification and postbacks

Unanswered calls, voicemail, and test calls must not count as accepted calls. Qualification must use the actual answered agent leg and billable duration. No numeric minimum duration has been approved yet, so this Worker does not mark calls accepted. The `/v1/calls/accepted` endpoint continues to return HTTP 409. No accepted-call conversion rows or TrafficStars postbacks are created. The separate ringing event is recorded as described above.

## Migration and deployment

Apply migrations in order to the existing D1 database: `0002_intent_call_correlation.sql`, `0003_ringing_click_attribution.sql`, then `0004_trafficstars_postback_status.sql`. The production deploy workflow applies pending remote migrations before deploying the Worker. Postback sending remains gated by `TRAFFICSTARS_POSTBACK_ENABLED` and the `TRAFFICSTARS_POSTBACK_KEY` secret; do not enable the campaign until the secret is rotated/configured and a real click-to-ring test confirms a uniquely attributed event and successful postback.

The GitHub Actions workflow validates the Worker bundle and focused tests.
