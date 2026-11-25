# TicketDepart call-tracker Worker

This directory is the source-controlled implementation for the existing Cloudflare Worker `ticketdepart-call-tracker`.

## Production call route

- Public toll-free number: `+1-888-564-9049`
- Telxio / FreeSWITCH inbound alias: `1030605`
- Agent extension: `1001`
- No IVR, keypad, extra DID pool, or call-session code is required.
- The existing direct-dial caller experience is preserved.

The first real ring offered to agent extension `1001` is the call conversion milestone. Answer and hangup timestamps remain separate call details. A call is not converted merely because it reached the FreeSWITCH host; the agent leg must actually ring.

## Single-number click attribution

The site captures and stores both identifiers from the ClickFlare landing URL:

- `click_id`: the original TrafficStars click ID carried as ClickFlare External ID
- `cf_click_id`: the unique ClickFlare visit ID

When a visitor taps a `tel:` link, the site sends a call-intent event containing both IDs. The Worker may reserve a unique intent within a ten-minute window for diagnostic reporting, but this is only a `candidate` match. It is not proof that the PSTN caller is the browser visitor who tapped the link. The single shared toll-free number carries no click identifier over the phone network.

A candidate is therefore **never a paid conversion**. Multiple candidate intents, intervening calls, missing IDs, and unmatched calls remain ambiguous or unmatched. The intent reservation is atomic and cannot be reused. No synthetic click IDs or timestamp-only guesses are created.

## ClickFlare and TrafficStars S2S

ClickFlare S2S conversions are sent only for a verified one-to-one DNI assignment (`attribution_status=verified`, `attribution_method=dni_did`) that carries both the TrafficStars External ID and ClickFlare visit ID. A single-number time-window candidate is excluded from conversion delivery, even when the ClickFlare feature flag is enabled.

The conversion payload, when a verified DID assignment exists, uses:

- ClickFlare `click_id` = the captured `cf_click_id`
- `payout=15`
- `txid` = FreeSWITCH call UUID (deduplication key)
- `ct=call`

ClickFlare then uses the configured TrafficStars source postback to return the original External ID to TrafficStars Goal `6487`. Duplicate call UUIDs are idempotent and retry records use the same transaction ID. The production `CLICKFLARE_POSTBACK_ENABLED` flag remains `false`; the current account has no enabled tracking DID pool, so the single-number configuration must not generate paid conversions.

The separate legacy direct TrafficStars sender remains restricted to verified signed-call sessions. The normal single-number flow does not send a conversion.

## Bindings and secrets

The Wrangler configuration binds the existing D1 database `ticketdepart-call-tracking` as `DB`. Keep these existing values as Cloudflare Worker secrets; do not add them to Git:

- `CALL_INGEST_SECRET`
- `INGEST_SECRET`
- `TRAFFICSTARS_POSTBACK_KEY`
- `TELXIO_WEBHOOK_TOKEN`

Do not rotate or replace existing secrets as part of this change. The original TrafficStars postback key remains inside ClickFlare's configured traffic-source integration; no key is committed to this repository.

## Persistence and safety

The Worker stores one ring event per FreeSWITCH call UUID. It keeps the call's attributed IDs, attribution method/status, matched intent, ClickFlare conversion attempts, and postback result in D1. Only a verified DNI assignment can create a ClickFlare conversion. Single-number candidates, unmatched calls, and ambiguous calls never create conversions.

The call-intent event is intent telemetry, not a conversion. The conversion occurs only on the first actual agent-1001 ringing event. Answered-at, hangup-at, and billsec are stored separately.

## Telxio webhook

The authenticated provider endpoint is `POST /webhook/telxio/{token}`. It stores deduplicated provider event metadata and never creates conversions. FreeSWITCH remains the canonical source for agent ringing and call UUID correlation.
