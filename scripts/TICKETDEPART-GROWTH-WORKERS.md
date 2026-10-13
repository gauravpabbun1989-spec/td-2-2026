# TicketDepart Growth Worker Monitor

This tool adds owner-authorized SEO and website-health monitoring without changing the live website.

## Run from the repository root

```bash
node scripts/ticketdepart-growth-workers.mjs
```

Optional settings:

- `MAX_URLS=100` — maximum sitemap URLs to inspect (1–100)
- `CONCURRENCY=3` — capped at three concurrent requests
- `DELAY_MS=1000` — minimum delay between requests per worker (minimum 500 ms)

Example:

```bash
MAX_URLS=100 CONCURRENCY=2 DELAY_MS=1500 node scripts/ticketdepart-growth-workers.mjs https://ticketdepart.com
```

## What it checks

- `robots.txt` and `sitemap.xml` availability
- Up to 100 same-origin sitemap URLs
- HTTP status, page title, H1 presence, canonical tag and meta robots
- Presence of the public phone number and a `tel:` link

The report is written to a timestamped JSON file in the current directory.

## Worker model

The audit uses a bounded queue with up to three concurrent requests. The 100-URL cap represents audit coverage, not 100 simultaneous bots. Requests use an identifiable user agent, do not create GA4 events, and do not pretend to be human visitors. Do not increase concurrency to stress the production site.

## Next growth modules

This monitor can be extended to analyze exported Google Search Console data, keyword opportunities, indexing changes and call outcomes. GA4 `phone_click` should be compared with actual RingCentral inbound-call records; it is not proof of a connected call.

This tool does not deploy itself, modify website content, or request indexing automatically.
