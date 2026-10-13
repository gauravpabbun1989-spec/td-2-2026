# Termux start/stop controller

This runs the legitimate SEO/site-health monitor as a background process under Termux. It is not a traffic generator, does not simulate customers, and does not create GA4 events.

## Requirements

- Termux with Node.js 20+ (the script uses built-in fetch)
- The PR files present in your local clone

Install Node.js if needed:

```bash
pkg update
pkg install nodejs
```

From the repository root:

```bash
chmod +x scripts/td-bots
scripts/td-bots start
scripts/td-bots status
scripts/td-bots logs
scripts/td-bots stop
```

The scheduler runs an audit immediately and repeats it every 60 minutes by default. Minimum supported interval is 15 minutes. Each run checks up to 100 same-origin sitemap URLs with a maximum concurrency of two and 1.5 seconds between requests per worker.

Optional settings:

```bash
TD_SITE_URL=https://ticketdepart.com TD_INTERVAL_MINUTES=60 scripts/td-bots start
```

Data and logs are stored in `td-growth-data/` by default. To keep Termux alive longer, disable Android battery optimization for Termux. Android can still terminate background work; this is not an always-on VPS service. For a true remote server/VPS, deploy the repository there and use its process manager (e.g. systemd) or provide the server's deployment details.

Commands:
- `start` — launch background scheduler
- `stop` — request a clean stop
- `status` — show PID and last saved state
- `logs` — follow logs
- `once` — run one audit in the foreground

Do not point this at sites you do not own or administer. Keep the request rate conservative.
