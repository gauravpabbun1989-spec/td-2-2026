interface D1Statement {
  bind(...values: unknown[]): D1Statement;
  first<T = Record<string, unknown>>(): Promise<T | null>;
  all<T = Record<string, unknown>>(): Promise<{ results: T[] }>;
  run(): Promise<unknown>;
}

interface D1Database {
  prepare(query: string): D1Statement;
  batch(statements: D1Statement[]): Promise<unknown[]>;
}

export interface CallTrackerEnv {
  DB: D1Database;
  CALL_INGEST_SECRET?: string;
  INGEST_SECRET?: string;
  TRAFFICSTARS_POSTBACK_KEY?: string;
  TRAFFICSTARS_POSTBACK_ENABLED?: string;
}

const GOAL_ID = "6487";
const CAMPAIGN_ID = "1653463";
const CLICK_TTL_MS = 90 * 24 * 60 * 60 * 1000;

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
    },
  });

async function auth(request: Request, secret?: string): Promise<boolean> {
  const header = request.headers.get("authorization") || "";
  if (!secret || !header.startsWith("Bearer ")) return false;

  const supplied = new TextEncoder().encode(header.slice(7));
  const expected = new TextEncoder().encode(secret);
  if (supplied.length !== expected.length) return false;

  let difference = 0;
  for (let index = 0; index < supplied.length; index += 1) {
    difference |= supplied[index] ^ expected[index];
  }
  return difference === 0;
}

const isTicketDepartDid = (value: string): boolean => {
  const digits = value.replace(/\\D/g, "");
  return digits === "18885649049" || digits === "8885649049";
};

const validTime = (value: unknown): value is string =>
  typeof value === "string" &&
  value.length <= 40 &&
  !Number.isNaN(Date.parse(value));

type InboundCall = {
  call_uuid: string;
  destination: string;
  agent_extension: string;
  created_at: string;
  answered_at: string | null;
  hangup_at: string;
  billsec: number;
};

function bindCall(statement: D1Statement, call: InboundCall) {
  return statement.bind(
    call.call_uuid,
    call.destination,
    call.agent_extension,
    call.created_at,
    call.answered_at,
    call.hangup_at,
    call.billsec,
  );
}

async function storeUnmatchedCall(env: CallTrackerEnv, call: InboundCall) {
  await bindCall(
    env.DB.prepare(
      "INSERT INTO inbound_calls (call_uuid,click_id,caller_hash,destination,agent_extension,created_at,answered_at,hangup_at,billsec,attribution_status,attribution_method,matched_intent_id) VALUES (?,NULL,NULL,?,?,?,?,?,?,'unmatched',NULL,NULL) ON CONFLICT(call_uuid) DO UPDATE SET destination=excluded.destination,agent_extension=excluded.agent_extension,created_at=excluded.created_at,answered_at=excluded.answered_at,hangup_at=excluded.hangup_at,billsec=excluded.billsec",
    ),
    call,
  ).run();
}

async function correlateAndStoreCall(env: CallTrackerEnv, call: InboundCall) {
  const existing = await env.DB.prepare(
    "SELECT attribution_status FROM inbound_calls WHERE call_uuid=?",
  ).bind(call.call_uuid).first<{ attribution_status: string }>();

  if (existing) {
    await env.DB.prepare(
      "UPDATE inbound_calls SET destination=?,agent_extension=?,created_at=?,answered_at=?,hangup_at=?,billsec=? WHERE call_uuid=?",
    ).bind(
      call.destination, call.agent_extension, call.created_at,
      call.answered_at, call.hangup_at, call.billsec, call.call_uuid,
    ).run();
    return existing.attribution_status;
  }

  // A website intent is not proof that this PSTN call came from that visitor.
  // Until a verified call-session identifier is transported into FreeSWITCH,
  // retain the call as unattributed and never infer its source from timestamps.
  await storeUnmatchedCall(env, call);
  return "unmatched";
}



