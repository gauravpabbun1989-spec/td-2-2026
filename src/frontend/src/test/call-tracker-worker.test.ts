import { describe, expect, it, vi } from "vitest";
import worker, { type CallTrackerEnv } from "../../call-tracker-worker/worker";

type ClickRow = { click_id: string; expires_at: string; clickflare_click_id?: string | null };
type IntentRow = {
  intent_id: string; click_id: string; created_at: string; page_path?: string;
  cta_location?: string; status: string; matched_call_uuid?: string | null;
};
type CallRow = Record<string, unknown>;

class FakeD1 {
  clicks = new Map<string, ClickRow>();
  intents = new Map<string, IntentRow>();
  calls = new Map<string, CallRow>();
  ringingEvents = new Map<string, CallRow>();
  trackingDids = new Set<string>();
  didAssignments = new Map<string, CallRow>();
  clickflareConversions = new Map<string, CallRow>();
  statements: string[] = [];

  prepare(sql: string) {
    const db = this;
    let values: unknown[] = [];
    const statement = {
      sql,
      get values() { return values; },
      bind(...args: unknown[]) { values = args; return statement; },
      async first<T>() {
        db.statements.push(sql);
        if (sql.startsWith("SELECT click_id,expires_at,clickflare_click_id FROM traffic_clicks") || sql.startsWith("SELECT click_id, expires_at, clickflare_click_id FROM traffic_clicks")) {
          return (db.clicks.get(String(values[0])) || null) as T | null;
        }
        if (sql.startsWith("SELECT click_id, expires_at FROM traffic_clicks")) {
          return (db.clicks.get(String(values[0])) || null) as T | null;
        }
        if (sql.startsWith("SELECT did FROM tracking_dids WHERE did=?")) {
          const did = String(values[0]);
          return (db.trackingDids.has(did) ? { did } : null) as T | null;
        }
        if (sql.startsWith("SELECT assignment_id,did,expires_at FROM did_assignments WHERE trafficstars_click_id")) {
          const row = [...db.didAssignments.values()].find((item) => item.trafficstars_click_id === values[0] && item.clickflare_click_id === values[1] && item.status === "active" && String(item.expires_at) > String(values[2]));
          return (row || null) as T | null;
        }
        if (sql.startsWith("SELECT d.did FROM tracking_dids d")) {
          const did = [...db.trackingDids].find((candidate) => ![...db.didAssignments.values()].some((item) => item.did === candidate && item.status === "active"));
          return (did ? { did } : null) as T | null;
        }
        if (sql.startsWith("SELECT assignment_id,trafficstars_click_id,clickflare_click_id FROM did_assignments WHERE did=?")) {
          const row = [...db.didAssignments.values()].find((item) => item.did === values[0] && item.status === "active" && String(item.assigned_at) <= String(values[1]) && String(item.expires_at) >= String(values[2]));
          return (row || null) as T | null;
        }
        if (sql.startsWith("SELECT postback_status,postback_attempt_count,postback_next_retry_at FROM call_ringing_events")) {
          const row = db.ringingEvents.get(String(values[0]));
          return row ? ({ postback_status: row.postback_status, postback_attempt_count: row.postback_attempt_count || 0, postback_next_retry_at: row.postback_next_retry_at || null } as T) : null;
        }
        if (sql.startsWith("SELECT status,attempt_count,next_retry_at FROM clickflare_conversions")) {
          return (db.clickflareConversions.get(String(values[0])) || null) as T | null;
        }
        if (sql.startsWith("SELECT call_uuid FROM call_ringing_events WHERE ringing_at>=")) {
          const [from, through, exceptUuid] = values;
          const row = [...db.ringingEvents.values()].find((item) =>
            String(item.ringing_at) >= String(from) &&
            String(item.ringing_at) < String(through) &&
            String(item.call_uuid) !== String(exceptUuid)
          );
          return (row ? { call_uuid: row.call_uuid } : null) as T | null;
        }
        if (sql.startsWith("SELECT call_uuid FROM call_ringing_events")) {
          return (db.ringingEvents.get(String(values[0])) || null) as T | null;
        }
        if (sql.startsWith("SELECT intent_id,click_id,status,matched_call_uuid FROM call_intents WHERE intent_id=?")) {
          const row = db.intents.get(String(values[0]));
          return (row || null) as T | null;
        }
        if (sql.startsWith("SELECT call_uuid,click_id,clickflare_click_id,did_assignment_id,attribution_status,attribution_method,matched_intent_id FROM call_ringing_events")) {
          return (db.ringingEvents.get(String(values[0])) || null) as T | null;
        }
        if (sql.startsWith("SELECT call_uuid,click_id,attribution_status,attribution_method,matched_intent_id FROM call_ringing_events")) {
          return (db.ringingEvents.get(String(values[0])) || null) as T | null;
        }
        if (sql.startsWith("SELECT click_id, attribution_status FROM inbound_calls")) {
          const row = db.calls.get(String(values[0]));
          return row ? ({ click_id: row.click_id, attribution_status: row.attribution_status } as T) : null;
        }
        if (sql.startsWith("SELECT attribution_status FROM inbound_calls")) {
          const row = db.calls.get(String(values[0]));
          return row ? ({ attribution_status: row.attribution_status } as T) : null;
        }
        return null;
      },
      async all<T>() {
        db.statements.push(sql);
        if (sql.startsWith("SELECT call_uuid,click_id,attribution_status,attribution_method FROM call_ringing_events WHERE postback_status='failed'")) {
          const [now, maxAttempts] = values;
          const rows = [...db.ringingEvents.values()].filter((row) => row.postback_status === "failed" && typeof row.postback_next_retry_at === "string" && row.postback_next_retry_at <= String(now) && Number(row.postback_attempt_count || 0) < Number(maxAttempts));
          return { results: rows as T[] };
        }
        if (sql.startsWith("SELECT i.intent_id,i.click_id,i.created_at,t.clickflare_click_id FROM call_intents")) {
          const [from, through] = values;
          const rows = [...db.intents.values()]
            .filter((row) => row.status === "open" && !row.matched_call_uuid && row.created_at >= String(from) && row.created_at <= String(through))
            .map((row) => ({ ...row, clickflare_click_id: db.clicks.get(row.click_id)?.clickflare_click_id }))
            .filter((row) => Boolean(row.clickflare_click_id))
            .sort((a, b) => b.created_at.localeCompare(a.created_at))
            .slice(0, 2);
          return { results: rows as T[] };
        }
        if (sql.startsWith("SELECT intent_id,click_id,created_at FROM call_intents")) {
          const [from, through, limit] = values;
          const rows = [...db.intents.values()]
            .filter((row) => row.status === "open" && row.created_at >= String(from) && row.created_at <= String(through))
            .sort((a, b) => a.created_at.localeCompare(b.created_at))
            .slice(0, Number(limit));
          return { results: rows as T[] };
        }
        return { results: [] as T[] };
      },
      async run() {
        db.statements.push(sql);
        if (sql.startsWith("INSERT INTO traffic_clicks")) {
          const [clickId, , , , , , , expiresAt, clickFlareId] = values;
          const id = String(clickId);
          const existing = db.clicks.get(id);
          if (existing) {
            existing.expires_at = String(expiresAt);
            if (clickFlareId) existing.clickflare_click_id = String(clickFlareId);
          } else {
            db.clicks.set(id, { click_id: id, expires_at: String(expiresAt), clickflare_click_id: clickFlareId ? String(clickFlareId) : null });
          }
        } else if (sql.startsWith("UPDATE traffic_clicks SET clickflare_click_id")) {
          const [clickFlareId, clickId] = values;
          const row = db.clicks.get(String(clickId));
          if (row) row.clickflare_click_id = String(clickFlareId);
        } else if (sql.startsWith("UPDATE call_intents SET status='candidate'")) {
          const [callUuid, intentId] = values;
          const row = db.intents.get(String(intentId));
          if (row?.status === "open" && !row.matched_call_uuid) {
            row.status = "candidate";
            row.matched_call_uuid = String(callUuid);
          }
        } else if (sql.startsWith("UPDATE did_assignments SET status='expired'")) {
          const now = String(values[0]);
          for (const row of db.didAssignments.values()) if (row.status === "active" && String(row.expires_at) <= now) row.status = "expired";
        } else if (sql.startsWith("INSERT INTO clickflare_conversions")) {
          const [conversionId, callUuid, clickFlareId, payout, conversionType] = values;
          if (!db.clickflareConversions.has(String(callUuid))) {
            db.clickflareConversions.set(String(callUuid), {
              conversion_id: conversionId, call_uuid: callUuid, clickflare_click_id: clickFlareId,
              payout, conversion_type: conversionType, status: "pending", attempt_count: 0,
            });
          }
        } else if (sql.startsWith("UPDATE clickflare_conversions SET")) {
          const [status, attempts, httpStatus, error, retryAt, sentState, sentAt, callUuid] = values;
          const row = db.clickflareConversions.get(String(callUuid));
          if (row) Object.assign(row, {
            status, attempt_count: attempts, last_http_status: httpStatus,
            last_error: error, next_retry_at: retryAt,
            sent_at: sentState === "sent" ? sentAt : row.sent_at,
          });
        } else if (sql.startsWith("INSERT INTO did_assignments")) {
          const [assignmentId, did, trafficstarsClickId, clickflareClickId, assignedAt, expiresAt] = values;
          db.didAssignments.set(String(assignmentId), { assignment_id: assignmentId, did, trafficstars_click_id: trafficstarsClickId, clickflare_click_id: clickflareClickId, assigned_at: assignedAt, expires_at: expiresAt, status: "active" });
        } else if (sql.startsWith("INSERT INTO call_ringing_events")) {
          const [uuid, destination, agent, ringingAt, goalId, clickId, attributionStatus, attributionMethod, intentId, clickFlareId, assignmentId] = values;
          if (!db.ringingEvents.has(String(uuid))) db.ringingEvents.set(String(uuid), {
            call_uuid: uuid, destination, agent_extension: agent, ringing_at: ringingAt,
            goal_id: goalId, event_type: "call_ringing", click_id: clickId || null,
            attribution_status: attributionStatus || "unmatched",
            attribution_method: attributionMethod || "no_active_did_assignment",
            matched_intent_id: intentId || null, clickflare_click_id: clickFlareId || null,
            did_assignment_id: assignmentId || null,
          });
        } else if (sql.startsWith("UPDATE call_ringing_events SET postback_status=")) {
          const [status, attempts, attemptedAt, httpStatus, retryAt, lastError, uuid] = values;
          const row = db.ringingEvents.get(String(uuid));
          if (row) Object.assign(row, { postback_status: status, postback_attempt_count: attempts, postback_attempted_at: attemptedAt, postback_http_status: httpStatus, postback_next_retry_at: retryAt, postback_last_error: lastError });
        } else if (sql.startsWith("INSERT INTO call_intents")) {
          const [intentId, clickId, createdAt, pagePath, ctaLocation] = values;
          if (!db.intents.has(String(intentId))) db.intents.set(String(intentId), {
            intent_id: String(intentId), click_id: String(clickId), created_at: String(createdAt),
            page_path: String(pagePath), cta_location: String(ctaLocation), status: "open",
          });
        } else if (sql.startsWith("INSERT INTO inbound_calls") && sql.includes("'agent_leg_ringing'")) {
          const [uuid, clickId, destination, agent, created, attributionStatus, attributionMethod, matchedIntentId, clickFlareId, assignmentId] = values;
          db.calls.set(String(uuid), {
            call_uuid: uuid, click_id: clickId, destination, agent_extension: agent, created_at: created,
            answered_at: null, hangup_at: null, billsec: 0, accepted: 1,
            acceptance_reason: "agent_leg_ringing", attribution_status: attributionStatus,
            attribution_method: attributionMethod, matched_intent_id: matchedIntentId,
            clickflare_click_id: clickFlareId, did_assignment_id: assignmentId,
          });
        } else if (sql.startsWith("INSERT INTO inbound_calls")) {
          const [uuid, destination, agent, created, answered, hangup, billsec] = values;
          db.calls.set(String(uuid), {
            call_uuid: uuid, click_id: null, destination, agent_extension: agent, created_at: created,
            answered_at: answered, hangup_at: hangup, billsec, attribution_status: "unmatched",
            attribution_method: null, matched_intent_id: null,
          });
        } else if (sql.startsWith("UPDATE inbound_calls SET answered_at=COALESCE")) {
          const [answeredAt, uuid] = values;
          const row = db.calls.get(String(uuid));
          if (row) row.answered_at = row.answered_at || answeredAt;
        } else if (sql.startsWith("UPDATE inbound_calls SET")) {
          const [destination, agent, created, answered, hangup, billsec, uuid] = values;
          const row = db.calls.get(String(uuid));
          if (row) Object.assign(row, { destination, agent_extension: agent, created_at: created, answered_at: answered, hangup_at: hangup, billsec });
        }
        return { success: true };
      },
    };
    return statement;
  }

