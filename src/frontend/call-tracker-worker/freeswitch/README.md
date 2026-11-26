# FreeSWITCH collector

Source-controlled copy of the production FreeSWITCH ESL collector and TicketDepart inbound dialplan.

## Inbound routing

There is exactly one public TicketDepart number: **+1-888-564-9049**. The live FreeSWITCH event records show Telxio currently identifies inbound calls by the dedicated SIP gateway (variable_sip_gateway=telxio) and does not deliver the public called number in the INVITE Request-URI or called-party headers.

The dialplan therefore matches the Telxio gateway identity only. The collector maps calls from that dedicated gateway to the one configured public toll-free number before sending call metadata to the Worker. The internal account/authentication identifier is not used as a phone number, destination match, or tracking DID.

**Gateway exclusivity is a required invariant:** the Telxio gateway must be attached only to TicketDepart's single toll-free number **+1-888-564-9049**. Do not attach any other public number to this gateway. If another DID is added later, Telxio must provide the called number in SIP signalling or use a separate gateway before it can be routed safely.

The dialplan passes the call into the internal monitored agent leg. The collector watches that leg only to detect its first actual RINGING event, which records that the call landed. The internal extension is not a second public number, is never displayed, and is never dialed by customers. An answer event is recorded separately.

No test call was placed or is required for this source change. The live event data used to shape this mapping was read-only.

## Ring, answer, and completed-call metadata

- The first confirmed ring on the internal monitored agent leg is the landed/accepted milestone.
- The agent answering is a separate timestamp.
- Hangup and final `billsec` are separate completion fields.
- A ring-only call remains landed even if nobody answers; its billable duration may be zero.
- `cloudflare_sync.py` updates metadata only. It does not create advertising conversions.

The collector accepts only an inbound call whose original called number resolves to **+1-888-564-9049**. It does not reinterpret a private extension as the public DID.

## Telxio webhook and click attribution

The Telxio webhook is already enabled at the provider. The configured Worker endpoint is `POST /webhook/telxio/{token}`; it stores deduplicated provider event metadata and never creates conversions.

On the next naturally occurring inbound call, verify webhook delivery and compare the provider call identifier with a stable FreeSWITCH SIP call identifier. A provider call ID alone does not establish which browser click produced the PSTN call. Verified paid-click attribution requires a provider-supported per-call click/session reference that can be linked to the website's TrafficStars click ID and ClickFlare visit ID. Caller ID and timestamp proximity alone are not sufficient.

## Single-number attribution

The site records the TrafficStars click ID, ClickFlare visit ID, and phone-click intent. With one shared toll-free number, an intent that happens near a ringing event is only a diagnostic candidate. It is not a verified click-to-call match and is never sent as an advertising conversion.

No tracking-number pool, rotating DID allocation, IVR, keypad code, or session code is used. ClickFlare and TrafficStars postbacks remain disabled until a verified per-call click reference is available and the user authorizes enabling them.

## Completed-call metadata sync

`cloudflare_sync.py` selects completed inbound calls that have a confirmed agent-ring notification, a completed hangup timestamp, and a SIP Call-ID. It sends the public toll-free number as the call destination and tracks the internal ring event separately. It preserves ring-only calls with `billsec=0` and does not send conversions.

The systemd unit and timer templates are in `systemd/`. The timer runs `cloudflare_sync.py --send` once per minute and reads `CALL_INGEST_SECRET` from `/etc/ticketdepart-calltracker/ingest.env`. Run `python3 cloudflare_sync.py` without `--send` for a read-only upload dry run.

## Runtime assumptions

- FreeSWITCH Event Socket is loopback-only and password protected.
- systemd provides `CALL_INGEST_SECRET` from a root-owned environment file.
- SQLite database: `/var/lib/ticketdepart-calltracker/calls.sqlite3`.
- Install path: `/opt/ticketdepart-calltracker/collector.py`.

## Safety

No extra public or tracking number is allocated. Do not commit secrets, systemd environment files, or live database contents.

## Tests

Run `python3 -m unittest -v test_collector.py test_cloudflare_sync.py test_dialplan.py` from this directory. Tests use in-memory SQLite/temp databases and mock the network notifier.