async function correlateAndStoreRingingEvent(
  env: CallTrackerEnv,
  input: { call_uuid: string; destination: string; agent_extension: string; ringing_at: string },
) {
  const existing = await env.DB.prepare(
    "SELECT call_uuid,click_id,attribution_status,attribution_method,matched_intent_id FROM call_ringing_events WHERE call_uuid=?",
  ).bind(input.call_uuid).first<{
    call_uuid: string; click_id: string | null; attribution_status: string;
    attribution_method: string | null; matched_intent_id: string | null;
  }>();

  if (existing) return { ...existing, duplicate: true };

  // Record every real FreeSWITCH ring, but fail closed on attribution.
  // The shared toll-free PSTN route does not carry the browser click ID.
  await env.DB.prepare(
    "INSERT INTO call_ringing_events (call_uuid,destination,agent_extension,ringing_at,goal_id,event_type,click_id,attribution_status,attribution_method,matched_intent_id) VALUES (?,?,?,?,?,'call_ringing',NULL,'unmatched','no_verified_click_transport',NULL) ON CONFLICT(call_uuid) DO NOTHING",
  ).bind(
    input.call_uuid, input.destination, input.agent_extension,
    input.ringing_at, GOAL_ID,
  ).run();

  const stored = await env.DB.prepare(
    "SELECT call_uuid,click_id,attribution_status,attribution_method,matched_intent_id FROM call_ringing_events WHERE call_uuid=?",
  ).bind(input.call_uuid).first<{
    call_uuid: string; click_id: string | null; attribution_status: string;
    attribution_method: string | null; matched_intent_id: string | null;
  }>();
  return { ...stored, duplicate: false };
}


type RingingPostbackResult = {
  sent: boolean;
  status: "sent" | "failed" | "disabled" | "unattributed" | "already_sent" | "rejected";
};
const MAX_POSTBACK_ATTEMPTS = 6;
const POSTBACK_RETRY_BASE_MS = 60 * 1000;

async function sendRingingPostback(
  env: CallTrackerEnv,
  event: { call_uuid: string; click_id: string | null; attribution_status: string; attribution_method?: string | null },
): Promise<RingingPostbackResult> {
  if (event.attribution_status !== "verified" || event.attribution_method !== "signed_call_session" || !event.click_id) return { sent: false, status: "unattributed" };
  if (env.TRAFFICSTARS_POSTBACK_ENABLED !== "true" || !env.TRAFFICSTARS_POSTBACK_KEY) return { sent: false, status: "disabled" };
  const prior = await env.DB.prepare(
    "SELECT postback_status,postback_attempt_count FROM call_ringing_events WHERE call_uuid=?",
  ).bind(event.call_uuid).first<{ postback_status: string; postback_attempt_count: number }>();
  if (prior?.postback_status === "sent") return { sent: false, status: "already_sent" };
  const attempt = Number(prior?.postback_attempt_count || 0) + 1;
  if (attempt > MAX_POSTBACK_ATTEMPTS) return { sent: false, status: "failed" };
  const endpoint = new URL("https://tsyndicate.com/api/v2/cpa/action");
  endpoint.search = new URLSearchParams({
    lead_code: event.call_uuid,
    clickid: event.click_id, key: env.TRAFFICSTARS_POSTBACK_KEY, goalid: GOAL_ID,
  }).toString();
  const attemptedAt = new Date().toISOString();
  const persist = async (status: "sent" | "failed" | "rejected", httpStatus: number | null, error: string | null) => {
    const retryAt = status === "failed" && attempt < MAX_POSTBACK_ATTEMPTS
      ? new Date(Date.now() + POSTBACK_RETRY_BASE_MS * 2 ** (attempt - 1)).toISOString()
      : null;
    await env.DB.prepare(
      "UPDATE call_ringing_events SET postback_status=?,postback_attempt_count=?,postback_attempted_at=?,postback_http_status=?,postback_next_retry_at=?,postback_last_error=? WHERE call_uuid=?",
    ).bind(status, attempt, attemptedAt, httpStatus, retryAt, error, event.call_uuid).run();
  };
  try {
    const response = await fetch(endpoint.toString(), { method: "GET" });
    if (response.ok) {
      await persist("sent", response.status, null);
      return { sent: true, status: "sent" };
    }
    const retryable = response.status === 408 || response.status === 429 || response.status >= 500;
    await persist(
      retryable ? "failed" : "rejected",
      response.status,
      retryable ? `TrafficStars HTTP ${response.status}` : `TrafficStars rejected postback (HTTP ${response.status})`,
    );
    return { sent: false, status: retryable ? "failed" : "rejected" };
  } catch {
    await persist("failed", null, "TrafficStars request failed before an HTTP response");
    return { sent: false, status: "failed" };
  }
}