  async batch(statements: Array<{ sql: string; values: unknown[] }>) {
    for (const { sql, values } of statements) {
      this.statements.push(sql);
      if (sql.startsWith("UPDATE call_intents SET status='candidate'")) {
        const [callUuid, intentId] = values;
        const row = this.intents.get(String(intentId));
        if (row?.status === "open" && !row.matched_call_uuid) {
          row.status = "candidate";
          row.matched_call_uuid = String(callUuid);
        }
      } else if (sql.startsWith("UPDATE call_intents SET status='ambiguous'")) {
        const [from, through] = values;
        for (const row of this.intents.values()) {
          if (row.status === "open" && row.created_at >= String(from) && row.created_at <= String(through)) row.status = "ambiguous";
        }
      } else if (sql.startsWith("INSERT INTO call_ringing_events")) {
        const [uuid, destination, agent, ringingAt, goalId, intentId, matchedUuid] = values;
        if (sql.includes("SELECT ?,?,?,?,?")) {
          const intent = this.intents.get(String(intentId));
          const reserved = intent?.status === "candidate" && intent.matched_call_uuid === String(matchedUuid);
          this.ringingEvents.set(String(uuid), {
            call_uuid: uuid, destination, agent_extension: agent, ringing_at: ringingAt,
            goal_id: goalId, event_type: "call_ringing",
            click_id: reserved ? intent?.click_id : null,
            attribution_status: reserved ? "candidate" : "unmatched",
            attribution_method: reserved ? "unique_intent_time_window" : "intent_reservation_lost",
            matched_intent_id: reserved ? intentId : null,
          });
        } else {
          this.ringingEvents.set(String(uuid), {
            call_uuid: uuid, destination, agent_extension: agent, ringing_at: ringingAt,
            goal_id: goalId, event_type: "call_ringing", click_id: null,
            attribution_status: "ambiguous",
            attribution_method: "time_window_multiple_clicks", matched_intent_id: null,
          });
        }
      } else if (sql.startsWith("INSERT INTO inbound_calls")) {
        const callUuid = String(values[0]);
        if (sql.includes("SELECT ?,matched.click_id")) {
          const [uuid, destination, agent, created, answered, hangup, billsec, intentId, matchedUuid] = values;
          const intent = this.intents.get(String(intentId));
          const reserved = intent?.status === "candidate" && intent.matched_call_uuid === String(matchedUuid);
          this.calls.set(String(uuid), {
            call_uuid: uuid, click_id: reserved ? intent?.click_id : null, destination,
            agent_extension: agent, created_at: created, answered_at: answered, hangup_at: hangup,
            billsec, attribution_status: reserved ? "candidate" : "unmatched",
            attribution_method: reserved ? "unique_intent_time_window" : null,
            matched_intent_id: reserved ? intentId : null,
          });
        } else {
          const [, destination, agent, created, answered, hangup, billsec] = values;
          this.calls.set(callUuid, {
            call_uuid: callUuid, click_id: null, destination, agent_extension: agent,
            created_at: created, answered_at: answered, hangup_at: hangup, billsec,
            attribution_status: "ambiguous", attribution_method: "time_window_multiple_clicks",
            matched_intent_id: null,
          });
        }
      }
    }
    return [];
  }
}

