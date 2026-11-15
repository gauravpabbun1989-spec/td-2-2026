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

import {
  getAccountBalance,
  getAccountSession,
  getCampaignDetails,
  getCampaignStatistics,
  listCampaigns,
  type CampaignStatisticsRequest,
  type TrafficStarsEnv,
} from "../shared/trafficstars-api";

const MCP_HOST = "trafficstars-mcp.gaurav-pabbun.workers.dev";
const MCP_RESOURCE = `https://${MCP_HOST}/mcp`;
const AUTH_ISSUER = "https://trafficstars-auth.gaurav-pabbun.workers.dev";
const READ_SCOPE = "trafficstars:read";

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

function toolError() {
  return {
    isError: true,
    content: [{
      type: "text" as const,
      text: "TrafficStars operation failed. Check the input and try again.",
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

function createServer(env: Env): McpServer {
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

  return server;
}

const resourceServer = new OAuthResourceServer<Env, unknown>({
  resourceMetadata: {
    resource: MCP_RESOURCE,
    authorization_servers: [AUTH_ISSUER],
    bearer_methods_supported: ["header"],
    resource_name: "TrafficStars Manager - TicketDepart",
  },
  requiredScopes: [READ_SCOPE],
  validateToken: (env) => (resource, token) =>
    env.AUTH_SERVER.validateToken(resource, token),
  handler: {
    async fetch(request: Request, env: Env, ctx): Promise<Response> {
      if (!ctx.auth.scope.includes(READ_SCOPE)) {
        return Response.json(
          { error: "insufficient_scope" },
          { status: 403 },
        );
      }

      const handler = createMcpHandler(
        () => createServer(env),
        { legacy: "reject" },
      );

      return handler.fetch(request);
    },
  },
});

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const hostRejected = hostHeaderValidationResponse(request, [MCP_HOST]);

    if (hostRejected) return hostRejected;

    const originRejected = originValidationResponse(request, [MCP_HOST]);

    if (originRejected) return originRejected;

    return resourceServer.fetch(request, env, ctx);
  },
};