async function retryFailedPostbacks(env: CallTrackerEnv) {
  if (env.TRAFFICSTARS_POSTBACK_ENABLED !== "true" || !env.TRAFFICSTARS_POSTBACK_KEY) return { checked: 0, sent: 0, failed: 0 };
  const due = await env.DB.prepare(
    "SELECT call_uuid,click_id,attribution_status,attribution_method FROM call_ringing_events WHERE postback_status='failed' AND postback_next_retry_at IS NOT NULL AND postback_next_retry_at<=? AND postback_attempt_count<? ORDER BY postback_next_retry_at ASC LIMIT 25",
  ).bind(new Date().toISOString(), MAX_POSTBACK_ATTEMPTS).all<{
    call_uuid: string; click_id: string | null; attribution_status: string; attribution_method: string | null;
  }>();
  let sent = 0;
  let failed = 0;
  for (const event of due.results || []) {
    const result = await sendRingingPostback(env, event);
    if (result.sent) sent += 1;
    else if (result.status === "failed") failed += 1;
  }
  return { checked: due.results?.length || 0, sent, failed };
}

export default {
  async scheduled(
    _controller: { scheduledTime: number; cron: string },
    env: CallTrackerEnv,
    context: { waitUntil(promise: Promise<unknown>): void },
  ) {
    context.waitUntil(retryFailedPostbacks(env));
  },
  async fetch(request: Request, env: CallTrackerEnv): Promise<Response> {
    const url = new URL(request.url);

    if (request.method === "GET" && url.pathname === "/health") {
      return json({
        ok: true,
        service: "ticketdepart-call-tracker",
        goal_id: GOAL_ID,
        database: Boolean(env.DB),
      });
    }

    if (request.method === "GET" && url.pathname === "/click") {
      const id = (url.searchParams.get("click_id") || "").trim();
      if (!/^[A-Za-z0-9._~-]{1,200}$/.test(id)) {
        return json({ error: "invalid_click_id" }, 400);
      }

      const now = new Date();
      const expires = new Date(now.getTime() + CLICK_TTL_MS);
      await env.DB.prepare(
        "INSERT INTO traffic_clicks (click_id,campaign_id,creative_id,site_id,country_code,landing_path,clicked_at,expires_at) VALUES (?,?,?,?,?,?,?,?) ON CONFLICT(click_id) DO UPDATE SET clicked_at=excluded.clicked_at,expires_at=excluded.expires_at",
      )
        .bind(
          id,
          CAMPAIGN_ID,
          url.searchParams.get("banner_id"),
          "ticketdepart.com",
          url.searchParams.get("country"),
          url.searchParams.get("path") || "/",
          now.toISOString(),
          expires.toISOString(),
        )
        .run();

      return json({
        ok: true,
        click_id: id,
        expires_at: expires.toISOString(),
      });
    }

    if (request.method === "POST" && url.pathname === "/intent") {
      let body: Record<string, unknown>;
      try {
        body = JSON.parse(await request.text());
      } catch {
        return json({ error: "invalid_json" }, 400);
      }

      const clickId = String(body.click_id || "").trim();
      const intentId = String(body.intent_id || "").trim();
      if (
        !/^[A-Za-z0-9._~-]{1,200}$/.test(clickId) ||
        !/^[A-Za-z0-9._:-]{8,128}$/.test(intentId)
      ) {
        return json({ error: "invalid_identifiers" }, 400);
      }

      const now = new Date();
      const nowIso = now.toISOString();
      const existingClick = await env.DB.prepare(
        "SELECT click_id, expires_at FROM traffic_clicks WHERE click_id=?",
      )
        .bind(clickId)
        .first<{ click_id: string; expires_at: string }>();

      let clickRegistered = false;
      if (existingClick) {
        if (
          !validTime(existingClick.expires_at) ||
          Date.parse(existingClick.expires_at) < now.getTime()
        ) {
          return json({ error: "unknown_or_expired_click_id" }, 404);
        }
      } else {
        // Older site builds sent /intent without first calling /click. Register
        // the URL click ID here so the intent and click are linked atomically
        // from the caller's perspective. This records intent only; it is not
        // evidence of an answered or accepted call.
        const suppliedClickTime = validTime(body.clicked_at)
          ? new Date(body.clicked_at)
          : now;
        if (suppliedClickTime.getTime() > now.getTime() + 5 * 60 * 1000) {
          return json({ error: "invalid_clicked_at" }, 400);
        }
        if (suppliedClickTime.getTime() < now.getTime() - CLICK_TTL_MS) {
          return json({ error: "unknown_or_expired_click_id" }, 404);
        }

        const clickedAt = suppliedClickTime.toISOString();
        const expiresAt = new Date(
          suppliedClickTime.getTime() + CLICK_TTL_MS,
        ).toISOString();
        const rawLandingPath = String(
          body.landing_path || body.page_path || "/",
        ).slice(0, 512);
        const landingPath = rawLandingPath.startsWith("/")
          ? rawLandingPath
          : "/";
        const bannerId = String(body.banner_id || "").trim().slice(0, 80) || null;
        const countryCode =
          String(body.country_code || "").trim().slice(0, 8) || null;

        await env.DB.prepare(
          "INSERT INTO traffic_clicks (click_id,campaign_id,creative_id,site_id,country_code,landing_path,clicked_at,expires_at) VALUES (?,?,?,?,?,?,?,?) ON CONFLICT(click_id) DO NOTHING",
        )
          .bind(
            clickId,
            CAMPAIGN_ID,
            bannerId,
            "ticketdepart.com",
            countryCode,
            landingPath,
            clickedAt,
            expiresAt,
          )
          .run();
        clickRegistered = true;
      }

      const rawPagePath = String(body.page_path || "/").slice(0, 512);
      const pagePath = rawPagePath.startsWith("/") ? rawPagePath : "/";
      const ctaLocation = String(body.cta_location || "unknown").slice(0, 80);

      await env.DB.prepare(
        "INSERT INTO call_intents (intent_id,click_id,created_at,page_path,cta_location,status) VALUES (?,?,?,?,?,'open') ON CONFLICT(intent_id) DO NOTHING",
      )
        .bind(intentId, clickId, nowIso, pagePath, ctaLocation)
        .run();

      return json(
        {
          ok: true,
          click_registered: clickRegistered,
          intent_recorded: true,
          attribution: "intent_only",
          conversions_created: 0,
        },
        202,
      );
    }

    if (request.method === "POST" && url.pathname === "/v1/calls/ingest") {
      if (!(await auth(request, env.CALL_INGEST_SECRET))) {
        return json({ error: "unauthorized" }, 401);
      }

      const raw = await request.text();
      if (raw.length > 65536) return json({ error: "payload_too_large" }, 413);

      let body: { calls?: Array<Record<string, unknown>> };
      try {
        body = JSON.parse(raw);
      } catch {
        return json({ error: "invalid_json" }, 400);
      }

      if (
        !Array.isArray(body.calls) ||
        body.calls.length < 1 ||
        body.calls.length > 50
      ) {
        return json({ error: "calls_must_be_array_of_1_to_50" }, 400);
      }

      const rows = body.calls;
      for (const call of rows) {
        if (
          typeof call.call_uuid !== "string" ||
          !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
            call.call_uuid,
          )
        ) {
          return json({ error: "invalid_call_uuid" }, 400);
        }
        if (
          typeof call.destination !== "string" ||
          !isTicketDepartDid(call.destination) ||
          call.agent_extension !== "1001"
        ) {
          return json({ error: "invalid_call_route" }, 400);
        }
        if (
          !validTime(call.created_at) ||
          !validTime(call.hangup_at) ||
          (call.answered_at !== null && !validTime(call.answered_at))
        ) {
          return json({ error: "invalid_call_timestamp" }, 400);
        }
        if (
          !Number.isInteger(call.billsec) ||
          Number(call.billsec) < 0 ||
          Number(call.billsec) > 86400
        ) {
          return json({ error: "invalid_billsec" }, 400);
        }
      }

      let correlated = 0;
      let ambiguous = 0;
      let unmatched = 0;
      for (const row of rows) {
        const status = await correlateAndStoreCall(env, {
          call_uuid: String(row.call_uuid),
          destination: String(row.destination),
          agent_extension: String(row.agent_extension),
          created_at: String(row.created_at),
          answered_at: row.answered_at as string | null,
          hangup_at: String(row.hangup_at),
          billsec: Number(row.billsec),
        });
        if (status === "candidate") correlated += 1;
        else if (status === "ambiguous") ambiguous += 1;
        else unmatched += 1;
      }

      return json({
        ok: true,
        received: rows.length,
        stored: true,
        attribution: "candidate_only_time_window",
        correlated_candidates: correlated,
        ambiguous,
        unmatched,
        conversions_created: 0,
      });
    }

    if (request.method === "POST" && url.pathname === "/v1/calls/ringing") {
      if (!(await auth(request, env.CALL_INGEST_SECRET))) {
        return json({ error: "unauthorized" }, 401);
      }

      const raw = await request.text();
      if (raw.length > 8192) return json({ error: "payload_too_large" }, 413);

      let body: Record<string, unknown>;
      try {
        body = JSON.parse(raw);
      } catch {
        return json({ error: "invalid_json" }, 400);
      }

      const callUuid = String(body.call_uuid || "");
      const destination = String(body.destination || "");
      const agentExtension = String(body.agent_extension || "");
      const ringingAt = body.ringing_at;

      if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(callUuid)) {
        return json({ error: "invalid_call_uuid" }, 400);
      }
      if (!isTicketDepartDid(destination) || agentExtension !== "1001") {
        return json({ error: "invalid_call_route" }, 400);
      }
      if (!validTime(ringingAt)) {
        return json({ error: "invalid_ringing_timestamp" }, 400);
      }

      // Store the first ring event and conservatively reserve one matching click intent.
      // A unique time-window candidate is reported as the configured ring conversion.
      const stored = await correlateAndStoreRingingEvent(env, {
        call_uuid: callUuid,
        destination,
        agent_extension: agentExtension,
        ringing_at: ringingAt,
      });
      const postback = stored?.call_uuid
        ? await sendRingingPostback(env, {
            call_uuid: stored.call_uuid,
            click_id: stored.click_id || null,
            attribution_status: stored.attribution_status || "unmatched",
            attribution_method: stored.attribution_method || null,
          })
        : { sent: false, status: "failed" as const };

      return json({
        ok: true,
        conversion_event: "call_ringing",
        goal_id: GOAL_ID,
        call_uuid: callUuid,
        recorded: Boolean(stored?.call_uuid),
        duplicate: Boolean(stored?.duplicate),
        click_id: stored?.click_id || null,
        attribution: stored?.attribution_status || "unmatched",
        attribution_method: stored?.attribution_method || null,
        postback_sent: postback.sent,
        postback_status: postback.status,
      }, 202);
    }

    if (request.method === "POST" && url.pathname === "/v1/calls/accepted") {
      if (!(await auth(request, env.INGEST_SECRET))) {
        return json({ error: "unauthorized" }, 401);
      }
      return json(
        {
          error: "attribution_not_verified",
          message:
            "Accepted-call postbacks are disabled until FreeSWITCH call ingestion, click correlation, and qualification are verified.",
        },
        409,
      );
    }

    return json({ error: "not_found" }, 404);
  },
};
