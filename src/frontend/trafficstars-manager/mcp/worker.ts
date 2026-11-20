import {
  createMcpHandler,
  hostHeaderValidationResponse,
  McpServer,
  originValidationResponse,
} from "@modelcontextprotocol/server";
import {
  OAuthResourceServer,
  type OAuthResourceTokenValidation,
} from "@cloudflare/workers-oauth-provider";
import { z } from "zod";
import { campaignChangesSchema } from "./schemas";

import {
  getAccountBalance,
  getAccountSession,
  getCampaignDetails,
  getCampaignStatistics,
  listCampaigns,
  listCampaignBanners,
  updateCampaignBannerClickUrl,
  pauseCampaigns,
  runCampaigns,
  updateCampaign,
  type CampaignStatisticsRequest,
  type TrafficStarsEnv,
} from "../shared/trafficstars-api";

const MCP_HOST = "trafficstars-mcp.gaurav-pabbun.workers.dev";
const MCP_RESOURCE = `https://${MCP_HOST}/mcp`;
const AUTH_ISSUER = "https://trafficstars-auth.gaurav-pabbun.workers.dev";
const READ_SCOPE = "trafficstars:read";
const MANAGE_SCOPE = "trafficstars:manage";

interface AuthorizationBinding {
  validateToken(
    resource: string,
    token: string,
  ): Promise<OAuthResourceTokenValidation<unknown> | null>;
}

interface Env extends TrafficStarsEnv {
  AUTH_SERVER: AuthorizationBinding;
}

function isSensitiveKey(key: string): boolean {
  const normalized = key.replace(/[^a-z0-9]/gi, "").toLowerCase();
  return /(token|apikey|secret|password|authorization|cookie|credential|privatekey|bearer)/.test(normalized);
}

function sanitize(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(sanitize);
  }

  if (typeof value !== "object" || value === null) {
    return value;
  }

  const result: Record<string, unknown> = {};

  for (const [key, item] of Object.entries(value)) {
    if (isSensitiveKey(key)) continue;
    result[key] = sanitize(item);
  }

  return result;
}

function safeSessionMetadata(value: unknown): Record<string, unknown> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return { available: false };
  }

  const source = value as Record<string, unknown>;
  const allowed = [
    "status",
    "expires_at",
    "expires_in",
    "created_at",
  ];

  const result: Record<string, unknown> = {};

  for (const key of allowed) {
    const item = source[key];

    if (
      typeof item === "string" ||
      (typeof item === "number" && Number.isFinite(item)) ||
      typeof item === "boolean"
    ) {
      result[key] = item;
    }
  }

  return result;
}

function toolResult(value: unknown) {
  const safeValue = sanitize(value);
  const text = JSON.stringify(safeValue, null, 2);

  return {
    content: [{ type: "text" as const, text }],
  };
}

function toolError(message = "TrafficStars operation failed. Check the input and try again.") {
  return {
    isError: true,
    content: [{
      type: "text" as const,
      text: message,
    }],
  };
}

async function runTool(operation: () => Promise<unknown>) {
  try {
    return toolResult(await operation());
  } catch (error) {
    return toolError();
  }
}

const BRIDGE_REPOSITORY = "gauravpabbun/ticket-depart2";
const BRIDGE_REPOSITORY_ID = "1377390909";
const BRIDGE_OWNER_ID = "102061504";
const BRIDGE_BRANCH = "refs/heads/fix/trafficstars-free-bridge";
const BRIDGE_AUDIENCE = "ticketdepart-trafficstars-bridge";
const BRIDGE_WORKFLOW_REF = `${BRIDGE_REPOSITORY}/.github/workflows/trafficstars-bridge.yml@${BRIDGE_BRANCH}`;

type GithubSigningJwk = JsonWebKey & { kid?: string };

let githubJwksCache: GithubSigningJwk[] | undefined;
let githubJwksExpiresAt = 0;

function decodeJwtPart(value: string): Uint8Array {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(normalized + "=".repeat((4 - normalized.length % 4) % 4));
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}

function parseJwtPart<T>(value: string): T {
  return JSON.parse(new TextDecoder().decode(decodeJwtPart(value))) as T;
}

