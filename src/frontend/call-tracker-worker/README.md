# TicketDepart call-tracker Worker

This directory is the source-controlled implementation for the existing Cloudflare Worker `ticketdepart-call-tracker`.

## Caller-facing number and call landing signal

- The only public/customer-facing phone number is **+1-888-564-9049**.
- No rotating tracking numbers, per-click DID allocation, IVR, keypad, session code, or second caller-facing number is part of this design.
- The website continues to display and link directly to the toll-free number.
- Live SIP event records identify the inbound provider gateway as telxio but do not carry the toll-free called number. The collector maps that dedicated gateway to the single configured public number; keep the gateway exclusive to this number.
- FreeSWITCH sends the inbound call to the internal agent leg used for ring monitoring. The internal extension is not published, entered, or dialed by customers.
- The first real `RINGING` event on that internal leg is the call-landed/accepted signal (`acceptance_reason=agent_leg_ringing`). It does not mean the agent answered.

Answer time, hangup time, and final billable duration are stored separately. A ring-only call remains landed even when it is not answered.

## Single-number click attribution

The landing page captures both identifiers from the ClickFlare URL:

- `click_id`: the original TrafficStars click ID carried as ClickFlare External ID
- `cf_click_id`: the ClickFlare visit ID

A tap on a phone link records a website call-intent event. The shared toll-free number itself does not carry either browser identifier over the telephone network. A unique time-window intent can be retained as a **review-only candidate**, but it is not verified attribution and never creates an advertising conversion.

The legacy `POST /dni/assign` endpoint is disabled and returns HTTP 410. The Worker does not allocate, return, or accept rotating tracking numbers. Legacy D1 assignment tables may remain for database compatibility, but the runtime no longer reads or writes them.

## Telxio webhook and conversion safety

The Telxio webhook is already enabled at the provider. The authenticated endpoint is `POST /webhook/telxio/{token}`. It stores deduplicated provider event metadata and never creates conversions.

A provider call ID can correlate provider and FreeSWITCH records. It does not prove which website click produced the call unless the webhook also supplies a trustworthy per-call click/session reference that can be linked to both TrafficStars and ClickFlare IDs. Caller ID or timestamp proximity alone is not verified attribution.

ClickFlare and TrafficStars postbacks remain disabled. The Worker conversion sender is gated on the explicit verified attribution method `telxio_click_reference`; the existing single-number intent candidate cannot satisfy that gate. No synthetic click IDs or timestamp-only matches are sent as conversions. The current qualified-call payout is **$15**.

## Bindings and secrets

The Wrangler configuration binds the existing D1 database `ticketdepart-call-tracking` as `DB`. Keep existing values as Cloudflare Worker secrets; do not add them to Git:

- `CALL_INGEST_SECRET`
- `INGEST_SECRET`
- `TRAFFICSTARS_POSTBACK_KEY`
- `TELXIO_WEBHOOK_TOKEN`

Do not rotate or replace existing secrets as part of this code change.

## Telxio verification still required

The next naturally occurring inbound call should be used to verify that the webhook reaches the Worker and that the provider call identifier can be matched to a stable FreeSWITCH SIP call identifier. Do not place a test call. The provider must also expose a reliable per-call browser-click/session reference before paid-click attribution can be verified. Until then, calls can be counted as landed at the internal agent-ring event, but they remain unattributed for advertising conversions.
