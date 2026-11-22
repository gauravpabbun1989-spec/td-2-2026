# TicketDepart call-tracker Worker

This directory is the source-controlled implementation for the existing Cloudflare Worker `ticketdepart-call-tracker`.

## Bindings and secrets

The Wrangler configuration binds the existing D1 database `ticketdepart-call-tracking` as `DB`. Keep these existing values as Cloudflare Worker secrets; do not add them to Git:

- `CALL_INGEST_SECRET`
- `INGEST_SECRET`
- `TRAFFICSTARS_POSTBACK_KEY`

Do not rotate or replace the existing TrafficStars postback key as part of routine deployment.

## Click-to-call correlation and attribution safety

The website can record a TrafficStars click ID and phone-call intent. For a click-attributed visit, it prefetches an eight-digit, one-time DTMF token from `POST /v1/call-token` and appends it as post-dial digits to the existing `tel:` link. The Worker stores only the SHA-256 token hash, click ID, creation time, and 30-minute expiry. The website does not delay or block the native dialer if token prefetch fails.

The FreeSWITCH inbound route must answer the caller, collect the eight digits with `play_and_get_digits`, export `td_tracking_token` to the bridged agent leg, and then continue to extension `1001`. The collector forwards that token with the first agent-ringing event. The Worker consumes the token once and binds it to the exact FreeSWITCH call UUID. A valid token is recorded as `verified` with attribution method `one_time_dtmf_token`.

**Dialer limitation:** Android and iOS dialers do not all handle post-dial pauses and DTMF identically. A call without a transmitted or manually entered token must still reach the agent, but remains `unmatched`. Do not claim complete attribution until the FreeSWITCH route is configured and an approved real call confirms token delivery.

**Fail-closed rule:** time-window correlation remains disabled. A nearby website intent is not proof that the caller came from that click. Never infer a click ID from caller number, destination, or timestamps.


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

## Deployment gate

This change is not production-ready until the FreeSWITCH route for DID `1030605` is updated to answer the inbound leg, collect the eight DTMF digits, export `td_tracking_token` to the agent bridge, and then preserve the existing transfer to `1001`. Confirm the prompt WAV exists on the VPS before applying that route. The currently installed public route still transfers directly to `1001`, so it does not yet collect or forward a token.

Do not deploy only the Worker or website portion and assume calls are attributable. The website and Worker can be deployed with fail-closed behavior, but verified DTMF attribution will remain unavailable until the FreeSWITCH route and collector are updated together. The production D1 migration, Worker deployment, website deployment, and live dialplan update are separate approval gates. A real call is required to verify actual post-dial behavior; automated tests cannot establish Android/iOS dialer compatibility.

## Migrations and deployment

Apply additive migrations in order to the existing D1 database:
1. `0002_intent_call_correlation.sql`
2. `0003_ringing_click_attribution.sql`
3. `0004_trafficstars_postback_status.sql`
4. `0005_postback_retry_schedule.sql`

The production deploy workflow applies pending remote migrations before deploying only `ticketdepart-call-tracker`. The scheduled retry handler runs once per minute. It does not send anything while the postback feature flag is disabled.
