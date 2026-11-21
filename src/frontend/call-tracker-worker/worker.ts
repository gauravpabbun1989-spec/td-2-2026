interface D1Statement {
  bind(...values: unknown[]): D1Statement;
  first<T = Record<string, unknown>>(): Promise<T | null>;
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

const validTime = (value: unknown): value is string =>
  typeof value === "string" &&
  value.length <= 40 &&
  !Number.isNaN(Date.parse(value));

export default {
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
          call.destination !== "1030605" ||
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

      const statements = rows.map((call) =>
        env.DB.prepare(
          "INSERT INTO inbound_calls (call_uuid,click_id,caller_hash,destination,agent_extension,created_at,answered_at,hangup_at,billsec) VALUES (?,NULL,NULL,?,?,?,?,?,?) ON CONFLICT(call_uuid) DO UPDATE SET destination=excluded.destination,agent_extension=excluded.agent_extension,created_at=excluded.created_at,answered_at=excluded.answered_at,hangup_at=excluded.hangup_at,billsec=excluded.billsec",
        ).bind(
          call.call_uuid,
          call.destination,
          call.agent_extension,
          call.created_at,
          call.answered_at,
          call.hangup_at,
          call.billsec,
        ),
      );
      await env.DB.batch(statements);

      return json({
        ok: true,
        received: rows.length,
        stored: true,
        attribution: "not_established",
        conversions_created: 0,
      });
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
