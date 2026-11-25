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

When a visitor taps a `tel:` link, the site sends a call-intent event containing both IDs. The Worker uses the following conservative single-number correlation:

1. A call may match only one unclaimed website phone-click intent from the previous ten minutes.
2. The intent must have a stored ClickFlare ID and original TrafficStars click ID.
3. No other inbound agent-ring event may have occurred after that intent and before the current ring.
4. Multiple candidate intents, intervening calls, missing IDs, and unmatched calls are not attributed.
5. An intent is atomically reserved to one FreeSWITCH call UUID and cannot be reused for another call.

The resulting method is recorded explicitly as `single_number_unique_intent_window` with status `candidate`. This is a unique time-window correlation using the one shared DID, not per-caller DNI or cryptographic proof of caller identity. Calls that cannot be matched uniquely remain unmatched or ambiguous. No synthetic click IDs or timestamp-only guesses are created.

## ClickFlare and TrafficStars S2S

When a unique single-number intent is matched, the Worker sends a ClickFlare S2S conversion to `https://globalvisitlog.com/cf/cv` with:

- ClickFlare `click_id` = the captured `cf_click_id`
- `payout=15`
- `txid` = FreeSWITCH call UUID (deduplication key)
- `ct=call`

ClickFlare then uses the campaign's configured TrafficStars source postback to relay the original External ID back to TrafficStars Goal `6487`. The ClickFlare conversion flag is enabled in Wrangler configuration; duplicate call UUIDs are idempotent and retries retain the same transaction ID.

The separate legacy direct TrafficStars sender remains restricted to verified signed-call sessions; the normal single-number flow uses ClickFlare as the one downstream S2S path.

## Bindings and secrets

The Wrangler configuration binds the existing D1 database `ticketdepart-call-tracking` as `DB`. Keep these existing values as Cloudflare Worker secrets; do not add them to Git:

- `CALL_INGEST_SECRET`
- `INGEST_SECRET`
- `TRAFFICSTARS_POSTBACK_KEY`
- `TELXIO_WEBHOOK_TOKEN`

Do not rotate or replace existing secrets as part of this change. The original TrafficStars postback key remains inside ClickFlare's configured traffic-source integration; no key is committed to this repository.

## Persistence and safety

The Worker stores one ring event per FreeSWITCH call UUID. It keeps the call's attributed IDs, attribution method/status, matched intent, ClickFlare conversion attempts, and postback result in D1. A ClickFlare conversion is emitted only for a unique one-intent/one-ring match or an existing verified DNI assignment. Unmatched and ambiguous calls do not generate conversions.

The call-intent event is intent telemetry, not a conversion. The conversion occurs only on the first actual agent-1001 ringing event. Answered-at, hangup-at, and billsec are stored separately.

## Telxio webhook

The authenticated provider endpoint is `POST /webhook/telxio/{token}`. It stores deduplicated provider event metadata and never creates conversions. FreeSWITCH remains the canonical source for agent ringing and call UUID correlation.
