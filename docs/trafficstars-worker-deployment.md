# TrafficStars Worker deployment

The dedicated GitHub Actions workflow deploys only these two Workers:

- `trafficstars-auth` using `src/frontend/trafficstars-manager/auth/wrangler.jsonc`
- `trafficstars-mcp` using `src/frontend/trafficstars-manager/mcp/wrangler.jsonc`

It does not use the root Wrangler configuration and cannot target the website Worker `ticket-depart2`. It is manual-only (`workflow_dispatch`); it does not deploy on ordinary pushes. It performs TypeScript and Wrangler dry-run checks for both Workers before deploying either one.

## One GitHub Actions secret required

In the repository `gauravpabbun/ticket-depart2`:

1. Open **Settings → Secrets and variables → Actions**.
2. Under **Repository secrets**, choose **New repository secret**.
3. Name: `CLOUDFLARE_API_TOKEN`.
4. Value: a Cloudflare API token authorized to deploy Workers in account `5421346b1bf08e0583cb670e97887719`.
5. Save.

The workflow checks only whether this secret is present. It never prints or exposes its value. The account ID is a non-secret workflow setting.

Create a dedicated Cloudflare API token for this automation rather than using a Global API Key. Grant only the permissions needed to deploy Workers in this account (Workers Scripts: Edit; include Account Settings: Read if Wrangler's account discovery requires it). Do not paste the token into source files, workflow YAML, chat, or command history.

## Existing runtime secrets are not GitHub secrets

The production Workers already have their own Cloudflare runtime secrets and bindings. Keep these in Cloudflare:

- `trafficstars-auth`: `ALLOWED_EMAIL`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `RESEND_API_KEY`, plus its existing `OAUTH_KV` binding.
- `trafficstars-mcp`: `TRAFFICSTARS_API_KEY`, plus its existing `AUTH_SERVER` service binding.

Do not upload those runtime values to GitHub. The deployment workflow does not set, rotate, or print them. The two Wrangler configs declare the existing KV and service bindings; secret values remain managed as Worker secrets in Cloudflare.

## Run it

After adding `CLOUDFLARE_API_TOKEN`, open **Actions → Deploy TrafficStars Workers → Run workflow** on the default branch. Review the run result. A successful run deploys the two named TrafficStars Workers only. Reauthorize the MCP client afterward so it can obtain the current `trafficstars:manage` scope.

This deployment workflow does not create, activate, pause, or edit TrafficStars campaigns.