function makeEnv(db: FakeD1): CallTrackerEnv {
  return { DB: db as unknown as CallTrackerEnv["DB"] };
}

const callUuid = "a4fc0bfd-0aac-42c3-a7b7-139323d45675";
const callAt = "2026-11-21T16:42:15.000Z";
function callBody(uuid = callUuid) {
  return {
    call_uuid: uuid, destination: "+1-888-564-9049", agent_extension: "1001",
    created_at: callAt, answered_at: callAt, hangup_at: "2026-11-21T16:42:30.000Z", billsec: 15,
  };
}
async function ingest(db: FakeD1, calls: unknown[]) {
  return worker.fetch(new Request("https://tracker.example/v1/calls/ingest", {
    method: "POST", headers: { authorization: "Bearer test-secret", "content-type": "application/json" },
    body: JSON.stringify({ calls }),
  }), { DB: db as unknown as CallTrackerEnv["DB"], CALL_INGEST_SECRET: "test-secret" });
}

describe("call-tracker /click paired identifier registration", () => {
  it("stores the TrafficStars click ID and ClickFlare visit ID on the same click row", async () => {
    const db = new FakeD1();
    const response = await worker.fetch(new Request(
      "https://tracker.example/click?click_id=traffic-click-pair&cf_click_id=cf-click-pair&path=%2Fflight-change",
    ), makeEnv(db));

    expect(response.status).toBe(200);
    expect(db.clicks.get("traffic-click-pair")).toMatchObject({
      click_id: "traffic-click-pair",
      clickflare_click_id: "cf-click-pair",
    });
  });

  it("adds the ClickFlare ID when it arrives after the initial TrafficStars click registration", async () => {
    const db = new FakeD1();
    const register = (query: string) => worker.fetch(
      new Request(`https://tracker.example/click?${query}`),
      makeEnv(db),
    );

    expect((await register("click_id=traffic-click-late")).status).toBe(200);
    expect(db.clicks.get("traffic-click-late")?.clickflare_click_id).toBeNull();

    expect((await register("click_id=traffic-click-late&cf_click_id=cf-click-late")).status).toBe(200);
    expect(db.clicks.get("traffic-click-late")).toMatchObject({
      click_id: "traffic-click-late",
      clickflare_click_id: "cf-click-late",
    });
  });
});

