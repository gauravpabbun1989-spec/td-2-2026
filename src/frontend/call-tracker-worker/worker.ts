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
  CLICKFLARE_POSTBACK_ENABLED?: string;
  TELXIO_WEBHOOK_TOKEN?: string;
}

const GOAL_ID = "6487";
const CAMPAIGN_ID = "1653463";
const PUBLIC_DID = "18885649049";
const CLICK_TTL_MS = 90 * 24 * 60 * 60 * 1000;

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      "access-control-allow-origin": "*",
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

const normalizeDid = (value: string): string => value.replace(/\D/g, "");

const isTicketDepartPublicDid = (value: string): boolean => {
  const digits = normalizeDid(value);
  return digits === PUBLIC_DID || digits === "8885649049";
};

const canonicalTicketDepartPublicDid = (value: string): string =>
  isTicketDepartPublicDid(value) ? PUBLIC_DID : "";

function readClickFlareId(value: unknown): string | null {
  const id = String(value || "").trim();
  return /^[A-Za-z0-9._~-]{1,200}$/.test(id) ? id : null;
}

function getClickFlareId(params: URLSearchParams): string | null {
  return readClickFlareId(params.get("cf_click_id"));
}

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
    "SELECT call_uuid,click_id,clickflare_click_id,did_assignment_id,attribution_status,attribution_method,matched_intent_id FROM call_ringing_events WHERE call_uuid=?",
  ).bind(input.call_uuid).first<{
    call_uuid: string; click_id: string | null; clickflare_click_id: string | null;
    did_assignment_id: string | null; attribution_status: string;
    attribution_method: string | null; matched_intent_id: string | null;
  }>();
  if (existing) return { ...existing, duplicate: true };

  const ringingAtIso = new Date(input.ringing_at).toISOString();
  let clickId: string | null = null;
  let clickFlareId: string | null = null;
  let assignmentId: string | null = null;
  let matchedIntentId: string | null = null;
  let attributionStatus = "unmatched";
  let attributionMethod = "no_verified_click_transport";

  {
    // With one shared toll-free DID, the browser click ID cannot be carried
    // over the PSTN call itself. Match only a single, unclaimed phone-click
    // intent in the preceding ten minutes, and only if no other inbound ring
    // happened after that intent. Multiple candidates or intervening calls
    // are deliberately left ambiguous instead of guessing.
    const windowStart = new Date(Date.parse(ringingAtIso) - 10 * 60 * 1000).toISOString();
    const windowEnd = new Date(Date.parse(ringingAtIso) + 10 * 1000).toISOString();
    const candidates = await env.DB.prepare(
      "SELECT i.intent_id,i.click_id,i.created_at,t.clickflare_click_id FROM call_intents i INNER JOIN traffic_clicks t ON t.click_id=i.click_id WHERE i.status='open' AND i.matched_call_uuid IS NULL AND i.created_at>=? AND i.created_at<=? AND t.clickflare_click_id IS NOT NULL AND t.clickflare_click_id<>'' ORDER BY i.created_at DESC LIMIT 2",
    ).bind(windowStart, windowEnd).all<{
      intent_id: string; click_id: string; created_at: string; clickflare_click_id: string;
    }>();

    if ((candidates.results || []).length > 1) {
      attributionStatus = "ambiguous";
      attributionMethod = "multiple_recent_click_intents";
    } else if ((candidates.results || []).length === 1) {
      const candidate = candidates.results[0];
      const interveningCall = await env.DB.prepare(
        "SELECT call_uuid FROM call_ringing_events WHERE ringing_at>=? AND ringing_at<? AND call_uuid<>? LIMIT 1",
      ).bind(candidate.created_at, ringingAtIso, input.call_uuid).first<{ call_uuid: string }>();

      if (interveningCall) {
        attributionStatus = "ambiguous";
        attributionMethod = "multiple_calls_after_click_intent";
      } else {
        await env.DB.prepare(
          "UPDATE call_intents SET status='candidate',matched_call_uuid=? WHERE intent_id=? AND status='open' AND matched_call_uuid IS NULL",
        ).bind(input.call_uuid, candidate.intent_id).run();
        const reserved = await env.DB.prepare(
          "SELECT intent_id,click_id,status,matched_call_uuid FROM call_intents WHERE intent_id=?",
        ).bind(candidate.intent_id).first<{
          intent_id: string; click_id: string; status: string; matched_call_uuid: string | null;
        }>();

        if (reserved?.status === "candidate" && reserved.matched_call_uuid === input.call_uuid) {
          clickId = candidate.click_id;
          clickFlareId = candidate.clickflare_click_id;
          matchedIntentId = candidate.intent_id;
          attributionStatus = "candidate";
          attributionMethod = "single_number_unique_intent_window";
        } else {
          attributionStatus = "ambiguous";
          attributionMethod = "intent_already_reserved";
        }
      }
    }
  }

  await env.DB.prepare(
    "INSERT INTO call_ringing_events (call_uuid,destination,agent_extension,ringing_at,goal_id,event_type,click_id,attribution_status,attribution_method,matched_intent_id,clickflare_click_id,did_assignment_id) VALUES (?,?,?,?,?,'call_ringing',?,?,?,?,?,?) ON CONFLICT(call_uuid) DO NOTHING",
  ).bind(
    input.call_uuid, input.destination, input.agent_extension, ringingAtIso, GOAL_ID,
    clickId, attributionStatus, attributionMethod, matchedIntentId, clickFlareId, assignmentId,
  ).run();

  const stored = await env.DB.prepare(
    "SELECT call_uuid,click_id,clickflare_click_id,did_assignment_id,attribution_status,attribution_method,matched_intent_id FROM call_ringing_events WHERE call_uuid=?",
  ).bind(input.call_uuid).first<{
    call_uuid: string; click_id: string | null; clickflare_click_id: string | null;
    did_assignment_id: string | null; attribution_status: string;
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
  // The single-number flow never sends direct ad-network postbacks; this path only supports an explicit verified signed-call session.
  if (event.attribution_status !== "verified" || event.attribution_method !== "signed_call_session" || !event.click_id) return { sent: false, status: "unattributed" };
  if (env.TRAFFICSTARS_POSTBACK_ENABLED !== "true" || !env.TRAFFICSTARS_POSTBACK_KEY) return { sent: false, status: "disabled" };
  const prior = await env.DB.prepare(
    "SELECT postback_status,postback_attempt_count,postback_next_retry_at FROM call_ringing_events WHERE call_uuid=?",
  ).bind(event.call_uuid) .first<{ postback_status: string; postback_attempt_count: number; postback_next_retry_at: string | null }>();
  if (prior?.postback_status === "sent") return { sent: false, status: "already_sent" };
  if (prior?.postback_status === "rejected") return { sent: false, status: "rejected" };
  if (prior?.postback_status === "failed" && prior.postback_next_retry_at && Date.parse(prior.postback_next_retry_at) > Date.now()) return { sent: false, status: "failed" };
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

const CLICKFLARE_POSTBACK_URL = "https://globalvisitlog.com/cf/cv";
const CALL_PAYOUT_USD = "20";
const CLICKFLARE_CONVERSION_TYPE = "call";

type ClickFlarePostbackResult = {
  sent: boolean;
  status: "sent" | "failed" | "disabled" | "unattributed" | "already_sent" | "rejected";
};

async function sendClickFlarePostback(
  env: CallTrackerEnv,
  event: { call_uuid: string; clickflare_click_id: string | null; attribution_status: string; attribution_method?: string | null },
): Promise<ClickFlarePostbackResult> {
  // Approved shared-number attribution: only a unique, unclaimed website call intent
  // reserved to this exact FreeSWITCH call UUID may create a conversion.
  // Ambiguous and unmatched calls never post back.
  const uniqueIntentMatch =
    event.attribution_status === "candidate" &&
    event.attribution_method === "single_number_unique_intent_window";
  if (!uniqueIntentMatch || !event.clickflare_click_id) {
    return { sent: false, status: "unattributed" };
  }
  if (env.CLICKFLARE_POSTBACK_ENABLED !== "true") return { sent: false, status: "disabled" };

  await env.DB.prepare(
    "INSERT INTO clickflare_conversions (conversion_id,call_uuid,clickflare_click_id,payout,conversion_type,status) VALUES (?,?,?,?,?,'pending') ON CONFLICT(call_uuid) DO NOTHING",
  ).bind(crypto.randomUUID(), event.call_uuid, event.clickflare_click_id, CALL_PAYOUT_USD, CLICKFLARE_CONVERSION_TYPE).run();

  const prior = await env.DB.prepare(
    "SELECT status,attempt_count,next_retry_at FROM clickflare_conversions WHERE call_uuid=?",
  ).bind(event.call_uuid) .first<{ status: string; attempt_count: number; next_retry_at: string | null }>();
  if (prior?.status === "sent") return { sent: false, status: "already_sent" };
  if (prior?.status === "rejected") return { sent: false, status: "rejected" };
  if (prior?.status === "failed" && prior.next_retry_at && Date.parse(prior.next_retry_at) > Date.now()) return { sent: false, status: "failed" };
  const attempt = Number(prior?.attempt_count || 0) + 1;
  if (attempt > MAX_POSTBACK_ATTEMPTS) return { sent: false, status: "failed" };

  const endpoint = new URL(CLICKFLARE_POSTBACK_URL);
  endpoint.search = new URLSearchParams({
    click_id: event.clickflare_click_id,
    payout: CALL_PAYOUT_USD,
    txid: event.call_uuid,
    ct: CLICKFLARE_CONVERSION_TYPE,
  }).toString();
  const attemptedAt = new Date().toISOString();
  const persist = async (status: "sent" | "failed" | "rejected", httpStatus: number | null, error: string | null) => {
    const retryAt = status === "failed" && attempt < MAX_POSTBACK_ATTEMPTS
      ? new Date(Date.now() + POSTBACK_RETRY_BASE_MS * 2 ** (attempt - 1)).toISOString()
      : null;
    await env.DB.prepare(
      "UPDATE clickflare_conversions SET status=?,attempt_count=?,last_http_status=?,last_error=?,next_retry_at=?,sent_at=CASE WHEN ?='sent' THEN ? ELSE sent_at END WHERE call_uuid=?",
    ).bind(status, attempt, httpStatus, error, retryAt, status, attemptedAt, event.call_uuid).run();
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
      retryable ? `ClickFlare HTTP ${response.status}` : `ClickFlare rejected postback (HTTP ${response.status})`,
    );
    return { sent: false, status: retryable ? "failed" : "rejected" };
  } catch {
    await persist("failed", null, "ClickFlare request failed before an HTTP response");
    return { sent: false, status: "failed" };
  }
}

