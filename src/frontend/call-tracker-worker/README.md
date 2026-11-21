# TicketDepart call-tracker Worker

This directory is the source-controlled implementation for the existing
Cloudflare Worker `ticketdepart-call-tracker`.

## Bindings and secrets

The Wrangler configuration binds the existing D1 database
`ticketdepart-call-tracking` as `DB`. Keep these existing values as
Cloudflare Worker secrets; do not add them to Git:

- `CALL_INGEST_SECRET`
- `INGEST_SECRET`
- `TRAFFICSTARS_POSTBACK_KEY`

The Worker does not send TrafficStars postbacks. The accepted-call endpoint
continues to return HTTP 409 until call attribution and qualification have
been separately verified.

## Intent attribution behavior

The website stores the incoming `click_id` and its first-seen timestamp in
session storage. On a phone CTA, it sends an intent-only beacon to `/intent`.
The Worker now creates the matching `traffic_clicks` row when it is missing,
then inserts the `call_intents` row. Existing active click records are
preserved; expired records are rejected rather than silently renewed.

This is only click-to-call intent registration. It does not link a FreeSWITCH
call UUID to a click, mark a call accepted, create a conversion, or send a
postback.

## Validation and deployment

The GitHub Actions workflow validates the TypeScript Worker bundle with
Wrangler dry-run and runs focused tests. It does not deploy.

After review and merge, deploy this Worker manually only after confirming the
PR checks. Use:

```sh
pnpm dlx wrangler@4.157.0 deploy --config src/frontend/call-tracker-worker/wrangler.jsonc
```

No production deployment is triggered by this PR or workflow.