describe("call-tracker /intent click registration", () => {
  it("registers a missing click ID before storing its phone intent", async () => {
    const db = new FakeD1();
    const clickedAt = new Date().toISOString();
    const response = await worker.fetch(new Request("https://tracker.example/intent", {
      method: "POST", headers: { "content-type": "text/plain" },
      body: JSON.stringify({
        intent_id: "intent-12345678", click_id: "traffic-click-123", clickflare_click_id: "cf-click-123", clicked_at: clickedAt,
        landing_path: "/flights-from-new-york", page_path: "/flight-change",
        cta_location: "header", banner_id: "8369514",
      }),
    }), makeEnv(db));
    expect(response.status).toBe(202);
    expect(await response.json()).toMatchObject({ ok: true, click_registered: true, intent_recorded: true, attribution: "intent_only", conversions_created: 0 });
    expect(db.clicks.get("traffic-click-123")).toMatchObject({ clickflare_click_id: "cf-click-123" });
    expect(db.intents.get("intent-12345678")).toMatchObject({ click_id: "traffic-click-123", page_path: "/flight-change", cta_location: "header" });
  });

  it("preserves an existing active click record instead of overwriting its timestamp", async () => {
    const db = new FakeD1();
    db.clicks.set("traffic-click-123", { click_id: "traffic-click-123", expires_at: new Date(Date.now() + 60_000).toISOString() });
    const response = await worker.fetch(new Request("https://tracker.example/intent", {
      method: "POST", body: JSON.stringify({ intent_id: "intent-87654321", click_id: "traffic-click-123", page_path: "/flight-change", cta_location: "footer" }),
    }), makeEnv(db));
    expect(response.status).toBe(202);
    expect((await response.json()).click_registered).toBe(false);
    expect(db.intents.has("intent-87654321")).toBe(true);
    expect(db.statements.filter((sql) => sql.startsWith("INSERT INTO traffic_clicks"))).toHaveLength(0);
  });

  it("rejects an expired existing click and does not create an intent", async () => {
    const db = new FakeD1();
    db.clicks.set("expired-click", { click_id: "expired-click", expires_at: new Date(Date.now() - 60_000).toISOString() });
    const response = await worker.fetch(new Request("https://tracker.example/intent", {
      method: "POST", body: JSON.stringify({ intent_id: "intent-expired1", click_id: "expired-click", page_path: "/", cta_location: "hero" }),
    }), makeEnv(db));
    expect(response.status).toBe(404);
    expect(db.intents.size).toBe(0);
  });
});


