# FreeSWITCH collector

Source-controlled copy of the production FreeSWITCH ESL collector.

## Inbound toll-free routing

The tracked dialplan include is `01_ticketdepart_inbound.xml`. It accepts the public DID +1-888-564-9049 in E.164/national digit form, plus Telxio's current SIP-side alias `1030605`, and transfers those calls to extension `1001` in the default context. The SIP registration user and auth username remain `1030605`; they are not the public phone number. Keep both patterns until a live inbound event confirms what Telxio presents as `Caller-Destination-Number` after any provider routing change.

## Runtime assumptions

- FreeSWITCH Event Socket is loopback-only and password protected.
- systemd provides `CALL_INGEST_SECRET` from a root-owned environment file.
- SQLite database: `/var/lib/ticketdepart-calltracker/calls.sqlite3`.
- Install path: `/opt/ticketdepart-calltracker/collector.py`.

## Ringing event behavior

Only a `CHANNEL_PROGRESS` event matching the outbound Sofia leg for inbound caller on extension `1001` is eligible. The original inbound UUID comes from `variable_call_uuid`, is UUID-validated, and is stored in `ringing_notifications` with a primary-key deduplication constraint.

The notifier sends an authenticated JSON request to the existing call-tracker Worker at `/v1/calls/ringing`. It includes a descriptive User-Agent, required by the current workers.dev edge security behavior. A response with HTTP 200/202 and JSON `ok: true` marks the local event sent. Failed events remain pending and are retried at service startup or when another matching progress event arrives.

The Worker stores one event per inbound UUID with Goal ID `6487`. This is internal ringing-event tracking only. TrafficStars postbacks remain disabled; the Worker response must continue to report `postback_sent: false`.

## Safety

Do not commit secrets, systemd environment files, or live database contents. This source PR does not alter the server, deploy the Worker, or enable TrafficStars postbacks.

## Tests

Run `python3 -m unittest -v test_collector.py` from this directory. Tests use in-memory SQLite and mock the network notifier.
