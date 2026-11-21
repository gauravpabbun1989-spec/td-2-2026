import { describe, expect, it } from "vitest";
import worker, { type CallTrackerEnv } from "../../call-tracker-worker/worker";

type ClickRow = { click_id: string; expires_at: string };
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
        if (sql.startsWith("SELECT click_id, expires_at FROM traffic_clicks")) {
          return (db.clicks.get(String(values[0])) || null) as T | null;
        }
        if (sql.startsWith("SELECT call_uuid FROM call_ringing_events")) {
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
          const [clickId, , , , , , , expiresAt] = values;
          const id = String(clickId);
          if (!db.clicks.has(id)) db.clicks.set(id, { click_id: id, expires_at: String(expiresAt) });
        } else if (sql.startsWith("INSERT INTO call_ringing_events")) {
          const [uuid, destination, agent, ringingAt, goalId] = values;
          if (!db.ringingEvents.has(String(uuid))) db.ringingEvents.set(String(uuid), {
            call_uuid: uuid, destination, agent_extension: agent, ringing_at: ringingAt,
            goal_id: goalId, event_type: "call_ringing", click_id: null,
            attribution_status: sql.includes("'ambiguous'") ? "ambiguous" : "unmatched",
            attribution_method: sql.includes("time_window_multiple_clicks") ? "time_window_multiple_clicks" : "no_intent_in_time_window",
            matched_intent_id: null,
          });
        } else if (sql.startsWith("INSERT INTO call_intents")) {
          const [intentId, clickId, createdAt, pagePath, ctaLocation] = values;
          if (!db.intents.has(String(intentId))) db.intents.set(String(intentId), {
            intent_id: String(intentId), click_id: String(clickId), created_at: String(createdAt),
            page_path: String(pagePath), cta_location: String(ctaLocation), status: "open",
          });
        } else if (sql.startsWith("INSERT INTO inbound_calls")) {
          const [uuid, destination, agent, created, answered, hangup, billsec] = values;
          db.calls.set(String(uuid), {
            call_uuid: uuid, click_id: null, destination, agent_extension: agent, created_at: created,
            answered_at: answered, hangup_at: hangup, billsec, attribution_status: "unmatched",
            attribution_method: null, matched_intent_id: null,
          });
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
          const [uuid, destination, agent, created, answered, hangup, billsec] = values;
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
    call_uuid: uuid, destination: "1030605", agent_extension: "1001",
    created_at: callAt, answered_at: callAt, hangup_at: "2026-11-21T16:42:30.000Z", billsec: 15,
  };
}
async function ingest(db: FakeD1, calls: unknown[]) {
  return worker.fetch(new Request("https://tracker.example/v1/calls/ingest", {
    method: "POST", headers: { authorization: "Bearer test-secret", "content-type": "application/json" },
    body: JSON.stringify({ calls }),
  }), { DB: db as unknown as CallTrackerEnv["DB"], CALL_INGEST_SECRET: "test-secret" });
}

