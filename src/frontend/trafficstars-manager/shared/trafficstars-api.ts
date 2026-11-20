const API_BASE = "https://api.trafficstars.com";
const TOKEN_ENDPOINT = "/v1/auth/token";

export interface TrafficStarsEnv {
  TRAFFICSTARS_API_KEY: string;
}

interface TokenResponse {
  access_token?: string;
  expires_in?: number;
  refresh_token?: string;
  token_type?: string;
}

interface CachedToken {
  value: string;
  expiresAt: number;
}

export interface CampaignStatisticsRequest {
  date_from: string;
  date_to: string;
  group_by: string;
  campaigns?: number[];
  groups?: number[];
  countries?: string[];
  statuses?: string[];
  show_archived?: boolean;
}

let cachedToken: CachedToken | undefined;
let pendingTokenRequest: Promise<string> | undefined;

export class TrafficStarsApiError extends Error {
  readonly status?: number;
  readonly operation: string;

  constructor(operation: string, status?: number) {
    super(
      status === undefined
        ? `TrafficStars API request failed: ${operation}`
        : `TrafficStars API request failed: ${operation} (HTTP ${status})`,
    );
    this.name = "TrafficStarsApiError";
    this.operation = operation;
    this.status = status;
  }
}

function requireApiKey(env: TrafficStarsEnv): string {
  const key = env.TRAFFICSTARS_API_KEY?.trim();

  if (!key) {
    throw new TrafficStarsApiError("API key is not configured");
  }

  return key;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

async function readJson(response: Response, operation: string): Promise<unknown> {
  if (!response.ok) {
    // Never include upstream response bodies: they may contain sensitive data.
    throw new TrafficStarsApiError(operation, response.status);
  }

  try {
    return await response.json();
  } catch {
    throw new TrafficStarsApiError(`${operation}: invalid JSON response`);
  }
}

async function obtainAccessToken(env: TrafficStarsEnv): Promise<string> {
  const apiKey = requireApiKey(env);
  const now = Date.now();

  if (cachedToken && cachedToken.expiresAt > now + 60_000) {
    return cachedToken.value;
  }

  if (pendingTokenRequest) {
    return pendingTokenRequest;
  }

  pendingTokenRequest = (async () => {
    const body = new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: apiKey,
    });

    let response: Response;

    try {
      response = await fetch(`${API_BASE}${TOKEN_ENDPOINT}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json",
        },
        body,
        signal: AbortSignal.timeout(15_000),
      });
    } catch {
      throw new TrafficStarsApiError("authentication network request");
    }

    const data = await readJson(response, "authentication");

    if (!isRecord(data) || typeof data.access_token !== "string" || !data.access_token) {
      throw new TrafficStarsApiError("authentication response did not contain an access token");
    }

    const expiresIn =
      typeof data.expires_in === "number" &&
      Number.isFinite(data.expires_in) &&
      data.expires_in > 0
        ? data.expires_in
        : 86_400;

    cachedToken = {
      value: data.access_token,
      expiresAt: Date.now() + expiresIn * 1000,
    };

    return data.access_token;
  })();

  try {
    return await pendingTokenRequest;
  } finally {
    pendingTokenRequest = undefined;
  }
}

async function request<T>(
  env: TrafficStarsEnv,
  operation: string,
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const token = await obtainAccessToken(env);

  let response: Response;

  try {
    response = await fetch(`${API_BASE}${path}`, {
      ...init,
      headers: {
        Accept: "application/json",
        ...(init.body ? { "Content-Type": "application/json" } : {}),
        ...init.headers,
        Authorization: `Bearer ${token}`,
      },
      signal: init.signal ?? AbortSignal.timeout(20_000),
    });
  } catch {
    throw new TrafficStarsApiError(`${operation}: network request`);
  }

  const data = await readJson(response, operation);
  return data as T;
}

function validateDate(value: string, field: string): void {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    throw new Error(`${field} must use YYYY-MM-DD format`);
  }

  const parsed = new Date(`${value}T00:00:00Z`);

  if (
    Number.isNaN(parsed.getTime()) ||
    parsed.toISOString().slice(0, 10) !== value
  ) {
    throw new Error(`${field} is not a valid calendar date`);
  }
}

function validateStatistics(input: CampaignStatisticsRequest): void {
  validateDate(input.date_from, "date_from");
  validateDate(input.date_to, "date_to");

  const from = Date.parse(`${input.date_from}T00:00:00Z`);
  const to = Date.parse(`${input.date_to}T00:00:00Z`);

  if (to < from) {
    throw new Error("date_to must be on or after date_from");
  }

  const days = Math.floor((to - from) / 86_400_000) + 1;

  if (days > 180) {
    throw new Error("Statistics date range cannot exceed 180 days");
  }

  const allowedGroups = new Set([
    "ad_format",
    "campaign",
    "group",
    "date",
    "hour",
    "spot",
    "site",
    "country",
    "creative",
    "device",
    "os",
    "browser",
    "language",
    "carrier",
    "region",
    "creative_url",
  ]);

  if (!allowedGroups.has(input.group_by)) {
    throw new Error("Unsupported statistics group_by value");
  }

  if (input.group_by === "hour") {
    if (days > 7) {
      throw new Error("Hourly statistics are limited to seven days");
    }

    if (!input.campaigns || input.campaigns.length !== 1) {
      throw new Error("Hourly statistics require exactly one campaign ID");
    }
  }

  for (const id of input.campaigns ?? []) {
    if (!Number.isSafeInteger(id) || id <= 0) {
      throw new Error("Campaign IDs must be positive integers");
    }
  }

  for (const id of input.groups ?? []) {
    if (!Number.isSafeInteger(id) || id <= 0) {
      throw new Error("Group IDs must be positive integers");
    }
  }
}

export async function getAccountBalance(env: TrafficStarsEnv): Promise<unknown> {
  return request(
    env,
    "account balance",
    "/v2/userinfo/balance",
  );
}

export async function getAccountSession(env: TrafficStarsEnv): Promise<unknown> {
  return request(
    env,
    "account session information",
    "/v1/auth/info",
  );
}

export async function listCampaigns(
  env: TrafficStarsEnv,
  filters: Record<string, string | number | boolean> = {},
): Promise<unknown> {
  const allowed = new Set([
    "order",
    "id",
    "format_id",
    "ad_format_id",
    "pricing_model",
    "status",
    "flat_rate",
    "traffic_type",
    "traffic_source_type",
    "network_traffic_type",
  ]);

  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(filters)) {
    if (!allowed.has(key)) {
      throw new Error(`Unsupported campaign filter: ${key}`);
    }

    params.set(key, String(value));
  }

  const suffix = params.size ? `?${params.toString()}` : "";

  return request(
    env,
    "campaign list",
    `/v1.1/campaigns${suffix}`,
  );
}



const APPROVED_PUSH_CLICK_URL = "https://ticketdepart.com/?click_id={click_id}";
const APPROVED_CLICK_ID_BANNER_ID = 8369514;

export async function updateCampaignBannerClickUrl(
  env: TrafficStarsEnv,
  bannerId: number,
  destinationUrl: string,
): Promise<unknown> {
  if (bannerId !== APPROVED_CLICK_ID_BANNER_ID) {
    throw new Error("Only the identified TicketDepart banner can be updated");
  }
  if (destinationUrl !== APPROVED_PUSH_CLICK_URL) {
    throw new Error("Destination URL must be the approved TicketDepart click_id URL");
  }

  return request(
    env,
    "update banner destination URL",
    `/v1.1/banners/${bannerId}`,
    {
      method: "PATCH",
      body: JSON.stringify({ url: destinationUrl }),
    },
  );
}

export async function listCampaignBanners(
  env: TrafficStarsEnv,
  campaignId: number,
  page = 1,
  size = 100,
): Promise<unknown> {
  if (!Number.isSafeInteger(campaignId) || campaignId <= 0) {
    throw new Error("campaignId must be a positive integer");
  }
  if (!Number.isSafeInteger(page) || page < 1 || page > 1000) {
    throw new Error("page must be an integer between 1 and 1000");
  }
  if (!Number.isSafeInteger(size) || size < 1 || size > 100) {
    throw new Error("size must be an integer between 1 and 100");
  }

  const params = new URLSearchParams({
    campaign_id: String(campaignId),
    page: String(page),
    size: String(size),
  });

  return request(
    env,
    "campaign banners",
    `/v2/banners?${params.toString()}`,
  );
}

export async function getCampaignDetails(
  env: TrafficStarsEnv,
  campaignId: number,
): Promise<unknown> {
  if (!Number.isSafeInteger(campaignId) || campaignId <= 0) {
    throw new Error("campaignId must be a positive integer");
  }

  return request(
    env,
    "campaign details",
    `/v1.1/campaigns/${campaignId}`,
  );
}

const CAMPAIGN_UPDATE_FIELDS = new Set([
  "name", "countries", "geo_targets", "categories", "exclude_categories",
  "keywords", "browsers", "browser_versions", "oses", "os_versions",
  "devices", "device_brands", "device_models", "languages", "carriers",
  "enabled_applications", "disabled_applications", "max_daily", "price",
  "pricing_model", "total_budget", "use_total_budget", "weight",
  "traffic_type", "traffic_source_type", "network_traffic_type",
  "enabled_subids", "disabled_subids", "spots", "exclude_spots",
  "push_format_option", "ad_format_options", "push_subscription_interval",
  "test_period", "test_period_budget", "schedule_start_time",
  "schedule_end_time", "schedule_timezone", "hours_targeting",
  "hours_retargeting", "disable_rtb", "price_rtb", "disable_rtb",
]);

function validateCampaignIds(ids: number[]): void {
  if (
    !Array.isArray(ids) ||
    ids.length < 1 ||
    ids.length > 100 ||
    ids.some((id) => !Number.isSafeInteger(id) || id <= 0)
  ) {
    throw new Error("campaign_ids must contain 1 to 100 positive integers");
  }
}

export async function pauseCampaigns(
  env: TrafficStarsEnv,
  campaignIds: number[],
): Promise<unknown> {
  validateCampaignIds(campaignIds);
  return request(env, "pause campaigns", "/v2/campaigns/pause", {
    method: "PUT",
    body: JSON.stringify({ campaign_ids: campaignIds }),
  });
}

export async function runCampaigns(
  env: TrafficStarsEnv,
  campaignIds: number[],
): Promise<unknown> {
  validateCampaignIds(campaignIds);
  return request(env, "run campaigns", "/v2/campaigns/run", {
    method: "PUT",
    body: JSON.stringify({ campaign_ids: campaignIds }),
  });
}

export async function updateCampaign(
  env: TrafficStarsEnv,
  campaignId: number,
  changes: Record<string, unknown>,
): Promise<unknown> {
  if (!Number.isSafeInteger(campaignId) || campaignId <= 0) {
    throw new Error("campaignId must be a positive integer");
  }
  const entries = Object.entries(changes);
  if (entries.length < 1 || entries.length > 30) {
    throw new Error("changes must contain between 1 and 30 fields");
  }

  for (const [key, value] of entries) {
    if (!CAMPAIGN_UPDATE_FIELDS.has(key)) {
      throw new Error(`Unsupported campaign update field: ${key}`);
    }
    if (
      value === null ||
      typeof value === "undefined" ||
      (typeof value === "number" && !Number.isFinite(value)) ||
      (typeof value === "string" && value.length > 2000)
    ) {
      throw new Error(`Invalid value for campaign field: ${key}`);
    }
    if (Array.isArray(value)) {
      if (
        value.length > 1000 ||
        value.some((item) =>
          typeof item !== "string" &&
          !(typeof item === "number" && Number.isSafeInteger(item))
        )
      ) {
        throw new Error(`Invalid array for campaign field: ${key}`);
      }
    } else if (
      typeof value !== "string" &&
      typeof value !== "number" &&
      typeof value !== "boolean"
    ) {
      throw new Error(`Invalid value for campaign field: ${key}`);
    }
  }

  return request(env, "update campaign", `/v1.1/campaigns/${campaignId}`, {
    method: "PATCH",
    body: JSON.stringify(changes),
  });
}

export async function getCampaignStatistics(
  env: TrafficStarsEnv,
  input: CampaignStatisticsRequest,
): Promise<unknown> {
  validateStatistics(input);

  return request(
    env,
    "campaign statistics",
    "/v2/campaigns/statistics",
    {
      method: "POST",
      body: JSON.stringify(input),
    },
  );
}
