import { describe, expect, it } from "vitest";
import worker, { type CallTrackerEnv } from "../../call-tracker-worker/worker";

describe("Telxio webhook intake", () => {
  it("rejects requests without the configured URL token", async () => {
    const db = { prepare: () => ({ bind: () => ({ run: async () => ({}) }) }) };
    const response = await worker.fetch(
      new Request("https://tracker.example/webhook/telxio/wrong", { method: "POST", body: "{}" }),
      { DB: db as unknown as CallTrackerEnv["DB"], TELXIO_WEBHOOK_TOKEN: "right" },
    );
    expect(response.status).toBe(401);
  });

  it("stores deduplicated metadata and hashes the caller number", async () => {
    let stored: unknown[] | undefined;
    const db = {
      prepare: (sql: string) => ({
        bind: (...values: unknown[]) => ({
          run: async () => { expect(sql).toContain("INSERT INTO telxio_webhook_events"); stored = values; return {}; },
        }),
      }),
    };
    const response = await worker.fetch(
      new Request("https://tracker.example/webhook/telxio/right", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ event_id: "evt-123", event_type: "call.completed", call_id: "call-456", caller_number: "+15551234567", called_number: "+18885649049", timestamp: "2026-11-25T00:00:00Z" }),
      }),
      { DB: db as unknown as CallTrackerEnv["DB"], TELXIO_WEBHOOK_TOKEN: "right" },
    );
    expect(response.status).toBe(202);
    expect(await response.json()).toMatchObject({ ok: true, accepted: true, conversion_created: false });
    expect(stored?.[0]).toBe("evt-123");
    expect(stored?.[1]).toBe("call.completed");
    expect(stored?.[2]).toBe("call-456");
    expect(stored?.[3]).not.toBe("+15551234567");
    expect(stored?.[4]).toBe("+18885649049");
    expect(stored?.join("|")).not.toContain("+15551234567");
  });

  it("rejects oversized and non-object payloads", async () => {
    const db = { prepare: () => ({ bind: () => ({ run: async () => ({}) }) }) };
    const env = { DB: db as unknown as CallTrackerEnv["DB"], TELXIO_WEBHOOK_TOKEN: "right" };
    const large = await worker.fetch(new Request("https://tracker.example/webhook/telxio/right", { method: "POST", body: "x".repeat(32769) }), env);
    expect(large.status).toBe(413);
    const array = await worker.fetch(new Request("https://tracker.example/webhook/telxio/right", { method: "POST", body: "[]" }), env);
    expect(array.status).toBe(400);
  });

  it("accepts URL-encoded provider callbacks", async () => {
    let stored: unknown[] | undefined;
    const db = { prepare: (sql: string) => ({ bind: (...values: unknown[]) => ({ run: async () => { expect(sql).toContain("INSERT INTO telxio_webhook_events"); stored = values; return {}; } }) }) };
    const body = new URLSearchParams({ event_id: "evt-form-1", call_id: "telxio-call-2", did: "18885649049", caller: "+15551234567" }).toString();
    const response = await worker.fetch(new Request("https://tracker.example/webhook/telxio/right", {
      method: "POST", headers: { "content-type": "application/x-www-form-urlencoded" }, body,
    }), { DB: db as unknown as CallTrackerEnv["DB"], TELXIO_WEBHOOK_TOKEN: "right" });
    expect(response.status).toBe(202);
    expect(stored?.[0]).toBe("evt-form-1");
    expect(stored?.[2]).toBe("telxio-call-2");
    expect(stored?.[4]).toBe("18885649049");
  });

  it("accepts query-string Call Info callbacks", async () => {
    let stored: unknown[] | undefined;
    const db = { prepare: (sql: string) => ({ bind: (...values: unknown[]) => ({ run: async () => { expect(sql).toContain("INSERT INTO telxio_webhook_events"); stored = values; return {}; } }) }) };
    const response = await worker.fetch(new Request("https://tracker.example/webhook/telxio/right?event_id=evt-get-1&callid=telxio-call-3&dnis=18885649049", { method: "GET" }), {
      DB: db as unknown as CallTrackerEnv["DB"], TELXIO_WEBHOOK_TOKEN: "right",
    });
    expect(response.status).toBe(202);
    expect(stored?.[0]).toBe("evt-get-1");
    expect(stored?.[2]).toBe("telxio-call-3");
    expect(stored?.[4]).toBe("18885649049");
  });
});
