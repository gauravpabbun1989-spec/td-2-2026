import { describe, expect, it } from "vitest";
import worker, { type CallTrackerEnv } from "../../call-tracker-worker/worker";

type ClickRow = {
  click_id: string;
  expires_at: string;
};

class FakeD1 {
  clicks = new Map<string, ClickRow>();
  intents = new Map<string, Record<string, unknown>>();
  statements: string[] = [];

  prepare(sql: string) {
    const db = this;
    let values: unknown[] = [];
    return {
      bind(...args: unknown[]) {
        values = args;
        return this;
      },
      async first<T>() {
        db.statements.push(sql);
        if (sql.startsWith("SELECT click_id, expires_at FROM traffic_clicks")) {
          return (db.clicks.get(String(values[0])) || null) as T | null;
        }
        return null;
      },
      async run() {
        db.statements.push(sql);
        if (sql.startsWith("INSERT INTO traffic_clicks")) {
          const [clickId, , , , , , , expiresAt] = values;
          const id = String(clickId);
          if (!db.clicks.has(id)) {
            db.clicks.set(id, {
              click_id: id,
              expires_at: String(expiresAt),
            });
          }
        }
        if (sql.startsWith("INSERT INTO call_intents")) {
          const [intentId, clickId, createdAt, pagePath, ctaLocation] = values;
          db.intents.set(String(intentId), {
            intent_id: intentId,
            click_id: clickId,
            created_at: createdAt,
            page_path: pagePath,
            cta_location: ctaLocation,
          });
        }
        return { success: true };
      },
    };
  }

  async batch() {
    return [];
  }
}

function makeEnv(db: FakeD1): CallTrackerEnv {
  return { DB: db as unknown as CallTrackerEnv["DB"] };
}

describe("call-tracker /intent click registration", () => {
  it("registers a missing click ID before storing its phone intent", async () => {
    const db = new FakeD1();
    const clickedAt = new Date().toISOString();
    const response = await worker.fetch(
      new Request("https://tracker.example/intent", {
        method: "POST",
        headers: { "content-type": "text/plain" },
        body: JSON.stringify({
          intent_id: "intent-12345678",
          click_id: "traffic-click-123",
          clicked_at: clickedAt,
          landing_path: "/flights-from-new-york",
          page_path: "/flight-change",
          cta_location: "header",
          banner_id: "8369514",
        }),
      }),
      makeEnv(db),
    );

    const body = await response.json();
    expect(response.status).toBe(202);
    expect(body).toMatchObject({
      ok: true,
      click_registered: true,
      intent_recorded: true,
      attribution: "intent_only",
      conversions_created: 0,
    });
    expect(db.clicks.has("traffic-click-123")).toBe(true);
    expect(db.intents.get("intent-12345678")).toMatchObject({
      click_id: "traffic-click-123",
      page_path: "/flight-change",
      cta_location: "header",
    });
    expect(db.statements.some((sql) => sql.includes("traffic_conversions"))).toBe(
      false,
    );
  });

  it("preserves an existing active click record instead of overwriting its timestamp", async () => {
    const db = new FakeD1();
    db.clicks.set("traffic-click-123", {
      click_id: "traffic-click-123",
      expires_at: new Date(Date.now() + 60_000).toISOString(),
    });

    const response = await worker.fetch(
      new Request("https://tracker.example/intent", {
        method: "POST",
        body: JSON.stringify({
          intent_id: "intent-87654321",
          click_id: "traffic-click-123",
          page_path: "/flight-change",
          cta_location: "footer",
        }),
      }),
      makeEnv(db),
    );

    const body = await response.json();
    expect(response.status).toBe(202);
    expect(body.click_registered).toBe(false);
    expect(db.intents.has("intent-87654321")).toBe(true);
    expect(db.statements.filter((sql) => sql.startsWith("INSERT INTO traffic_clicks"))).toHaveLength(0);
  });

  it("rejects an expired existing click and does not create an intent", async () => {
    const db = new FakeD1();
    db.clicks.set("expired-click", {
      click_id: "expired-click",
      expires_at: new Date(Date.now() - 60_000).toISOString(),
    });

    const response = await worker.fetch(
      new Request("https://tracker.example/intent", {
        method: "POST",
        body: JSON.stringify({
          intent_id: "intent-expired1",
          click_id: "expired-click",
          page_path: "/",
          cta_location: "hero",
        }),
      }),
      makeEnv(db),
    );

    expect(response.status).toBe(404);
    expect(db.intents.size).toBe(0);
  });
});
