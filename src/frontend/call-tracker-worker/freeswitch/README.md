# FreeSWITCH collector

Source-controlled copy of the production FreeSWITCH ESL collector and TicketDepart inbound dialplan.

## Inbound routing

There is exactly one public TicketDepart DID: `+1-888-564-9049`. Telxio routes that DID into its internal ingress extension `1030605`; agent extension `1001` is the destination behind that ingress extension. `1030605` is **not** a second DID and must never be added to the Cloudflare `tracking_dids` pool. The caller dials only `+1-888-564-9049`.

The tracked dialplan include is `01_ticketdepart_inbound.xml`. It is scoped to the registered `telxio` SIP gateway and preserves the existing transfer from the public DID / Telxio ingress alias to agent extension `1001`. The retired `+1-877-788-8010` number is deliberately excluded. The SIP registration username/auth username remains `1030605`; it is an internal routing identity, not a public phone number. The gateway condition uses the expanded channel variable `${sip_gateway}`; FreeSWITCH event headers expose the same variable with a `variable_` prefix, but that event-header name is not a dialplan field.

For call records, the collector canonicalizes both the public DID and the internal alias to the single public DID `18885649049`. This keeps internal routing extensions out of the D1 DID field while preserving the exact route to agent `1001`.

## Telxio webhook and call correlation

The Telxio webhook is already enabled at the provider. The configured Worker endpoint is `POST /webhook/telxio/{token}`; it stores deduplicated provider event metadata and does not itself create conversions. FreeSWITCH remains the canonical source for the actual agent-1001 ringing event and call UUID.

The current production D1 audit showed no Telxio webhook deliveries received yet. On the next naturally occurring call, verify that the webhook reaches this endpoint and inspect whether its provider call identifier matches a stable FreeSWITCH field such as the SIP Call-ID. Do not generate a test call for this check. A provider call ID can correlate Telxio and FreeSWITCH records, but it only proves paid-click attribution if the provider also supplies a trustworthy link to the originating website click/session. Caller-ID or timestamp proximity alone is not verified attribution.

## Single-number click attribution

The site captures both identifiers from the ClickFlare landing URL:

- `click_id`: the original TrafficStars click ID carried as ClickFlare External ID
- `cf_click_id`: the unique ClickFlare visit ID

When a visitor taps a `tel:` link, the site sends a call-intent event containing both IDs. With one shared public DID, neither the internal extension `1030605` nor agent extension `1001` is a unique click identifier. A time-window match can be retained as a diagnostic candidate, but it is not proof that the PSTN caller is the browser visitor who tapped the link.

There is no active tracking-DID pool in this configuration. Do not create extra caller-facing numbers, IVR prompts, keypad codes, or session codes. The remaining attribution work is to determine whether Telxio's existing webhook carries a provider-supported session/click reference that can be matched to the browser intent. If it does not, this single-number flow cannot honestly claim one-to-one paid-click attribution.

The accepted-call event remains the first actual ring offered to agent extension `1001`. Answer, hangup, and final `billsec` are stored separately by the existing one-minute metadata sync. A single-number time-window candidate is never sent as a paid conversion.

## Completed-call metadata sync

`cloudflare_sync.py` is the source-controlled implementation of the existing one-minute sync job. It uploads only calls with a confirmed sent agent-ring event, a completed hangup timestamp, an inbound agent destination, and a SIP Call-ID. It keeps ring-only calls with `billsec=0` as accepted calls; answer and duration remain separate. Known test calls and explicitly classified external-provider calls are excluded. This endpoint updates metadata only and does not create conversions.

The systemd unit and timer templates are in `systemd/`. The timer runs `cloudflare_sync.py --send` once per minute and reads `CALL_INGEST_SECRET` from `/etc/ticketdepart-calltracker/ingest.env`. Run `python3 cloudflare_sync.py` without `--send` for a read-only upload dry run.

## Runtime assumptions

- FreeSWITCH Event Socket is loopback-only and password protected.
- systemd provides `CALL_INGEST_SECRET` from a root-owned environment file.
- SQLite database: `/var/lib/ticketdepart-calltracker/calls.sqlite3`.
- Install path: `/opt/ticketdepart-calltracker/collector.py`.

## Safety

ClickFlare and TrafficStars postbacks stay disabled until Telxio webhook fields provide a verified one-to-one link between the public single-DID call and the originating website click. The internal extension `1030605` is not a tracking DID. Single-number time-window candidates are review-only and must never be used as conversions. Unmatched calls never generate conversions. Do not commit secrets, systemd environment files, or live database contents.

## Tests

Run `python3 -m unittest -v test_collector.py test_cloudflare_sync.py` from this directory. Tests use in-memory SQLite/temp databases and mock the network notifier.