async function getGithubSigningKeys(): Promise<GithubSigningJwk[]> {
  if (githubJwksCache && githubJwksExpiresAt > Date.now()) {
    return githubJwksCache;
  }

  const discoveryResponse = await fetch(
    "https://token.actions.githubusercontent.com/.well-known/openid-configuration",
    { signal: AbortSignal.timeout(8000) },
  );
  if (!discoveryResponse.ok) throw new Error("GitHub OIDC discovery unavailable");
  const discovery = await discoveryResponse.json() as { jwks_uri?: string };
  if (typeof discovery.jwks_uri !== "string") throw new Error("GitHub OIDC keys unavailable");

  const keysResponse = await fetch(discovery.jwks_uri, {
    signal: AbortSignal.timeout(8000),
  });
  if (!keysResponse.ok) throw new Error("GitHub OIDC keys unavailable");
  const keys = await keysResponse.json() as { keys?: GithubSigningJwk[] };
  if (!Array.isArray(keys.keys) || keys.keys.length === 0) {
    throw new Error("GitHub OIDC keys unavailable");
  }

  githubJwksCache = keys.keys;
  githubJwksExpiresAt = Date.now() + 10 * 60 * 1000;
  return keys.keys;
}

async function verifyGithubBridgeToken(token: string): Promise<Record<string, unknown>> {
  const parts = token.split(".");
  if (parts.length !== 3) throw new Error("Invalid identity token");

  const header = parseJwtPart<{ alg?: string; kid?: string }>(parts[0]);
  const claims = parseJwtPart<Record<string, unknown>>(parts[1]);
  if (header.alg !== "RS256" || typeof header.kid !== "string") {
    throw new Error("Unsupported identity token");
  }

  const keys = await getGithubSigningKeys();
  const jwk = keys.find((item) => item.kid === header.kid);
  if (!jwk) throw new Error("Unknown identity key");

  const key = await crypto.subtle.importKey(
    "jwk",
    jwk,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["verify"],
  );
  const valid = await crypto.subtle.verify(
    "RSASSA-PKCS1-v1_5",
    key,
    decodeJwtPart(parts[2]),
    new TextEncoder().encode(`${parts[0]}.${parts[1]}`),
  );
  if (!valid) throw new Error("Invalid identity signature");

  const now = Math.floor(Date.now() / 1000);
  const audience = Array.isArray(claims.aud) ? claims.aud : [claims.aud];
  if (
    claims.iss !== "https://token.actions.githubusercontent.com" ||
    !audience.includes(BRIDGE_AUDIENCE) ||
    typeof claims.exp !== "number" ||
    claims.exp <= now ||
    (typeof claims.nbf === "number" && claims.nbf > now + 30) ||
    claims.repository !== BRIDGE_REPOSITORY ||
    String(claims.repository_id) !== BRIDGE_REPOSITORY_ID ||
    String(claims.repository_owner_id) !== BRIDGE_OWNER_ID ||
    String(claims.actor_id) !== BRIDGE_OWNER_ID ||
    claims.ref !== BRIDGE_BRANCH ||
    !(["push", "workflow_dispatch"].includes(String(claims.event_name))) ||
    claims.workflow_ref !== BRIDGE_WORKFLOW_REF ||
    String(claims.run_attempt) !== "1"
  ) {
    throw new Error("Workflow identity is not authorized");
  }

  return claims;
}

function validCampaignIds(value: unknown): value is number[] {
  return Array.isArray(value) &&
    value.length > 0 &&
    value.length <= 100 &&
    value.every((id) => Number.isSafeInteger(id) && id > 0);
}

