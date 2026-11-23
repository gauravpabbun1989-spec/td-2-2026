# TicketDepart call-tracker Worker

This directory is the source-controlled implementation for the existing Cloudflare Worker `ticketdepart-call-tracker`.

## Bindings and secrets

The Wrangler configuration binds the existing D1 database `ticketdepart-call-tracking` as `DB`. Keep these existing values as Cloudflare Worker secrets; do not add them to Git:

- `CALL_INGEST_SECRET`
- `INGEST_SECRET`
- `TRAFFICSTARS_POSTBACK_KEY`

Do not rotate or replace the existing TrafficStars postback key as part of routine deployment.

## Click-to-call correlation and attribution safety

The website can record a TrafficStars click ID and a phone-call intent. The shared toll-free PSTN route forwards calls to FreeSWITCH destination `1030605`, then extension `1001`; that route does not, by itself, transport the browser click ID. Calls from every source can therefore be recorded at FreeSWITCH, but the call's source cannot be proven from the destination or timestamps.

**Fail-closed rule:** time-window correlation is disabled. A nearby website intent is not proof that the caller came from that click. All calls are retained as `unmatched` with no click ID until a verified call-session identifier is carried into FreeSWITCH and linked to the exact FreeSWITCH call UUID. Do not re-enable timestamp-based matching.


## Conversion milestone: first real ring

The configured conversion milestone is the first real inbound ring offered by FreeSWITCH to extension `1001`. A missed or unanswered call counts if it actually rang at FreeSWITCH. Answering the call is not required for this ring conversion.

FreeSWITCH sends `POST /v1/calls/ringing` using the existing `CALL_INGEST_SECRET` bearer authentication and:
- `call_uuid` (FreeSWITCH UUID)
- `destination` (`1030605`)
- `agent_extension` (`1001`)
- `ringing_at` (ISO timestamp)

The Worker stores one `call_ringing_events` row per call UUID with Goal ID `6487`. Repeated notifications are idempotent. Calls that reach FreeSWITCH but never ring are not ringing conversions.

## TrafficStars postback delivery

Postbacks are gated by `TRAFFICSTARS_POSTBACK_ENABLED=true` and the already-configured `TRAFFICSTARS_POSTBACK_KEY`. Keep the feature disabled until the signed call-session transport is implemented, verified through an approved real call, and the user explicitly approves enabling it. Do not create test calls or test conversions.

When enabled, only an event marked `verified` with attribution method `signed_call_session` and a non-empty click ID can send Goal `6487`. The FreeSWITCH call UUID is the stable `lead_code` on every attempt. Legacy `candidate` events produced by timestamp matching are not eligible. HTTP 408, 429, 5xx, and network failures are retried by the once-per-minute scheduled Worker with exponential backoff (maximum six attempts). Permanent 4xx rejections are recorded without retry. A successful 2xx response is recorded as sent. No postback is sent for unmatched or ambiguous calls.

The retry schedule does not enable postbacks. Events recorded while postbacks are disabled remain `not_sent`; enabling the flag is a separate, explicit production decision.

The separate completed-call sync and `/v1/calls/accepted` endpoint are not the configured conversion milestone. Do not report accepted-call qualification or payout from a ringing event.

## Migrations and deployment

Apply additive migrations in order to the existing D1 database:
1. `0002_intent_call_correlation.sql`
2. `0003_ringing_click_attribution.sql`
3. `0004_trafficstars_postback_status.sql`
4. `0005_postback_retry_schedule.sql`

The production deploy workflow applies pending remote migrations before deploying only `ticketdepart-call-tracker`. The scheduled retry handler runs once per minute. It does not send anything while the postback feature flag is disabled.
