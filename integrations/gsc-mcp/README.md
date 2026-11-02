# TicketDepart Google Search Console MCP

A separate, read-only MCP service. It does not run inside the TicketDepart website Worker and does not alter the production site's routes, assets, DNS, or build.

## Design

- Google Search Console API only; Google OAuth scope is `webmasters.readonly`.
- Cloudflare Workers hosts the MCP endpoint and OAuth 2.1 authorization flow.
- Cloudflare KV stores OAuth protocol state. Google refresh tokens are stored encrypted in the OAuth provider's token props, not in Git.
- Tools are read-only: list properties, query Search Analytics, and list sitemaps.
- No Windsor.ai, HYPD, Netlify, or other Search Console data provider.

## Important deployment status

This folder is an isolated implementation scaffold, not a live service yet. Do not deploy until the OAuth callback, Worker bindings, package typecheck, and end-to-end OAuth flow have been validated. The placeholder Workers subdomain and KV namespace ID must be replaced during setup.

## Required Cloudflare setup

1. Enable the account's `workers.dev` subdomain if it is disabled. No TicketDepart DNS or nameserver change is needed.
2. Create a KV namespace named `TICKETDEPART_GSC_OAUTH` and put its ID in `wrangler.jsonc`.
3. Add Cloudflare Worker secrets `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`.
4. Set the final `MCP_RESOURCE_URL` and `GOOGLE_REDIRECT_URI` to the actual Worker hostname. Register the exact callback URL in a Google Cloud OAuth client.
5. Enable the Google Search Console API in the same Google Cloud project and configure the OAuth consent screen.
6. Deploy only this folder's Worker after checks pass.

Never commit OAuth client secrets, refresh tokens, access tokens, or KV contents.

## Current read-only tools

- `gsc_list_sites`
- `gsc_search_analytics`
- `gsc_list_sitemaps`

URL Inspection is intentionally not included in this first cut. No sitemap submission, URL removal, or property mutation tool is exposed.