describe("call-tracker /intent click registration", () => {
  it("registers a missing click ID before storing its phone intent", async () => {
    const db = new FakeD1();
    const clickedAt = new Date().toISOString();
    const response = await worker.fetch(new Request("https://tracker.example/intent", {
      method: "POST", headers: { "content-type": "text/plain" },
      body: JSON.stringify({
        intent_id: "intent-12345678", click_id: "traffic-click-123", clicked_at: clickedAt,
        landing_path: "/flights-from-new-york", page_path: "/flight-change",
        cta_location: "header", banner_id: "8369514",
      }),
    }), makeEnv(db));
    expect(response.status).toBe(202);
    expect(await response.json()).toMatchObject({ ok: true, click_registered: true, intent_recorded: true, attribution: "intent_only", conversions_created: 0 });
    expect(db.clicks.has("traffic-click-123")).toBe(true);
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
      destination: "1030605",
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

  it("links a ringing UUID to the sole click ID in the conservative time window", async () => {
    const db = new FakeD1();
    db.intents.set("intent-ring-1", {
      intent_id: "intent-ring-1", click_id: "traffic-click-1",
      created_at: "2026-11-21T16:41:30.000Z", status: "open",
    });
    const response = await worker.fetch(new Request("https://tracker.example/v1/calls/ringing", {
      method: "POST",
      headers: { authorization: "Bearer test-secret", "content-type": "application/json" },
      body: JSON.stringify({
        call_uuid: callUuid, destination: "1030605", agent_extension: "1001",
        ringing_at: "2026-11-21T16:42:10.000Z",
      }),
    }), { DB: db as unknown as CallTrackerEnv["DB"], CALL_INGEST_SECRET: "test-secret" });
    expect(response.status).toBe(202);
    expect(await response.json()).toMatchObject({
      click_id: "traffic-click-1", attribution: "candidate",
      attribution_method: "unique_intent_time_window", postback_sent: false,
    });
    expect(db.ringingEvents.get(callUuid)).toMatchObject({
      click_id: "traffic-click-1", attribution_status: "candidate",
      matched_intent_id: "intent-ring-1",
    });
    expect(db.intents.get("intent-ring-1")).toMatchObject({
      status: "candidate", matched_call_uuid: callUuid,
    });
  });

  it("leaves ringing attribution ambiguous when multiple click IDs are in the time window", async () => {
    const db = new FakeD1();
    db.intents.set("intent-ring-1", {
      intent_id: "intent-ring-1", click_id: "traffic-click-1",
      created_at: "2026-11-21T16:41:30.000Z", status: "open",
    });
    db.intents.set("intent-ring-2", {
      intent_id: "intent-ring-2", click_id: "traffic-click-2",
      created_at: "2026-11-21T16:41:50.000Z", status: "open",
    });
    const response = await worker.fetch(new Request("https://tracker.example/v1/calls/ringing", {
      method: "POST",
      headers: { authorization: "Bearer test-secret", "content-type": "application/json" },
      body: JSON.stringify({
        call_uuid: callUuid, destination: "1030605", agent_extension: "1001",
        ringing_at: "2026-11-21T16:42:10.000Z",
      }),
    }), { DB: db as unknown as CallTrackerEnv["DB"], CALL_INGEST_SECRET: "test-secret" });
    expect(await response.json()).toMatchObject({
      click_id: null, attribution: "ambiguous",
      attribution_method: "time_window_multiple_clicks", postback_sent: false,
    });
    expect(db.ringingEvents.get(callUuid)).toMatchObject({
      click_id: null, attribution_status: "ambiguous",
    });
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

describe("call-tracker conservative intent-to-call correlation", () => {
  it("creates a candidate only when the time window contains one distinct click ID", async () => {
    const db = new FakeD1();
    db.intents.set("intent-one", { intent_id: "intent-one", click_id: "click-one", created_at: "2026-11-21T16:40:00.000Z", status: "open" });
    const response = await ingest(db, [callBody()]);
    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({ correlated_candidates: 1, ambiguous: 0, unmatched: 0, conversions_created: 0 });
    expect(db.calls.get(callUuid)).toMatchObject({ click_id: "click-one", attribution_status: "candidate", attribution_method: "unique_intent_time_window", matched_intent_id: "intent-one" });
    expect(db.intents.get("intent-one")).toMatchObject({ status: "candidate", matched_call_uuid: callUuid });
  });

  it("does not guess when two distinct click IDs are in the time window", async () => {
    const db = new FakeD1();
    db.intents.set("intent-one", { intent_id: "intent-one", click_id: "click-one", created_at: "2026-11-21T16:40:00.000Z", status: "open" });
    db.intents.set("intent-two", { intent_id: "intent-two", click_id: "click-two", created_at: "2026-11-21T16:41:00.000Z", status: "open" });
    const response = await ingest(db, [callBody()]);
    expect(await response.json()).toMatchObject({ correlated_candidates: 0, ambiguous: 1, unmatched: 0 });
    expect(db.calls.get(callUuid)).toMatchObject({ click_id: null, attribution_status: "ambiguous" });
    expect(db.intents.get("intent-one")?.status).toBe("ambiguous");
    expect(db.intents.get("intent-two")?.status).toBe("ambiguous");
  });

  it("leaves calls unmatched when no intent exists", async () => {
    const db = new FakeD1();
    const response = await ingest(db, [callBody()]);
    expect(await response.json()).toMatchObject({ correlated_candidates: 0, ambiguous: 0, unmatched: 1 });
    expect(db.calls.get(callUuid)).toMatchObject({ click_id: null, attribution_status: "unmatched" });
  });

  it("does not rematch an already ingested call on sync retry", async () => {
    const db = new FakeD1();
    db.calls.set(callUuid, { call_uuid: callUuid, click_id: "original-click", attribution_status: "candidate" });
    db.intents.set("intent-new", { intent_id: "intent-new", click_id: "later-click", created_at: "2026-11-21T16:41:00.000Z", status: "open" });
    const response = await ingest(db, [callBody()]);
    expect(await response.json()).toMatchObject({ correlated_candidates: 1, ambiguous: 0, unmatched: 0 });
    expect(db.calls.get(callUuid)?.click_id).toBe("original-click");
    expect(db.intents.get("intent-new")?.status).toBe("open");
  });

  it("keeps the accepted-call endpoint disabled", async () => {
    const response = await worker.fetch(new Request("https://tracker.example/v1/calls/accepted", {
      method: "POST", headers: { authorization: "Bearer test-secret" }, body: "{}",
    }), { DB: new FakeD1() as unknown as CallTrackerEnv["DB"], INGEST_SECRET: "test-secret" });
    expect(response.status).toBe(409);
    expect(await response.json()).toMatchObject({ error: "attribution_not_verified" });
  });
});
