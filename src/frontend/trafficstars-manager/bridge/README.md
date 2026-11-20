# TrafficStars Free-plan bridge

This bridge lets an authorized GitHub-connected ChatGPT session operate the TrafficStars Worker without registering a custom MCP connector in ChatGPT.

## Flow

1. ChatGPT writes one JSON command to `command.json` on branch `fix/trafficstars-free-bridge`.
2. GitHub Actions requests a short-lived GitHub OIDC token with audience `ticketdepart-trafficstars-bridge`.
3. The workflow calls `POST /bridge/execute` on the existing `trafficstars-mcp` Cloudflare Worker.
4. The Worker validates the JWT signature and restricts the repository, repository ID, owner, actor, branch, workflow, event, and first run attempt.
5. The result is written to branch `trafficstars-bridge-results`, file `results/latest.json`.

For a manual run, open **Actions → TrafficStars Free Plan Bridge → Run workflow** and select the fixed branch `fix/trafficstars-free-bridge`. Do not run it against `main` or another branch: the OIDC verifier intentionally accepts only the fixed bridge branch and repository owner.

No TrafficStars API key or long-lived Cloudflare credential is stored in GitHub or in command files.

## Supported commands

- `health`
- `get_balance`
- `get_account_session` (safe status/expiry metadata only; no tokens)
- `list_campaigns` (optional `filters`)
- `get_campaign_details` (`campaign_id`)
- `get_campaign_statistics` (`statistics`)
- `list_campaign_banners` (`campaign_id`, optional `page` / `size`)
- `pause_campaigns` (`campaign_ids`)
- `run_campaigns` (`campaign_ids`, `tracking_verified: true`, and exact spend approval)
- `update_campaign` (`campaign_id`, allowlisted `changes`)

## Spending safeguards

- Campaign activation is rejected unless tracking is marked verified and the command contains the exact explicit approval phrase required by the Worker.
- Changes to `price`, `max_daily`, `total_budget`, `use_total_budget`, or `test_period_budget` require separate explicit approval.
- Campaign creation, budget increases, and activation are not part of the health/read-only verification.
- Do not place API keys, OAuth tokens, or personal credentials in this directory.

## Operational notes

- Push-triggered runs are restricted to changes to `command.json` on the bridge branch. Manual runs are also restricted by the same OIDC repository, owner, workflow and branch checks.
- The Worker rejects workflow reruns (run attempt greater than one); submit a fresh command commit to retry.
- Read results from `trafficstars-bridge-results:results/latest.json`.
- The bridge does not automatically start campaigns. Tracking and spend approval must be checked separately.


## Read-only bridge actions

The private GitHub OIDC bridge supports `get_account_session` for safe session diagnostics. It returns only allowlisted status/expiry metadata and never returns access tokens, refresh tokens, or API credentials. The other read-only diagnostic actions include `get_balance`, `list_campaigns`, `get_campaign_details`, `get_campaign_statistics`, and `list_campaign_banners`.
