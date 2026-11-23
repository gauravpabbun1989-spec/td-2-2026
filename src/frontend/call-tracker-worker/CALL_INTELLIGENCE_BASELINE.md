# TicketDepart Call Intelligence — Internal Baseline

## Purpose

Build an internal, Ringba-inspired call intelligence system for TicketDepart. This is not a commercial multi-tenant product and must not copy Ringba proprietary code, private APIs, or protected implementation details. Use publicly observable product capabilities as design references only.

## Non-negotiable operating constraints

- Preserve the existing direct-transfer caller experience. No IVR, keypad token, DTMF, caller-entered code, or extra phone number.
- Preserve the current FreeSWITCH routing and buyer multi-extension ringing.
- Current tracked route: DID `1030605`, agent extension `1001`.
- The billable/accepted milestone is the first genuine ring offered to agent extension `1001` for the validated inbound DID, recorded once per original FreeSWITCH call UUID. Keep answer time, hangup time, and final billsec as separate facts.
- Never infer a TrafficStars click ID from caller number or timestamp proximity.
- Unattributed calls may be visible in internal reporting but must never create TrafficStars conversions.
- Do not enable postbacks, change campaign state/budget, rotate secrets, modify live routing, restart FreeSWITCH, or deploy production changes as part of development PRs.

## Existing implementation observed

### GitHub repository

Repository: `gauravpabbun/ticket-depart2` (default branch: `main`).

The source-controlled call-tracker Worker lives under `src/frontend/call-tracker-worker/` and uses the existing D1 database binding `ticketdepart-call-tracking`.

Current Worker capabilities observed in source:
- `GET /health`
- `GET /click` to persist a TrafficStars click ID
- `POST /intent` to record a browser phone-click intent
- `POST /v1/calls/ingest` for authenticated completed-call metadata ingestion
- `POST /v1/calls/ringing` for authenticated, UUID-deduplicated first-ring events
- `POST /v1/calls/accepted` currently returns HTTP 409 with `attribution_not_verified`
- TrafficStars postback delivery is gated by an explicit feature flag and requires `verified` attribution using `signed_call_session`
- Retry metadata and a scheduled retry handler exist

The browser analytics code captures a TrafficStars click ID and submits a phone-call intent. This proves a click and a phone intent occurred in a browser; it does not prove which later PSTN call belongs to that browser.

### FreeSWITCH collector and local services observed on the connected host

The host currently has active services for:
- `ticketdepart-calltracker.service` — Python ESL collector
- `ticketdepart-dashboard.service` — existing call metadata dashboard
- `ticketdepart-2cc.service` — separate two-consecutive-call monitor
- `ticketdepart-optimizer.service` — campaign optimizer (observe-only)
- `ticketdepart-dialer.service` — private browser dialer

The existing dashboard listens on loopback port 8090 and reads the local SQLite call database in read-only mode. The separate 2CC monitor listens on loopback port 8092. Both returned HTTP 200 during a read-only health check. These are existing services; do not create duplicate dashboards or replace them without a reviewed migration plan.

The live collector source at `/opt/ticketdepart-calltracker/collector.py` currently validates the original inbound DID using the original `CHANNEL_CREATE` event and records the subsequent ring against the same inbound UUID. This is more specific than the collector implementation currently present in the GitHub repository.

## Confirmed engineering gap

The current shared toll-free PSTN route does not transport a browser click ID to FreeSWITCH. The Worker correctly leaves calls unmatched and blocks conversions. A new dashboard alone cannot solve this.

The next attribution design must use a deterministic, non-interactive identifier that the telephony provider can carry through to the FreeSWITCH inbound call and that can be cryptographically or otherwise securely bound to the original click/session. Investigate provider-supported SIP headers, signed call metadata, or an equivalent carrier-supported mechanism. Do not assume a feature exists until the provider confirms it and an end-to-end test proves it.

## Implementation sequence

1. **Baseline and source reconciliation**
   - Keep the live collector, local SQLite database, existing dashboard, and active background services intact.
   - Compare the live collector with the repository version and reconcile intentional changes through a reviewed PR.
   - Record the actual schema and lifecycle for call UUID, first ring, answer, hangup, billsec, and retries without exposing caller PII in diagnostics.

2. **Deterministic attribution**
   - Document the provider's supported non-interactive metadata transport.
   - Define a signed/session-bound correlation contract and replay/expiry protections.
   - Add tests for valid, missing, malformed, expired, replayed, and mismatched identifiers.
   - Keep all unmatched calls fail-closed.

3. **Billing and conversion integrity**
   - Enforce one first-ring event per original call UUID.
   - Keep ring milestone, answer, hangup, billsec, and any separately defined payout qualification distinct.
   - Make TrafficStars postback idempotent and eligible only for verified click attribution.
   - Verify exact TrafficStars endpoint and payload against current account documentation before any live send.

4. **Internal reporting**
   - Extend the existing dashboard rather than creating a parallel one.
   - Add call lifecycle timeline, attribution status, campaign/click reference, first-ring outcome, answer/hangup/billsec, postback attempts, and reconciliation status.
   - Protect all reporting endpoints with appropriate authentication and avoid exposing full caller numbers unnecessarily.

5. **Validation and controlled rollout**
   - Unit and integration tests first; then provider-confirmed staging/controlled call tests.
   - Production deployment, D1 migration, live calls, postback activation, campaign activation, and FreeSWITCH changes require separate explicit approval.

## Known source drift to resolve

The source-controlled collector at `src/frontend/call-tracker-worker/freeswitch/collector.py` and the live collector at `/opt/ticketdepart-calltracker/collector.py` do not currently implement the same ring-detection path. The live version validates the original DID `1030605` from `CHANNEL_CREATE` and then detects the ring on the same inbound UUID. The repository version has a different external-channel/bridged-leg detector. Do not deploy or overwrite either version until the difference is reconciled and covered by tests.

## Immediate next tasks

- Obtain written confirmation of supported non-interactive SIP/call metadata from the telephony provider.
- Capture a sanitized event-field inventory from a controlled test call (no caller numbers, credentials, or secrets in logs).
- Reconcile collector source drift without changing the running service.
- Design an authenticated read-only reporting API that can serve the existing dashboard and future call intelligence views.
