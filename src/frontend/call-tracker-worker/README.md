# TicketDepart call-tracker Worker

This directory is the source-controlled implementation for the existing Cloudflare Worker `ticketdepart-call-tracker`.

## Bindings and secrets

The Wrangler configuration binds the existing D1 database `ticketdepart-call-tracking` as `DB`. Keep these existing values as Cloudflare Worker secrets; do not add them to Git:

- `CALL_INGEST_SECRET`
- `INGEST_SECRET`
- `TRAFFICSTARS_POSTBACK_KEY`

Do not rotate or replace the existing TrafficStars postback key as part of routine deployment.

## Click-to-call correlation

The browser records a TrafficStars click and a phone-call intent. The single-DID PSTN route (DID `1030605` to agent extension `1001`) does not transport the browser click ID. No caller-number or SIP-header value currently joins those two records.

The Worker uses conservative *candidate* matching:
- The ringing endpoint looks back 10 minutes from `ringing_at`, allowing 30 seconds of future clock skew.
- A match is made only when the time window contains exactly one distinct TrafficStars click ID. Multiple distinct IDs are marked `ambiguous`; no intent is `unmatched`.
- The nearest intent is reserved to one FreeSWITCH call UUID. Retries do not rematch an existing ringing event.
- Matches are labeled `candidate` with method `unique_intent_time_window`; this is best-effort time-window attribution, not proof that a caller came from that ad click.

## Conversion milestone: first real ring

The configured conversion milestone is the first real inbound ring offered by FreeSWITCH to extension `1001`. A missed or unanswered call counts if it actually rang at FreeSWITCH. Answering the call is not required for this ring conversion.

FreeSWITCH sends `POST /v1/calls/ringing` using the existing `CALL_INGEST_SECRET` bearer authentication and:
- `call_uuid` (FreeSWITCH UUID)
- `destination` (`1030605`)
- `agent_extension` (`1001`)
- `ringing_at` (ISO timestamp)

The Worker stores one `call_ringing_events` row per call UUID with Goal ID `6487`. Repeated notifications are idempotent. Calls that reach FreeSWITCH but never ring are not ringing conversions.

## TrafficStars postback delivery

Postbacks are gated by `TRAFFICSTARS_POSTBACK_ENABLED=true` and the already-configured `TRAFFICSTARS_POSTBACK_KEY`. Keep the feature disabled until a real click-to-ring test has verified the event and attribution and the user explicitly approves enabling it.

When enabled, only a uniquely matched `candidate` event can send Goal `6487`. The FreeSWITCH call UUID is the stable `lead_code` on every attempt. HTTP 408, 429, 5xx, and network failures are retried by the once-per-minute scheduled Worker with exponential backoff (maximum six attempts). Permanent 4xx rejections are recorded without retry. A successful 2xx response is recorded as sent. No postback is sent for unmatched or ambiguous calls.

The retry schedule does not enable postbacks. Events recorded while postbacks are disabled remain `not_sent`; enabling the flag is a separate, explicit production decision.

The separate completed-call sync and `/v1/calls/accepted` endpoint are not the configured conversion milestone. Do not report accepted-call qualification or payout from a ringing event.

## Migrations and deployment

Apply additive migrations in order to the existing D1 database:
1. `0002_intent_call_correlation.sql`
2. `0003_ringing_click_attribution.sql`
3. `0004_trafficstars_postback_status.sql`
4. `0005_postback_retry_schedule.sql`

The production deploy workflow applies pending remote migrations before deploying only `ticketdepart-call-tracker`. The scheduled retry handler runs once per minute. It does not send anything while the postback feature flag is disabled.