async function handleBridge(request: Request, env: Env): Promise<Response> {
  if (request.method !== "POST") {
    return Response.json({ error: "method_not_allowed" }, { status: 405 });
  }

  const authorization = request.headers.get("Authorization") ?? "";
  const match = authorization.match(/^Bearer\s+(.+)$/i);
  if (!match) return Response.json({ error: "unauthorized" }, { status: 401 });

  let claims: Record<string, unknown>;
  try {
    claims = await verifyGithubBridgeToken(match[1]);
  } catch {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  const rawBody = await request.text();
  if (rawBody.length > 32_000) {
    return Response.json({ error: "request_too_large" }, { status: 413 });
  }

  let input: Record<string, unknown>;
  try {
    const parsed: unknown = JSON.parse(rawBody);
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
      throw new Error("Invalid request");
    }
    input = parsed as Record<string, unknown>;
  } catch {
    return Response.json({ error: "invalid_json" }, { status: 400 });
  }

  if (
    typeof input.action !== "string" ||
    input.commit_sha !== claims.sha ||
    String(input.run_id) !== String(claims.run_id)
  ) {
    return Response.json({ error: "command_identity_mismatch" }, { status: 403 });
  }

  try {
    let result: unknown;

    switch (input.action) {
      case "health":
        result = {
          connected: true,
          repository: BRIDGE_REPOSITORY,
          workflow: "trafficstars-bridge",
        };
        break;

      case "get_balance":
        result = await getAccountBalance(env);
        break;

      case "get_account_session":
        // Return only the same allowlisted metadata as the MCP session tool.
        // Never return access tokens, refresh tokens or API credentials.
        result = safeSessionMetadata(await getAccountSession(env));
        break;

      case "list_campaigns": {
        const filters = input.filters;
        if (
          filters !== undefined &&
          (typeof filters !== "object" || filters === null || Array.isArray(filters))
        ) throw new Error("Invalid filters");
        result = await listCampaigns(
          env,
          (filters ?? {}) as Record<string, string | number | boolean>,
        );
        break;
      }

      case "update_campaign_banner_click_url": {
        if (
          Number(input.campaign_id) !== 1653463 ||
          Number(input.banner_id) !== 8369514 ||
          input.destination_url !== "https://ticketdepart.com/?click_id={click_id}" ||
          input.approval !== "I approve correcting the malformed click_id URL on TicketDepart banner 8369514 while campaign 1653463 remains paused."
        ) {
          throw new Error("This narrowly-scoped banner URL correction requires the exact target and explicit approval");
        }
        result = await updateCampaignBannerClickUrl(
          env,
          Number(input.banner_id),
          String(input.destination_url),
        );
        break;
      }

      case "list_campaign_banners": {
        if (!Number.isSafeInteger(input.campaign_id) || Number(input.campaign_id) <= 0) {
          throw new Error("Invalid campaign_id");
        }
        const page = input.page === undefined ? 1 : Number(input.page);
        const size = input.size === undefined ? 100 : Number(input.size);
        result = await listCampaignBanners(env, Number(input.campaign_id), page, size);
        break;
      }

      case "get_campaign_details":
        if (!Number.isSafeInteger(input.campaign_id) || Number(input.campaign_id) <= 0) {
          throw new Error("Invalid campaign_id");
        }
        result = await getCampaignDetails(env, Number(input.campaign_id));
        break;

      case "get_campaign_statistics": {
        const stats = input.statistics;
        if (typeof stats !== "object" || stats === null || Array.isArray(stats)) {
          throw new Error("Invalid statistics request");
        }
        result = await getCampaignStatistics(env, stats as CampaignStatisticsRequest);
        break;
      }

      case "pause_campaigns":
        if (!validCampaignIds(input.campaign_ids)) throw new Error("Invalid campaign_ids");
        result = await pauseCampaigns(env, input.campaign_ids);
        break;

      case "run_campaigns":
        if (
          !validCampaignIds(input.campaign_ids) ||
          input.tracking_verified !== true ||
          input.approval !== "I approve activating the listed TrafficStars campaigns and the resulting spend."
        ) {
          throw new Error("Campaign activation requires verified tracking and explicit spend approval");
        }
        result = await runCampaigns(env, input.campaign_ids);
        break;

      case "update_campaign": {
        if (!Number.isSafeInteger(input.campaign_id) || Number(input.campaign_id) <= 0) {
          throw new Error("Invalid campaign_id");
        }
        if (
          typeof input.changes !== "object" ||
          input.changes === null ||
          Array.isArray(input.changes)
        ) throw new Error("Invalid changes");

        const changes = input.changes as Record<string, unknown>;
        const budgetFields = ["price", "price_rtb", "pricing_model", "max_daily", "total_budget", "use_total_budget", "test_period_budget"];
        if (
          budgetFields.some((field) => Object.hasOwn(changes, field)) &&
          input.approval !== "I approve the requested TrafficStars budget or bid change."
        ) {
          throw new Error("Budget and bid changes require explicit approval");
        }
        result = await updateCampaign(env, Number(input.campaign_id), changes);
        break;
      }

      default:
        throw new Error("Unsupported action");
    }

    return Response.json({
      ok: true,
      action: input.action,
      commit_sha: claims.sha,
      run_id: claims.run_id,
      result: sanitize(result),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "TrafficStars operation failed";
    return Response.json(
      { ok: false, action: input.action, error: message.slice(0, 300) },
      { status: 400 },
    );
  }
}

function createServer(env: Env, canManage: boolean): McpServer {
  const server = new McpServer({
    name: "TrafficStars Manager - TicketDepart",
    version: "1.0.0",
  });

  server.registerTool(
    "get_account_balance",
    {
      title: "Get TrafficStars account balance",
      description: "Read the current TrafficStars account balance.",
      inputSchema: z.object({}).strict(),
      annotations: { readOnlyHint: true, destructiveHint: false },
    },
    async () => runTool(() => getAccountBalance(env)),
  );

  server.registerTool(
    "get_account_session",
    {
      title: "Get TrafficStars session information",
      description:
        "Read safe session metadata. Access tokens, refresh tokens and API credentials are never returned.",
      inputSchema: z.object({}).strict(),
      annotations: { readOnlyHint: true, destructiveHint: false },
    },
    async () =>
      runTool(async () => safeSessionMetadata(await getAccountSession(env))),
  );

  server.registerTool(
    "list_campaigns",
    {
      title: "List TrafficStars campaigns",
      description:
        "List campaigns using supported read-only filters. Does not create or modify campaigns.",
      inputSchema: z
        .object({
          order: z.string().max(100).optional(),
          id: z.number().int().positive().optional(),
          format_id: z.number().int().positive().optional(),
          ad_format_id: z.number().int().positive().optional(),
          pricing_model: z.string().max(50).optional(),
          status: z.string().max(50).optional(),
          flat_rate: z.boolean().optional(),
          traffic_type: z.string().max(50).optional(),
          traffic_source_type: z.string().max(50).optional(),
          network_traffic_type: z.string().max(50).optional(),
        })
        .strict(),
      annotations: { readOnlyHint: true, destructiveHint: false },
    },
    async (input) =>
      runTool(() =>
        listCampaigns(
          env,
          input as Record<string, string | number | boolean>,
        ),
      ),
  );

  server.registerTool(
    "get_campaign_details",
    {
      title: "Get TrafficStars campaign details",
      description: "Read details for one campaign by its numeric ID.",
      inputSchema: z
        .object({
          campaignId: z.number().int().positive(),
        })
        .strict(),
      annotations: { readOnlyHint: true, destructiveHint: false },
    },
    async ({ campaignId }) =>
      runTool(() => getCampaignDetails(env, campaignId)),
  );

  server.registerTool(
    "get_campaign_statistics",
    {
      title: "Get TrafficStars campaign statistics",
      description:
        "Read campaign statistics for a validated date range and supported grouping.",
      inputSchema: z
        .object({
          date_from: z.string(),
          date_to: z.string(),
          group_by: z.string(),
          campaigns: z.array(z.number().int().positive()).max(500).optional(),
          groups: z.array(z.number().int().positive()).max(500).optional(),
          countries: z.array(z.string().max(3)).max(300).optional(),
          statuses: z.array(z.string().max(50)).max(50).optional(),
          show_archived: z.boolean().optional(),
        })
        .strict(),
      annotations: { readOnlyHint: true, destructiveHint: false },
    },
    async (input) =>
      runTool(() =>
        getCampaignStatistics(
          env,
          input as CampaignStatisticsRequest,
        ),
      ),
  );

  server.registerTool(
    "analyze_campaign_performance",
    {
      title: "Analyze TrafficStars campaign performance",
      description:
        "Calculate totals and derived performance metrics from verified campaign statistics for a date range.",
      inputSchema: z
        .object({
          date_from: z.string(),
          date_to: z.string(),
          campaigns: z.array(z.number().int().positive()).max(500).optional(),
        })
        .strict(),
      annotations: { readOnlyHint: true, destructiveHint: false },
    },
    async ({ date_from, date_to, campaigns }) =>
      runTool(async () => {
        const raw = await getCampaignStatistics(env, {
          date_from,
          date_to,
          group_by: "campaign",
          campaigns,
        });

        if (
          typeof raw !== "object" ||
          raw === null ||
          !Array.isArray((raw as Record<string, unknown>).data)
        ) {
          return {
            analysis_available: false,
            reason: "The API response did not contain campaign statistics.",
          };
        }

        const rows = (raw as { data: unknown[] }).data;
        const totals = {
          campaigns: rows.length,
          impressions: 0,
          clicks: 0,
          leads: 0,
          costs: 0,
          earnings: 0,
        };

        for (const row of rows) {
          if (typeof row !== "object" || row === null) continue;

          const item = row as Record<string, unknown>;

          for (const key of [
            "impressions",
            "clicks",
            "leads",
            "costs",
            "earnings",
          ] as const) {
            const value = item[key];

            if (typeof value === "number" && Number.isFinite(value)) {
              totals[key] += value;
            } else if (
              typeof value === "string" &&
              value.trim() !== "" &&
              Number.isFinite(Number(value))
            ) {
              totals[key] += Number(value);
            }
          }
        }

        const ctr =
          totals.impressions > 0
            ? (totals.clicks / totals.impressions) * 100
            : null;

        const cpc =
          totals.clicks > 0 ? totals.costs / totals.clicks : null;

        const cpa =
          totals.leads > 0 ? totals.costs / totals.leads : null;

        const roi =
          totals.costs > 0
            ? ((totals.earnings - totals.costs) / totals.costs) * 100
            : null;

        return {
          date_from,
          date_to,
          totals,
          derived_metrics: {
            ctr_percent: ctr,
            average_cost_per_click: cpc,
            average_cost_per_lead: cpa,
            roi_percent: roi,
          },
          note:
            "Totals are calculated from the returned campaign rows. Missing or non-numeric fields are not estimated.",
        };
      }),
  );

  server.registerTool("pause_campaigns", {
    title: "Pause TrafficStars campaigns",
    description: "Pause one or more campaigns. Requires trafficstars:manage authorization. This changes campaign delivery but does not create spend.",
    inputSchema: z.object({ campaignIds: z.array(z.number().int().positive()).min(1).max(100) }).strict(),
    annotations: { readOnlyHint: false, destructiveHint: true },
  }, async ({ campaignIds }) => {
    if (!canManage) return toolError("Management authorization is required. Reconnect and approve trafficstars:manage.");
    return runTool(() => pauseCampaigns(env, campaignIds));
  });

  server.registerTool("run_campaigns", {
    title: "Activate TrafficStars campaigns",
    description: "Activate campaigns only after tracking is verified and the user explicitly approves the resulting spend. Requires the exact approval phrase.",
    inputSchema: z.object({
      campaignIds: z.array(z.number().int().positive()).min(1).max(100),
      trackingVerified: z.literal(true),
      approval: z.literal("I approve activating the listed TrafficStars campaigns and the resulting spend."),
    }).strict(),
    annotations: { readOnlyHint: false, destructiveHint: true },
  }, async ({ campaignIds, trackingVerified }) => {
    if (!canManage) return toolError("Management authorization is required. Reconnect and approve trafficstars:manage.");
    return runTool(async () => {
      if (trackingVerified !== true) throw new Error("Tracking must be verified before activation.");
      return runCampaigns(env, campaignIds);
    });
  });

  server.registerTool("update_campaign", {
    title: "Edit a TrafficStars campaign",
    description: "Edit allowlisted campaign settings. Bid, payout, daily/total budget, and test-period budget changes require the exact explicit approval phrase. Requires trafficstars:manage.",
    inputSchema: z.object({
      campaignId: z.number().int().positive(),
      changes: campaignChangesSchema,
      approval: z.string().optional(),
    }).strict(),
    annotations: { readOnlyHint: false, destructiveHint: true },
  }, async ({ campaignId, changes, approval }) => {
    if (!canManage) return toolError("Management authorization is required. Reconnect and approve trafficstars:manage.");
    return runTool(async () => {
      const budgetFields = ["price", "price_rtb", "pricing_model", "max_daily", "total_budget", "use_total_budget", "test_period_budget"];
      if (budgetFields.some((field) => Object.hasOwn(changes, field)) && approval !== "I approve the requested TrafficStars budget or bid change.") {
        throw new Error("Budget and bid changes require explicit user approval.");
      }
      return updateCampaign(env, campaignId, changes);
    });
  });

  return server;

}

const resourceServer = new OAuthResourceServer<Env, unknown>({
  resourceMetadata: {
    resource: MCP_RESOURCE,
    authorization_servers: [AUTH_ISSUER],
    bearer_methods_supported: ["header"],
    resource_name: "TrafficStars Manager - TicketDepart",
  },
  requiredScopes: [READ_SCOPE, MANAGE_SCOPE],
  validateToken: (env) => (resource, token) =>
    env.AUTH_SERVER.validateToken(resource, token),
  handler: {
    async fetch(request: Request, env: Env, ctx): Promise<Response> {
      if (!ctx.auth.scope.includes(READ_SCOPE) || !ctx.auth.scope.includes(MANAGE_SCOPE)) {
        return Response.json(
          { error: "insufficient_scope" },
          { status: 403 },
        );
      }

      const handler = createMcpHandler(
        () => createServer(env, ctx.auth.scope.includes(MANAGE_SCOPE)),
        { legacy: "stateless" },
      );

      return handler.fetch(request);
    },
  },
});

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const hostRejected = hostHeaderValidationResponse(request, [MCP_HOST]);

    if (hostRejected) return hostRejected;

    // The automation bridge is a separate machine-to-machine route protected
    // by the repository-scoped GitHub Actions OIDC token validated above.
    if (new URL(request.url).pathname === "/bridge/execute") {
      return handleBridge(request, env);
    }

    const originRejected = originValidationResponse(request, [MCP_HOST]);

    if (originRejected) return originRejected;

    return resourceServer.fetch(request, env, ctx);
  },
};
