import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";

describe("TrafficStars API session status", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("reports a safe authenticated status from the OAuth refresh without calling a missing endpoint", async () => {
    const fetchMock = vi.fn(async (input: RequestInfo | URL, _init?: RequestInit) => {
      expect(String(input)).toBe("https://api.trafficstars.com/v1/auth/token");
      return new Response(
        JSON.stringify({
          access_token: "access-token-must-not-leak",
          refresh_token: "refresh-token-must-not-leak",
          token_type: "Bearer",
          expires_in: 3600,
        }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      );
    });
    vi.stubGlobal("fetch", fetchMock);

    const { getAccountSession } = await import(
      "../../trafficstars-manager/shared/trafficstars-api"
    );
    const result = await getAccountSession({ TRAFFICSTARS_API_KEY: "offline-api-key" });
    const serialized = JSON.stringify(result);

    expect(result).toMatchObject({ status: "authenticated" });
    expect(typeof (result as { expires_at?: unknown }).expires_at).toBe("string");
    expect((result as { expires_in: number }).expires_in).toBeGreaterThan(0);
    expect((result as { expires_in: number }).expires_in).toBeLessThanOrEqual(3600);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(serialized).not.toContain("access-token-must-not-leak");
    expect(serialized).not.toContain("refresh-token-must-not-leak");
  });

  it("does not claim an authenticated session when token refresh fails", async () => {
    const fetchMock = vi.fn(async () => new Response("denied", { status: 401 }));
    vi.stubGlobal("fetch", fetchMock);

    const { getAccountSession } = await import(
      "../../trafficstars-manager/shared/trafficstars-api"
    );

    await expect(
      getAccountSession({ TRAFFICSTARS_API_KEY: "invalid-offline-key" }),
    ).rejects.toThrow("authentication (HTTP 401)");
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
