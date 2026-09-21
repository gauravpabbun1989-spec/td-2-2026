# BeyondSEO for TicketDepart

TicketDepart uses BeyondSEO as a local/CI SEO evidence layer alongside Google Search Console and GA4.

## Purpose

The workflow audits the live site for crawlability, metadata, links, sitemap coverage, answer readiness and related SEO evidence. It does not publish content or automatically change the website.

BeyondSEO is pinned to **v2.8.0** so audit behavior is reproducible.

## Run from GitHub

Open **Actions → BeyondSEO audit → Run workflow**.

The workflow also runs weekly. The resulting report is uploaded as a workflow artifact for review.

## Local run

If BeyondSEO is available locally:

```bash
python3 scripts/run.py crawl https://ticketdepart.com \
  --out ../ticketdepart-beyondseo \
  --max-pages 100 \
  --mode http
```

Review:

- `report.md` — crawl findings
- `readiness.md` — search/answer readiness
- `summary.json` — coverage and crawl limits
- `issues.json` — findings and evidence

## Operating rule

BeyondSEO findings are evidence, not automatic instructions to publish pages. We fix high-value technical problems first, then use Search Console query/page data and GA4 phone-click data to decide what content should be expanded.

We do not use doorway pages, fabricated reviews, fake airline affiliations, keyword stuffing, copied content, or mass-generated low-value pages.