async function retryFailedClickFlarePostbacks(env: CallTrackerEnv) {
  if (env.CLICKFLARE_POSTBACK_ENABLED !== "true") return { checked: 0, sent: 0, failed: 0 };
  const due = await env.DB.prepare(
    "SELECT c.call_uuid,c.clickflare_click_id,r.attribution_status,r.attribution_method FROM clickflare_conversions c JOIN call_ringing_events r USING(call_uuid) WHERE c.status='failed' AND r.attribution_status='candidate' AND r.attribution_method='single_number_unique_intent_window' AND c.next_retry_at IS NOT NULL AND c.next_retry_at<=? AND c.attempt_count<? ORDER BY c.next_retry_at ASC LIMIT 25",
  ).bind(new Date().toISOString(), MAX_POSTBACK_ATTEMPTS).all<{
    call_uuid: string; clickflare_click_id: string; attribution_status: string; attribution_method: string | null;
  }>();
  let sent = 0;
  let failed = 0;
  for (const event of due.results || []) {
    const result = await sendClickFlarePostback(env, event);
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
    // TrafficStars delivery is delegated through ClickFlare's configured source postback.
    // Never send a second, direct TrafficStars callback from this Worker.
    context.waitUntil(retryFailedClickFlarePostbacks(env));
  },
  async fetch(request: Request, env: CallTrackerEnv): Promise<Response> {
    const url = new URL(request.url);

    // Telxio webhook deliveries are diagnostic-only. The tokenized route is authenticated;
    // the base route remains rate-limited and explicitly unverified for provider compatibility.
    const telxioBasePath = "/webhook/telxio";
    const telxioPrefix = `${telxioBasePath}/`;
    const isTelxioBaseDelivery = url.pathname === telxioBasePath;
    const isTelxioTokenDelivery = url.pathname.startsWith(telxioPrefix);
    if ((request.method === "POST" || request.method === "GET") && (isTelxioBaseDelivery || isTelxioTokenDelivery)) {
      if (isTelxioTokenDelivery) {
        const suppliedToken = url.pathname.slice(telxioPrefix.length);
        const expectedToken = env.TELXIO_WEBHOOK_TOKEN || "";
        const supplied = new TextEncoder().encode(suppliedToken);
        const expected = new TextEncoder().encode(expectedToken);
        let difference = supplied.length ^ expected.length;
        const length = Math.max(supplied.length, expected.length);
        for (let index = 0; index < length; index += 1) {
          difference |= (supplied[index] || 0) ^ (expected[index] || 0);
        }
        if (!expectedToken || difference !== 0) return json({ error: "unauthorized" }, 401);
      }

      let raw = "";
      let payload: Record<string, unknown>;
      if (request.method === "GET") {
        raw = url.searchParams.toString();
        payload = Object.fromEntries(url.searchParams.entries());
      } else {
        const contentType = (request.headers.get("content-type") || "").toLowerCase();
        const formRequest = contentType.includes("multipart/form-data") ? request.clone() : null;
        raw = await request.text();
        if (raw.length > 32768) return json({ error: "payload_too_large" }, 413);
        try {
          if (contentType.includes("application/x-www-form-urlencoded")) {
            payload = Object.fromEntries(new URLSearchParams(raw).entries());
          } else if (formRequest) {
            const form = await formRequest.formData();
            payload = Object.fromEntries(Array.from(form.entries()).map(([key, value]) => [key, typeof value === "string" ? value : value.name]));
          } else {
            const parsed: unknown = JSON.parse(raw);
            if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return json({ error: "invalid_payload" }, 400);
            payload = parsed as Record<string, unknown>;
          }
        } catch {
          return json({ error: "invalid_payload" }, 400);
        }
      }
      if (raw.length > 32768) return json({ error: "payload_too_large" }, 413);
      const pick = (...values: unknown[]) => {
        const found = values.find(value => typeof value === "string" || typeof value === "number");
        return found === undefined ? null : String(found).slice(0, 200);
      };
      const eventRoot = payload.data && typeof payload.data === "object" ? payload.data as Record<string, unknown> : payload;
      const eventFields = eventRoot.payload && typeof eventRoot.payload === "object" ? eventRoot.payload as Record<string, unknown> : eventRoot;
      const eventType = pick(payload.event_type, payload.eventType, payload.event, payload.type, payload.status, payload.EventType,
        eventRoot.event_type, eventRoot.eventType, eventRoot.EventType, eventFields.event_type, eventFields.eventType, eventFields.EventType,
        request.headers.get("x-telxio-event-type")) || "unknown";
      const providerCallId = pick(payload.call_id, payload.callId, payload.call_uuid, payload.uuid, payload.uniqueid, payload.unique_id, payload.callid, payload.CallUUID,
        eventRoot.call_id, eventRoot.callId, eventRoot.call_uuid, eventRoot.uuid, eventRoot.uniqueid, eventRoot.unique_id, eventRoot.callid, eventRoot.CallUUID, eventRoot.id,
        eventFields.call_id, eventFields.callId, eventFields.call_uuid, eventFields.uuid, eventFields.uniqueid, eventFields.unique_id, eventFields.callid, eventFields.CallUUID,
        eventFields.call_control_id, eventFields.call_leg_id);
      const caller = pick(payload.caller_number, payload.caller, payload.from, payload.ani, payload.phone_number, payload.callerid, payload.caller_id_number, payload.CallerID,
        eventRoot.from, eventFields.from, eventFields.caller_number, eventFields.caller);
      const called = pick(payload.called_number, payload.destination, payload.to, payload.did, payload.dnis, payload.called, payload.DID,
        eventRoot.to, eventFields.to, eventFields.called_number, eventFields.destination, eventFields.did, eventFields.dnis);
      const eventTime = pick(payload.event_at, payload.timestamp, payload.created_at, payload.time, payload.datetime, payload.CallStart,
        eventRoot.occurred_at, eventRoot.created_at, eventFields.occurred_at, eventFields.created_at, eventFields.CallStart);
      const providerEventIdRaw = pick(payload.event_id, payload.eventId, payload.webhook_id, payload.EventID,
        eventRoot.event_id, eventRoot.eventId, eventRoot.id, eventFields.event_id, eventFields.eventId, eventFields.id);
      if (isTelxioBaseDelivery && !providerCallId && eventType === "unknown" && !called) return json({ error: "unrecognized_event" }, 400);
      const callerHash = caller
        ? Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(caller))))
            .map(byte => byte.toString(16).padStart(2, "0")).join("")
        : null;
      const payloadHash = Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(raw))))
        .map(byte => byte.toString(16).padStart(2, "0")).join("");
      let sourceIpPrefix = "";
      if (isTelxioBaseDelivery) {
        const sourceIp = request.headers.get("CF-Connecting-IP") || "unknown";
        const sourceIpHash = Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(sourceIp))))
          .map(byte => byte.toString(16).padStart(2, "0")).join("");
        sourceIpPrefix = `unverified:${sourceIpHash}:`;
        const cutoff = new Date(Date.now() - 60 * 1000).toISOString();
        const recent = await env.DB.prepare(
          "SELECT COUNT(*) AS request_count FROM telxio_webhook_events WHERE substr(provider_event_id,1,?)=? AND received_at>=?",
        ).bind(sourceIpPrefix.length, sourceIpPrefix, cutoff).first<{ request_count: number }>();
        if (Number(recent?.request_count || 0) >= 30) return json({ error: "rate_limited" }, 429);
      }
      const providerEventId = sourceIpPrefix + (providerEventIdRaw || payloadHash);
      await env.DB.prepare(
        "INSERT INTO telxio_webhook_events (provider_event_id,event_type,provider_call_id,caller_number_hash,called_number,event_at,received_at,payload_sha256) VALUES (?,?,?,?,?,?,?,?) ON CONFLICT(provider_event_id) DO NOTHING",
      ).bind(providerEventId, eventType, providerCallId, callerHash, called, eventTime, new Date().toISOString(), payloadHash).run();
      return json({ ok: true, accepted: true, duplicate_safe: true, conversion_created: false }, 202);
    }

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
      const clickFlareId = getClickFlareId(url.searchParams);
      await env.DB.prepare(
        "INSERT INTO traffic_clicks (click_id,campaign_id,creative_id,site_id,country_code,landing_path,clicked_at,expires_at,clickflare_click_id) VALUES (?,?,?,?,?,?,?,?,?) ON CONFLICT(click_id) DO UPDATE SET clicked_at=excluded.clicked_at,expires_at=excluded.expires_at,clickflare_click_id=COALESCE(excluded.clickflare_click_id,traffic_clicks.clickflare_click_id)",
      )
        .bind(
          id, CAMPAIGN_ID, url.searchParams.get("banner_id"), "ticketdepart.com",
          url.searchParams.get("country"), url.searchParams.get("path") || "/",
          now.toISOString(), expires.toISOString(), clickFlareId,
        )
        .run();

      return json({
        ok: true,
        click_id: id,
        expires_at: expires.toISOString(),
      });
    }

    if (request.method === "POST" && url.pathname === "/dni/assign") {
      return json({
        error: "dynamic_number_assignment_disabled",
        public_number: "+1-888-564-9049",
      }, 410);
    }
    if (request.method === "POST" && url.pathname === "/intent") {
      let body: Record<string, unknown>;
      try {
        body = JSON.parse(await request.text());
      } catch {
        return json({ error: "invalid_json" }, 400);
      }

      const clickId = String(body.click_id || "").trim();
      const clickFlareId = readClickFlareId(body.clickflare_click_id);
      const intentId = String(body.intent_id || "").trim();
      if (
        !/^[A-Za-z0-9._~-]{1,200}$/.test(clickId) ||
        !/^[A-Za-z0-9._:-]{8,128}$/.test(intentId)
      ) {
        return json({ error: "invalid_identifiers" }, 400);
      }

      const now = new Date();
      const nowIso = now.toISOString();
      if (!clickFlareId) {
        return json({ error: "missing_or_invalid_clickflare_click_id" }, 422);
      }

      const existingClick = await env.DB.prepare(
        "SELECT click_id, expires_at, clickflare_click_id FROM traffic_clicks WHERE click_id=?",
      )
        .bind(clickId)
        .first<{ click_id: string; expires_at: string; clickflare_click_id: string | null }>();

      let clickRegistered = false;
      if (existingClick) {
        if (
          !validTime(existingClick.expires_at) ||
          Date.parse(existingClick.expires_at) < now.getTime()
        ) {
          return json({ error: "unknown_or_expired_click_id" }, 404);
        }
        if (existingClick.clickflare_click_id && existingClick.clickflare_click_id !== clickFlareId) {
          return json({ error: "click_attribution_pair_mismatch" }, 409);
        }
        if (!existingClick.clickflare_click_id) {
          await env.DB.prepare("UPDATE traffic_clicks SET clickflare_click_id=? WHERE click_id=? AND (clickflare_click_id IS NULL OR clickflare_click_id='')")
            .bind(clickFlareId, clickId).run();
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
          "INSERT INTO traffic_clicks (click_id,campaign_id,creative_id,site_id,country_code,landing_path,clicked_at,expires_at,clickflare_click_id) VALUES (?,?,?,?,?,?,?,?,?) ON CONFLICT(click_id) DO NOTHING",
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
            clickFlareId,
          )
          .run();
        clickRegistered = true;
      }

      // Re-read after insert/update to protect against concurrent registration
      // of the same TrafficStars click ID with a different ClickFlare ID.
      const persistedClick = await env.DB.prepare(
        "SELECT clickflare_click_id FROM traffic_clicks WHERE click_id=?",
      ).bind(clickId).first<{ clickflare_click_id: string | null }>();
      if (persistedClick?.clickflare_click_id !== clickFlareId) {
        return json({ error: "click_attribution_pair_mismatch" }, 409);
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
          !isTicketDepartPublicDid(call.destination) ||
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
          destination: canonicalTicketDepartPublicDid(String(row.destination)),
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
      const suppliedDestination = String(body.destination || "");
      const destination = canonicalTicketDepartPublicDid(suppliedDestination);
      const agentExtension = String(body.agent_extension || "");
      const ringingAt = body.ringing_at;

      if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(callUuid)) {
        return json({ error: "invalid_call_uuid" }, 400);
      }
      if (!isTicketDepartPublicDid(suppliedDestination) || agentExtension !== "1001") {
        return json({ error: "invalid_call_route" }, 400);
      }
      if (!validTime(ringingAt)) {
        return json({ error: "invalid_ringing_timestamp" }, 400);
      }

      // Store the first agent-ring event and conservatively reserve one matching click intent.
      // A time-window candidate remains diagnostic only; an ad conversion requires a verified per-call provider click reference.
      const stored = await correlateAndStoreRingingEvent(env, {
        call_uuid: callUuid,
        destination,
        agent_extension: agentExtension,
        ringing_at: ringingAt,
      });
      const createdAt = validTime(body.created_at) ? body.created_at : ringingAt;
      await env.DB.prepare(
        "INSERT INTO inbound_calls (call_uuid,click_id,caller_hash,destination,agent_extension,created_at,answered_at,hangup_at,billsec,accepted,acceptance_reason,attribution_status,attribution_method,matched_intent_id,clickflare_click_id,did_assignment_id) VALUES (?,?,NULL,?,?,?,NULL,NULL,0,1,'agent_leg_ringing',?,?,?,?,?) ON CONFLICT(call_uuid) DO UPDATE SET click_id=COALESCE(excluded.click_id,inbound_calls.click_id),destination=excluded.destination,agent_extension=excluded.agent_extension,created_at=COALESCE(inbound_calls.created_at,excluded.created_at),accepted=1,acceptance_reason='agent_leg_ringing',attribution_status=excluded.attribution_status,attribution_method=excluded.attribution_method,matched_intent_id=COALESCE(excluded.matched_intent_id,inbound_calls.matched_intent_id),clickflare_click_id=COALESCE(excluded.clickflare_click_id,inbound_calls.clickflare_click_id),did_assignment_id=COALESCE(excluded.did_assignment_id,inbound_calls.did_assignment_id)",
      ).bind(
        callUuid, stored?.click_id || null, destination, agentExtension, createdAt,
        stored?.attribution_status || "unmatched", stored?.attribution_method || "no_recent_click_to_call_intent",
        stored?.matched_intent_id || null, stored?.clickflare_click_id || null, stored?.did_assignment_id || null,
      ).run();

      // Ringing is the billable milestone. Conversion delivery is deferred
      // until this same call UUID is answered.
      return json({
        ok: true,
        conversion_event: "call_ringing",
        goal_id: GOAL_ID,
        call_uuid: callUuid,
        recorded: Boolean(stored?.call_uuid),
        duplicate: Boolean(stored?.duplicate),
        click_id: stored?.click_id || null,
        clickflare_click_id: stored?.clickflare_click_id || null,
        attribution: stored?.attribution_status || "unmatched",
        attribution_method: stored?.attribution_method || null,
        postback_sent: false,
        postback_status: "deferred_until_answered",
        clickflare_postback_sent: false,
        clickflare_postback_status: "deferred_until_answered",
      }, 202);
    }

    if (request.method === "POST" && url.pathname === "/v1/calls/answered") {
      if (!(await auth(request, env.CALL_INGEST_SECRET))) {
        return json({ error: "unauthorized" }, 401);
      }
      const raw = await request.text();
      if (raw.length > 8192) return json({ error: "payload_too_large" }, 413);
      let body: Record<string, unknown>;
      try { body = JSON.parse(raw); } catch { return json({ error: "invalid_json" }, 400); }
      const callUuid = String(body.call_uuid || "");
      const destination = String(body.destination || "");
      const agentExtension = String(body.agent_extension || "");
      const createdAt = body.created_at;
      const answeredAt = body.answered_at;
      if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(callUuid)) {
        return json({ error: "invalid_call_uuid" }, 400);
      }
      if (!isTicketDepartPublicDid(destination) || agentExtension !== "1001") {
        return json({ error: "invalid_call_route" }, 400);
      }
      if (!validTime(createdAt) || !validTime(answeredAt) || Date.parse(String(answeredAt)) < Date.parse(String(createdAt))) {
        return json({ error: "invalid_answer_timestamp" }, 400);
      }
      const existing = await env.DB.prepare(
        "SELECT accepted,acceptance_reason,attribution_status FROM inbound_calls WHERE call_uuid=?",
      ).bind(callUuid).first<{ accepted: number; acceptance_reason: string | null; attribution_status: string }>();
      if (!existing) return json({ error: "agent_ring_not_recorded", billable: false }, 409);
      await env.DB.prepare(
        "UPDATE inbound_calls SET answered_at=COALESCE(answered_at,?) WHERE call_uuid=?",
      ).bind(answeredAt, callUuid).run();

      const ringEvent = await env.DB.prepare(
        "SELECT call_uuid,clickflare_click_id,attribution_status,attribution_method,matched_intent_id FROM call_ringing_events WHERE call_uuid=?",
      ).bind(callUuid).first<{
        call_uuid: string;
        clickflare_click_id: string | null;
        attribution_status: string;
        attribution_method: string | null;
        matched_intent_id: string | null;
      }>();
      const clickflarePostback = ringEvent
        ? await sendClickFlarePostback(env, ringEvent)
        : { sent: false, status: "unattributed" as const };
      const conversionDelivered = clickflarePostback.sent || clickflarePostback.status === "already_sent";
      if (conversionDelivered && ringEvent?.matched_intent_id) {
        await env.DB.prepare(
          "UPDATE call_intents SET status='converted' WHERE intent_id=? AND matched_call_uuid=?",
        ).bind(ringEvent.matched_intent_id, callUuid).run();
      }
      return json({
        ok: true,
        event_type: "agent_answered",
        conversion_stage: "answered",
        billable: existing.accepted === 1,
        billable_reason: existing.acceptance_reason,
        call_uuid: callUuid,
        attribution: ringEvent?.attribution_status || existing.attribution_status || "unmatched",
        attribution_method: ringEvent?.attribution_method || null,
        clickflare_postback_sent: clickflarePostback.sent,
        clickflare_postback_status: clickflarePostback.status,
        trafficstars_postback_status: conversionDelivered ? "delegated_to_clickflare_source_postback" : clickflarePostback.status,
        advertiser_conversion_created: conversionDelivered,
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
