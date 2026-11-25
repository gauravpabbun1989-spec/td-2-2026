# FreeSWITCH collector

Source-controlled copy of the production FreeSWITCH ESL collector and TicketDepart inbound dialplan.

## Inbound routing

The tracked dialplan include is `01_ticketdepart_inbound.xml`. It is scoped to the registered `telxio` SIP gateway and routes the current public DID `+1-877-788-8010` plus the provider-side inbound alias `1030605` to agent extension `1001`. The SIP registration username/auth username remains `1030605`; it is not the public phone number.

Each additional DNI tracking DID must be added to the destination allowlist in this dialplan before it is enabled in the Cloudflare D1 `tracking_dids` table. Do not route arbitrary toll-free numbers to the agent.

## DNI call correlation

- The visitor's browser receives a tracking DID only after the Worker has stored both the TrafficStars click ID and ClickFlare `cf_click_id` against that DID.
- The caller dials the displayed number normally. No keypad, code, IVR, or browser-session lookup is used during the call.
- The collector follows the outbound agent leg to the original inbound UUID, validates its public-context external SIP origin, and extracts the original called DID from `P-Called-Party-ID`, `X-Original-DID`, `X-DNIS`, or equivalent SIP headers before falling back to `Caller-Destination-Number`.
- The current live Telxio call sample exposes only the trunk alias `1030605` in `Caller-Destination-Number` and does not expose a called-DID SIP header. Telxio must preserve the original called DID in the SIP Request-URI or a called-party header, or provide a separate inbound route/registration per DID, before DNI attribution can be enabled.
- The Worker resolves the called DID against the active assignment at the agent-1001 ringing timestamp. Only a complete two-ID match is marked verified.
- The billable event remains agent extension `1001` ringing. Answer and hangup times remain separate events.

## Runtime assumptions

- FreeSWITCH Event Socket is loopback-only and password protected.
- systemd provides `CALL_INGEST_SECRET` from a root-owned environment file.
- SQLite database: `/var/lib/ticketdepart-calltracker/calls.sqlite3`.
- Install path: `/opt/ticketdepart-calltracker/collector.py`.

## Safety

ClickFlare and TrafficStars postbacks stay disabled until real tracking DIDs are provisioned, the DID-to-click mapping is verified, and an end-to-end call test passes. Unmatched calls never generate conversions. Do not commit secrets, systemd environment files, or live database contents.

## Tests

Run `python3 -m unittest -v test_collector.py` from this directory. Tests use in-memory SQLite and mock the network notifier.
