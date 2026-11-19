# TrafficStars Free-plan bridge

This bridge lets an authorized GitHub-connected ChatGPT session operate the TrafficStars Worker without registering a custom MCP connector in ChatGPT.

## Flow

1. ChatGPT writes one JSON command to `command.json` on branch `fix/trafficstars-free-bridge`.
2. GitHub Actions requests a short-lived GitHub OIDC token with audience `ticketdepart-trafficstars-bridge`.
3. The workflow calls `POST /bridge/execute` on the existing `trafficstars-mcp` Cloudflare Worker.
4. The Worker validates the JWT signature and restricts the repository, repository ID, owner, actor, branch, workflow, event, and first run attempt.
5. The result is written to branch `trafficstars-bridge-results`, file `results/latest.json`.

No TrafficStars API key or long-lived Cloudflare credential is stored in GitHub or in command files.

## Supported commands

- `health`
- `get_balance`
- `list_campaigns` (optional `filters`)
- `get_campaign_details` (`campaign_id`)
- `get_campaign_statistics` (`statistics`)
- `pause_campaigns` (`campaign_ids`)
- `run_campaigns` (`campaign_ids`, `tracking_verified: true`, and exact spend approval)
- `update_campaign` (`campaign_id`, allowlisted `changes`)

## Spending safeguards

- Campaign activation is rejected unless tracking is marked verified and the command contains the exact explicit approval phrase required by the Worker.
- Changes to `price`, `max_daily`, `total_budget`, `use_total_budget`, or `test_period_budget` require separate explicit approval.
- Campaign creation, budget increases, and activation are not part of the health/read-only verification.
- Do not place API keys, OAuth tokens, or personal credentials in this directory.

## Operational notes

- The workflow is restricted to pushes that change `command.json` on the bridge branch.
- The Worker rejects workflow reruns (run attempt greater than one); submit a fresh command commit to retry.
- Read results from `trafficstars-bridge-results:results/latest.json`.
- The bridge does not automatically start campaigns. Tracking and spend approval must be checked separately.