describe("call-tracker FreeSWITCH ringing conversion", () => {
  it("records the first ringing event as Goal 6487 and ignores duplicate UUIDs", async () => {
    const db = new FakeD1();
    const payload = {
      call_uuid: callUuid,
      destination: "+1-888-564-9049",
      agent_extension: "1001",
      ringing_at: "2026-11-21T16:42:10.000Z",
    };
    const send = () => worker.fetch(new Request("https://tracker.example/v1/calls/ringing", {
      method: "POST",
      headers: { authorization: "Bearer test-secret", "content-type": "application/json" },
      body: JSON.stringify(payload),
    }), { DB: db as unknown as CallTrackerEnv["DB"], CALL_INGEST_SECRET: "test-secret" });

    const first = await send();
    expect(first.status).toBe(202);
    expect(await first.json()).toMatchObject({
      conversion_event: "call_ringing", goal_id: "6487", recorded: true,
      duplicate: false, postback_sent: false, attribution: "unmatched", click_id: null,
    });

    const retry = await send();
    expect(retry.status).toBe(202);
    expect(await retry.json()).toMatchObject({ recorded: true, duplicate: true });
    expect(db.ringingEvents.size).toBe(1);
    expect(db.ringingEvents.get(callUuid)).toMatchObject({
      goal_id: "6487", event_type: "call_ringing", ringing_at: payload.ringing_at,
      attribution_status: "unmatched", click_id: null,
    });
  });

  it("does not attribute a ringing call from a nearby website intent", async () => {
    const db = new FakeD1();
    db.intents.set("intent-ring-1", {
      intent_id: "intent-ring-1", click_id: "traffic-click-1",
      created_at: "2026-11-21T16:41:30.000Z", status: "open",
    });
    const response = await worker.fetch(new Request("https://tracker.example/v1/calls/ringing", {
      method: "POST",
      headers: { authorization: "Bearer test-secret", "content-type": "application/json" },
      body: JSON.stringify({
        call_uuid: callUuid, destination: "+1-888-564-9049", agent_extension: "1001",
        ringing_at: "2026-11-21T16:42:10.000Z",
      }),
    }), { DB: db as unknown as CallTrackerEnv["DB"], CALL_INGEST_SECRET: "test-secret" });
    expect(await response.json()).toMatchObject({
      click_id: null, attribution: "unmatched",
      attribution_method: "no_recent_click_to_call_intent", postback_sent: false,
    });
    expect(db.ringingEvents.get(callUuid)).toMatchObject({
      click_id: null, attribution_status: "unmatched",
      attribution_method: "no_recent_click_to_call_intent",
    });
    expect(db.intents.get("intent-ring-1")?.status).toBe("open");
  });

  it("sends a postback only for a verified signed call session and preserves TrafficStars campaign pricing", async () => {
    const db = new FakeD1();
    db.ringingEvents.set(callUuid, {
      call_uuid: callUuid,
      destination: "+1-888-564-9049",
      agent_extension: "1001",
      ringing_at: "2026-11-21T16:42:10.000Z",
      goal_id: "6487",
      click_id: "traffic-click-verified",
      attribution_status: "verified",
      attribution_method: "signed_call_session",
      matched_intent_id: "intent-signed-1",
      postback_status: "not_sent",
      postback_attempt_count: 0,
    });
    const fetchMock = vi.fn().mockResolvedValue(new Response("ok", { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
    try {
      const response = await worker.fetch(new Request("https://tracker.example/v1/calls/ringing", {
        method: "POST",
        headers: { authorization: "Bearer test-secret", "content-type": "application/json" },
        body: JSON.stringify({
          call_uuid: callUuid, destination: "+1-888-564-9049", agent_extension: "1001",
          ringing_at: "2026-11-21T16:42:10.000Z",
        }),
      }), {
        DB: db as unknown as CallTrackerEnv["DB"],
        CALL_INGEST_SECRET: "test-secret",
        TRAFFICSTARS_POSTBACK_ENABLED: "true",
        TRAFFICSTARS_POSTBACK_KEY: "test-postback-key",
      });

      expect(response.status).toBe(202);
      expect(await response.json()).toMatchObject({ attribution: "verified", attribution_method: "signed_call_session", postback_sent: true, postback_status: "sent" });
      expect(fetchMock).toHaveBeenCalledTimes(1);
      const postbackUrl = new URL(String(fetchMock.mock.calls[0][0]));
      expect(postbackUrl.origin + postbackUrl.pathname).toBe("https://tsyndicate.com/api/v2/cpa/action");
      expect(postbackUrl.searchParams.get("clickid")).toBe("traffic-click-verified");
      expect(postbackUrl.searchParams.get("goalid")).toBe("6487");
      expect(postbackUrl.searchParams.get("lead_code")).toBe(callUuid);
      expect(postbackUrl.searchParams.get("key")).toBe("test-postback-key");
      expect(postbackUrl.searchParams.has("price")).toBe(false);
      expect(postbackUrl.searchParams.has("value")).toBe(false);
      expect(db.ringingEvents.get(callUuid)).toMatchObject({ postback_status: "sent", postback_attempt_count: 1 });
    } finally {
      vi.unstubAllGlobals();
    }
  });

  it("retries due failed postbacks on the scheduled handler with the same call UUID", async () => {
    const db = new FakeD1();
    db.ringingEvents.set(callUuid, { call_uuid: callUuid, click_id: "traffic-click-retry", attribution_status: "candidate", attribution_method: "unique_intent_time_window", postback_status: "failed", postback_attempt_count: 1, postback_next_retry_at: "2020-01-01T00:00:00.000Z" });
    const fetchMock = vi.fn().mockResolvedValue(new Response("ok", { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
    let scheduledWork: Promise<unknown> | undefined;
    try {
      worker.scheduled({ scheduledTime: Date.now(), cron: "* * * * *" }, { DB: db as unknown as CallTrackerEnv["DB"], TRAFFICSTARS_POSTBACK_ENABLED: "true", TRAFFICSTARS_POSTBACK_KEY: "test-postback-key" }, { waitUntil(promise) { scheduledWork = promise; } });
      await scheduledWork;
      expect(fetchMock).not.toHaveBeenCalled();
      expect(db.ringingEvents.get(callUuid)).toMatchObject({ postback_status: "failed", postback_attempt_count: 1 });
    } finally { vi.unstubAllGlobals(); }
  });

  it("does not run scheduled postbacks while the feature flag is disabled", async () => {
    const db = new FakeD1();
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    let scheduledWork: Promise<unknown> | undefined;
    try {
      worker.scheduled({ scheduledTime: Date.now(), cron: "* * * * *" }, { DB: db as unknown as CallTrackerEnv["DB"], TRAFFICSTARS_POSTBACK_KEY: "existing-key" }, { waitUntil(promise) { scheduledWork = promise; } });
      await scheduledWork;
      expect(fetchMock).not.toHaveBeenCalled();
    } finally { vi.unstubAllGlobals(); }
  });

  it("accepts the Telxio internal SIP alias while recording the canonical public DID separately", async () => {
    const db = new FakeD1();
    const response = await worker.fetch(new Request("https://tracker.example/v1/calls/ringing", {
      method: "POST",
      headers: { authorization: "Bearer test-secret", "content-type": "application/json" },
      body: JSON.stringify({
        call_uuid: "bd5a41e2-8e85-4a0a-965a-561f4cae1bcb", destination: "1030605",
        agent_extension: "1001", ringing_at: "2026-11-21T16:42:10.000Z",
      }),
    }), { DB: db as unknown as CallTrackerEnv["DB"], CALL_INGEST_SECRET: "test-secret" });
    expect(response.status).toBe(202);
    expect(await response.json()).toMatchObject({ ok: true, goal_id: "6487", recorded: true });
  });

  it("rejects ringing events for an unexpected DID or extension", async () => {
    const db = new FakeD1();
    const response = await worker.fetch(new Request("https://tracker.example/v1/calls/ringing", {
      method: "POST",
      headers: { authorization: "Bearer test-secret", "content-type": "application/json" },
      body: JSON.stringify({
        call_uuid: callUuid, destination: "9999999", agent_extension: "1001",
        ringing_at: "2026-11-21T16:42:10.000Z",
      }),
    }), { DB: db as unknown as CallTrackerEnv["DB"], CALL_INGEST_SECRET: "test-secret" });
    expect(response.status).toBe(400);
    expect(await response.json()).toMatchObject({ error: "invalid_call_route" });
    expect(db.ringingEvents.size).toBe(0);
  });
});

describe("call-tracker fail-closed intent-to-call correlation", () => {
  it("never matches a FreeSWITCH call to a website intent using timestamps", async () => {
    const db = new FakeD1();
    db.intents.set("intent-one", { intent_id: "intent-one", click_id: "click-one", created_at: "2026-11-21T16:40:00.000Z", status: "open" });
    const response = await ingest(db, [callBody()]);
    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({ correlated_candidates: 0, ambiguous: 0, unmatched: 1, conversions_created: 0 });
    expect(db.calls.get(callUuid)).toMatchObject({ click_id: null, attribution_status: "unmatched" });
    expect(db.intents.get("intent-one")?.status).toBe("open");
  });

  it("keeps an existing call attribution decision unchanged on sync retry", async () => {
    const db = new FakeD1();
    db.calls.set(callUuid, { call_uuid: callUuid, click_id: null, attribution_status: "unmatched" });
    const response = await ingest(db, [callBody()]);
    expect(await response.json()).toMatchObject({ correlated_candidates: 0, ambiguous: 0, unmatched: 1 });
    expect(db.calls.get(callUuid)?.click_id).toBeNull();
  });

  it("keeps the accepted-call endpoint disabled", async () => {
    const response = await worker.fetch(new Request("https://tracker.example/v1/calls/accepted", {
      method: "POST", headers: { authorization: "Bearer test-secret" }, body: "{}",
    }), { DB: new FakeD1() as unknown as CallTrackerEnv["DB"], INGEST_SECRET: "test-secret" });
    expect(response.status).toBe(409);
    expect(await response.json()).toMatchObject({ error: "attribution_not_verified" });
  });
});


describe("call-tracker DNI DID assignment", () => {
  it("assigns a provisioned DID to both paid click identifiers and reuses it idempotently", async () => {
    const db = new FakeD1();
    const expires = new Date(Date.now() + 60 * 60 * 1000).toISOString();
    db.clicks.set("traffic-click-dni", {
      click_id: "traffic-click-dni",
      expires_at: expires,
      clickflare_click_id: "cf-click-dni",
    });
    db.trackingDids.add("12025550123");
    const request = () => worker.fetch(new Request("https://tracker.example/dni/assign", {
      method: "POST",
      headers: { "content-type": "text/plain" },
      body: JSON.stringify({ click_id: "traffic-click-dni", clickflare_click_id: "cf-click-dni" }),
    }), makeEnv(db));

    const first = await request();
    expect(first.status).toBe(201);
    const assigned = await first.json() as { did: string; assignment_id: string };
    expect(assigned.did).toBe("12025550123");
    expect(db.didAssignments.get(assigned.assignment_id)).toMatchObject({
      did: "12025550123",
      trafficstars_click_id: "traffic-click-dni",
      clickflare_click_id: "cf-click-dni",
      status: "active",
    });

    const retry = await request();
    expect(retry.status).toBe(200);
    expect(await retry.json()).toMatchObject({ did: "12025550123", assignment_id: assigned.assignment_id });
    expect(db.didAssignments.size).toBe(1);

    const ringing = await worker.fetch(new Request("https://tracker.example/v1/calls/ringing", {
      method: "POST",
      headers: { authorization: "Bearer test-secret", "content-type": "application/json" },
      body: JSON.stringify({
        call_uuid: "d6baf5d7-c2e7-4f37-9cc9-6f0e37e01b89",
        destination: "+1-202-555-0123",
        agent_extension: "1001",
        ringing_at: new Date().toISOString().replace("Z", "+00:00"),
      }),
    }), { DB: db as unknown as CallTrackerEnv["DB"], CALL_INGEST_SECRET: "test-secret" });
    expect(ringing.status).toBe(202);
    expect(await ringing.json()).toMatchObject({
      click_id: "traffic-click-dni",
      clickflare_click_id: "cf-click-dni",
      attribution: "verified",
      attribution_method: "dni_did",
      clickflare_postback_status: "disabled",
    });
  });

  it("sends one ClickFlare conversion for a verified DNI ring and deduplicates by call UUID", async () => {
    const db = new FakeD1();
    const expires = new Date(Date.now() + 60 * 60 * 1000).toISOString();
    db.clicks.set("traffic-click-cf", {
      click_id: "traffic-click-cf",
      expires_at: expires,
      clickflare_click_id: "cf-click-cf",
    });
    db.trackingDids.add("12025550124");
    const assignmentResponse = await worker.fetch(new Request("https://tracker.example/dni/assign", {
      method: "POST",
      headers: { "content-type": "text/plain" },
      body: JSON.stringify({ click_id: "traffic-click-cf", clickflare_click_id: "cf-click-cf" }),
    }), makeEnv(db));
    expect(assignmentResponse.status).toBe(201);

    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response("ok", { status: 200 }));
    try {
      const callUuid = "e5d7b3a4-2c8e-4d5e-9a01-123456789abc";
      const ringRequest = () => worker.fetch(new Request("https://tracker.example/v1/calls/ringing", {
        method: "POST",
        headers: { authorization: "Bearer test-secret", "content-type": "application/json" },
        body: JSON.stringify({
          call_uuid: callUuid,
          destination: "+1-202-555-0124",
          agent_extension: "1001",
          ringing_at: new Date().toISOString(),
        }),
      }), { DB: db as unknown as CallTrackerEnv["DB"], CALL_INGEST_SECRET: "test-secret", TRAFFICSTARS_POSTBACK_ENABLED: "true", TRAFFICSTARS_POSTBACK_KEY: "test-key", CLICKFLARE_POSTBACK_ENABLED: "true" });

      const first = await ringRequest();
      expect(first.status).toBe(202);
      expect(await first.json()).toMatchObject({ attribution: "verified", postback_sent: false, postback_status: "unattributed", clickflare_postback_sent: true, clickflare_postback_status: "sent" });
      expect(fetchMock).toHaveBeenCalledTimes(1);
      const sentUrl = new URL(String(fetchMock.mock.calls[0][0]));
      expect(sentUrl.origin + sentUrl.pathname).toBe("https://globalvisitlog.com/cf/cv");
      expect(sentUrl.searchParams.get("click_id")).toBe("cf-click-cf");
      expect(sentUrl.searchParams.get("payout")).toBe("15");
      expect(sentUrl.searchParams.get("txid")).toBe(callUuid);
      expect(sentUrl.searchParams.get("ct")).toBe("call");
      expect(db.clickflareConversions.get(callUuid)).toMatchObject({ status: "sent", attempt_count: 1 });

      const duplicate = await ringRequest();
      expect(duplicate.status).toBe(202);
      expect(await duplicate.json()).toMatchObject({ duplicate: true, clickflare_postback_status: "already_sent" });
      expect(fetchMock).toHaveBeenCalledTimes(1);
    } finally {
      fetchMock.mockRestore();
    }
  });

  it("matches one recent paid phone intent and sends one ClickFlare S2S conversion", async () => {
    const db = new FakeD1();
    db.clicks.set("traffic-click-paid", {
      click_id: "traffic-click-paid",
      expires_at: "2026-11-22T00:00:00.000Z",
      clickflare_click_id: "cf-click-paid",
    });
    db.intents.set("intent-paid-123", {
      intent_id: "intent-paid-123", click_id: "traffic-click-paid",
      created_at: "2026-11-21T16:41:30.000Z", status: "open",
    });
    const fetchMock = vi.fn().mockResolvedValue(new Response("ok", { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
    try {
      const response = await worker.fetch(new Request("https://tracker.example/v1/calls/ringing", {
        method: "POST",
        headers: { authorization: "Bearer test-secret", "content-type": "application/json" },
        body: JSON.stringify({
          call_uuid: callUuid, destination: "+1-888-564-9049", agent_extension: "1001",
          ringing_at: "2026-11-21T16:42:10.000Z",
        }),
      }), { DB: db as unknown as CallTrackerEnv["DB"], CALL_INGEST_SECRET: "test-secret", CLICKFLARE_POSTBACK_ENABLED: "true" });
      expect(response.status).toBe(202);
      expect(await response.json()).toMatchObject({
        click_id: "traffic-click-paid", clickflare_click_id: "cf-click-paid",
        attribution: "candidate", attribution_method: "single_number_unique_intent_window",
        clickflare_postback_sent: true, clickflare_postback_status: "sent",
      });
      expect(db.intents.get("intent-paid-123")).toMatchObject({ status: "candidate", matched_call_uuid: callUuid });
      expect(db.calls.get(callUuid)).toMatchObject({
        click_id: "traffic-click-paid", clickflare_click_id: "cf-click-paid",
        matched_intent_id: "intent-paid-123", acceptance_reason: "agent_leg_ringing",
      });
      expect(fetchMock).toHaveBeenCalledTimes(1);
      const postback = new URL(String(fetchMock.mock.calls[0][0]));
      expect(postback.origin + postback.pathname).toBe("https://globalvisitlog.com/cf/cv");
      expect(postback.searchParams.get("click_id")).toBe("cf-click-paid");
      expect(postback.searchParams.get("payout")).toBe("15");
      expect(postback.searchParams.get("txid")).toBe(callUuid);
      expect(postback.searchParams.get("ct")).toBe("call");
    } finally { vi.unstubAllGlobals(); }
  });

  it("does not match when another inbound ring happened after the paid phone intent", async () => {
    const db = new FakeD1();
    db.clicks.set("traffic-click-overlap", {
      click_id: "traffic-click-overlap",
      expires_at: "2026-11-22T00:00:00.000Z",
      clickflare_click_id: "cf-click-overlap",
    });
    db.intents.set("intent-overlap-123", {
      intent_id: "intent-overlap-123", click_id: "traffic-click-overlap",
      created_at: "2026-11-21T16:41:30.000Z", status: "open",
    });
    db.ringingEvents.set("previous-call-uuid", {
      call_uuid: "previous-call-uuid", ringing_at: "2026-11-21T16:41:55.000Z",
    });
    const response = await worker.fetch(new Request("https://tracker.example/v1/calls/ringing", {
      method: "POST", headers: { authorization: "Bearer test-secret", "content-type": "application/json" },
      body: JSON.stringify({
        call_uuid: callUuid, destination: "+1-888-564-9049", agent_extension: "1001",
        ringing_at: "2026-11-21T16:42:10.000Z",
      }),
    }), { DB: db as unknown as CallTrackerEnv["DB"], CALL_INGEST_SECRET: "test-secret", CLICKFLARE_POSTBACK_ENABLED: "true" });
    expect(await response.json()).toMatchObject({
      click_id: null, clickflare_click_id: null, attribution: "ambiguous",
      attribution_method: "multiple_calls_after_click_intent", clickflare_postback_sent: false,
    });
    expect(db.intents.get("intent-overlap-123")?.status).toBe("open");
    expect(db.clickflareConversions.size).toBe(0);
  });

  it("leaves multiple recent paid phone intents ambiguous", async () => {
    const db = new FakeD1();
    db.clicks.set("traffic-a", { click_id: "traffic-a", expires_at: "2026-11-22T00:00:00.000Z", clickflare_click_id: "cf-a" });
    db.clicks.set("traffic-b", { click_id: "traffic-b", expires_at: "2026-11-22T00:00:00.000Z", clickflare_click_id: "cf-b" });
    db.intents.set("intent-a-123456", { intent_id: "intent-a-123456", click_id: "traffic-a", created_at: "2026-11-21T16:41:25.000Z", status: "open" });
    db.intents.set("intent-b-123456", { intent_id: "intent-b-123456", click_id: "traffic-b", created_at: "2026-11-21T16:41:35.000Z", status: "open" });
    const response = await worker.fetch(new Request("https://tracker.example/v1/calls/ringing", {
      method: "POST", headers: { authorization: "Bearer test-secret", "content-type": "application/json" },
      body: JSON.stringify({
        call_uuid: callUuid, destination: "+1-888-564-9049", agent_extension: "1001",
        ringing_at: "2026-11-21T16:42:10.000Z",
      }),
    }), { DB: db as unknown as CallTrackerEnv["DB"], CALL_INGEST_SECRET: "test-secret" });
    expect(await response.json()).toMatchObject({
      click_id: null, attribution: "ambiguous", attribution_method: "multiple_recent_click_intents",
    });
    expect(db.clickflareConversions.size).toBe(0);
  });

  it("does not create ClickFlare conversions when the DNI attribution is unmatched", async () => {
    const db = new FakeD1();
    const response = await worker.fetch(new Request("https://tracker.example/v1/calls/ringing", {
      method: "POST",
      headers: { authorization: "Bearer test-secret", "content-type": "application/json" },
      body: JSON.stringify({
        call_uuid: "4d7c2a1f-2e4a-4f3e-a5d8-1a2b3c4d5e6f",
        destination: "1030605",
        agent_extension: "1001",
        ringing_at: new Date().toISOString(),
      }),
    }), { DB: db as unknown as CallTrackerEnv["DB"], CALL_INGEST_SECRET: "test-secret", CLICKFLARE_POSTBACK_ENABLED: "true" });
    expect(response.status).toBe(202);
    expect(await response.json()).toMatchObject({ attribution: "unmatched", clickflare_postback_status: "unattributed" });
    expect(db.clickflareConversions.size).toBe(0);
  });
});
