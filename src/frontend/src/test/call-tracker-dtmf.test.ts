import { describe, expect, it } from "vitest";
import worker, { type CallTrackerEnv } from "../../call-tracker-worker/worker";

type TokenRow = {
  token_hash: string;
  click_id: string;
  created_at: string;
  expires_at: string;
  consumed_at: string | null;
  consumed_call_uuid: string | null;
};

class DtmfFakeD1 {
  clicks = new Map<string, { click_id: string; expires_at: string }>();
  tokens = new Map<string, TokenRow>();
  rings = new Map<string, Record<string, unknown>>();

  prepare(sql: string) {
    let values: unknown[] = [];
    const statement = {
      bind(...args: unknown[]) { values = args; return statement; },
      async first<T>() {
        if (sql.startsWith("SELECT click_id,expires_at FROM traffic_clicks")) {
          return (thisDb.clicks.get(String(values[0])) || null) as T | null;
        }
        if (sql.startsWith("UPDATE call_tracking_tokens")) {
          const [consumedAt, callUuid, tokenHash, now] = values.map(String);
          const row = thisDb.tokens.get(tokenHash);
          if (!row || row.consumed_at || row.expires_at <= now) return null;
          row.consumed_at = consumedAt;
          row.consumed_call_uuid = callUuid;
          return { click_id: row.click_id } as T;
        }
        if (sql.startsWith("SELECT click_id FROM call_tracking_tokens")) {
          const [tokenHash, callUuid] = values.map(String);
          const row = thisDb.tokens.get(tokenHash);
          return row?.consumed_call_uuid === callUuid && row.consumed_at
            ? ({ click_id: row.click_id } as T)
            : null;
        }
        if (sql.startsWith("SELECT call_uuid,click_id,attribution_status,attribution_method,matched_intent_id FROM call_ringing_events")) {
          return (thisDb.rings.get(String(values[0])) || null) as T | null;
        }
        return null;
      },
      async run() {
        if (sql.startsWith("INSERT INTO call_tracking_tokens")) {
          const [tokenHash, clickId, createdAt, expiresAt] = values.map(String);
          thisDb.tokens.set(tokenHash, {
            token_hash: tokenHash, click_id: clickId, created_at: createdAt,
            expires_at: expiresAt, consumed_at: null, consumed_call_uuid: null,
          });
        } else if (sql.startsWith("INSERT INTO traffic_clicks")) {
          const [clickId, , , , , , , expiresAt] = values;
          thisDb.clicks.set(String(clickId), { click_id: String(clickId), expires_at: String(expiresAt) });
        } else if (sql.startsWith("INSERT INTO call_ringing_events")) {
          const [callUuid, destination, agent, ringingAt, goalId, clickId, attributionStatus, attributionMethod] = values;
          thisDb.rings.set(String(callUuid), {
            call_uuid: callUuid, destination, agent_extension: agent, ringing_at: ringingAt,
            goal_id: goalId, click_id: clickId, attribution_status: attributionStatus,
            attribution_method: attributionMethod, matched_intent_id: null,
          });
        }
        return { success: true };
      },
      async all<T>() { return { results: [] as T[] }; },
    };
    const thisDb = this;
    return statement;
  }

  async batch() { return []; }
}

const callUuid = "b0cbbf14-f29b-4a4d-b8a0-2a2b5a1b0a13";
const env = (db: DtmfFakeD1): CallTrackerEnv => ({ DB: db as unknown as CallTrackerEnv["DB"], CALL_INGEST_SECRET: "test-secret" });

async function issueToken(db: DtmfFakeD1) {
  const response = await worker.fetch(new Request("https://tracker.example/v1/call-token", {
    method: "POST",
    headers: { origin: "https://ticketdepart.com", "content-type": "text/plain;charset=UTF-8" },
    body: JSON.stringify({ click_id: "traffic-click-1", clicked_at: new Date().toISOString(), landing_path: "/flight-change" }),
  }), env(db));
  expect(response.status).toBe(201);
  return await response.json() as { token: string; expires_at: string };
}

async function ring(db: DtmfFakeD1, uuid: string, token: string) {
  return worker.fetch(new Request("https://tracker.example/v1/calls/ringing", {
    method: "POST",
    headers: { authorization: "Bearer test-secret", "content-type": "application/json" },
    body: JSON.stringify({
      call_uuid: uuid, destination: "1030605", agent_extension: "1001",
      ringing_at: new Date().toISOString(), tracking_token: token,
    }),
  }), env(db));
}

describe("one-time DTMF call attribution", () => {
  it("issues a short-lived token and verifies it against exactly one ringing call UUID", async () => {
    const db = new DtmfFakeD1();
    db.clicks.set("traffic-click-1", {
      click_id: "traffic-click-1",
      expires_at: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    });
    const issued = await issueToken(db);
    expect(issued.token).toMatch(/^\d{8}$/);

    const response = await ring(db, callUuid, issued.token);
    expect(response.status).toBe(202);
    expect(await response.json()).toMatchObject({
      attribution: "verified",
      attribution_method: "one_time_dtmf_token",
      click_id: "traffic-click-1",
      goal_id: "6487",
      postback_sent: false,
    });
    expect(db.rings.get(callUuid)).toMatchObject({
      attribution_status: "verified",
      attribution_method: "one_time_dtmf_token",
      click_id: "traffic-click-1",
    });
  });

  it("does not allow a consumed token to attribute a second call", async () => {
    const db = new DtmfFakeD1();
    db.clicks.set("traffic-click-1", {
      click_id: "traffic-click-1",
      expires_at: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    });
    const issued = await issueToken(db);
    await ring(db, callUuid, issued.token);

    const secondUuid = "5b3b6d2d-6b5d-42f2-8c70-b4f2c83e3d10";
    const second = await ring(db, secondUuid, issued.token);
    expect(await second.json()).toMatchObject({
      attribution: "unmatched",
      attribution_method: "invalid_expired_or_reused_dtmf_token",
      click_id: null,
      postback_sent: false,
    });
  });

  it("rejects token issuance from unapproved origins", async () => {
    const response = await worker.fetch(new Request("https://tracker.example/v1/call-token", {
      method: "POST",
      headers: { origin: "https://untrusted.example", "content-type": "text/plain" },
      body: JSON.stringify({ click_id: "traffic-click-1" }),
    }), env(new DtmfFakeD1()));
    expect(response.status).toBe(403);
  });
});
