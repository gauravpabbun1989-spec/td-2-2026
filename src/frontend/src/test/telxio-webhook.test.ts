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

  it("stores deduplicated event metadata without retaining raw caller numbers or payloads", async () => {
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
        body: JSON.stringify({
          event_id: "evt-123", event_type: "call.completed", call_id: "call-456",
          caller_number: "+15551234567", called_number: "+18777888010",
          timestamp: "2026-11-25T00:00:00Z",
        }),
      }),
      { DB: db as unknown as CallTrackerEnv["DB"], TELXIO_WEBHOOK_TOKEN: "right" },
    );
    expect(response.status).toBe(202);
    expect(await response.json()).toMatchObject({ ok: true, accepted: true, conversion_created: false });
    expect(stored).toBeDefined();
    expect(stored?.[0]).toBe("evt-123");
    expect(stored?.[1]).toBe("call.completed");
    expect(stored?.[2]).toBe("call-456");
    expect(stored?.[3]).not.toBe("+15551234567");
    expect(stored?.[4]).toBe("+18777888010");
    expect(stored?.join("|")).not.toContain("+15551234567");
  });

  it("rejects oversized and non-object payloads", async () => {
    const db = { prepare: () => ({ bind: () => ({ run: async () => ({}) }) }) };
    const env = { DB: db as unknown as CallTrackerEnv["DB"], TELXIO_WEBHOOK_TOKEN: "right" };
    const large = await worker.fetch(
      new Request("https://tracker.example/webhook/telxio/right", { method: "POST", body: "x".repeat(32769) }),
      env,
    );
    expect(large.status).toBe(413);
    const array = await worker.fetch(
      new Request("https://tracker.example/webhook/telxio/right", { method: "POST", body: "[]" }),
      env,
    );
    expect(array.status).toBe(400);
  });
});
