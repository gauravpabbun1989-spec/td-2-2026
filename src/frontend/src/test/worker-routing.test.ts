import { describe, expect, it, vi } from "vitest";
import worker, {
  isRejectedRequestPath,
  normalizeRequestPath,
  type Env,
} from "../worker";

function createEnv() {
  const fetch = vi.fn(async (request: Request) => {
    const path = new URL(request.url).pathname;
    return new Response(path === "/404.html" ? "custom not found" : "asset", {
      status: 200,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  });

  return {
    env: { ASSETS: { fetch } } as unknown as Env,
    fetch,
  };
}

describe("Cloudflare edge route protection", () => {
  it("normalizes bounded encoded paths before checking them", () => {
    expect(normalizeRequestPath("/%252eenv")).toBe("/.env");
    expect(normalizeRequestPath("/flights-from-new-york/null/")).toBe(
      "/flights-from-new-york/null",
    );
  });

  it("rejects malformed null-suffix routes", () => {
    expect(isRejectedRequestPath("/flights-from-new-york/null")).toBe(true);
    expect(isRejectedRequestPath("/flights-from-new-york/null/")).toBe(true);
  });

  it("rejects sensitive dotfiles and common probe paths", () => {
    expect(isRejectedRequestPath("/.env")).toBe(true);
    expect(isRejectedRequestPath("/.env.production")).toBe(true);
    expect(isRejectedRequestPath("/.git/config")).toBe(true);
    expect(isRejectedRequestPath("/wp-login.php")).toBe(true);
  });

  it("returns the branded 404 document with a real 404 status", async () => {
    const { env, fetch } = createEnv();
    const request = new Request(
      "https://ticketdepart.com/flights-from-new-york/null",
    );

    const response = await worker.fetch(request, env);

    expect(response.status).toBe(404);
    expect(await response.text()).toBe("custom not found");
    expect(response.headers.get("x-robots-tag")).toBe("noindex, nofollow");
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(new URL(fetch.mock.calls[0][0].url).pathname).toBe("/404.html");
  });

  it("returns a real 404 for environment-file probes", async () => {
    const { env } = createEnv();
    const response = await worker.fetch(
      new Request("https://ticketdepart.com/.env"),
      env,
    );

    expect(response.status).toBe(404);
    expect(await response.text()).toBe("custom not found");
  });

  it("passes legitimate pages through to static assets unchanged", async () => {
    const { env, fetch } = createEnv();
    const request = new Request("https://ticketdepart.com/contact/");

    const response = await worker.fetch(request, env);

    expect(response.status).toBe(200);
    expect(await response.text()).toBe("asset");
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(new URL(fetch.mock.calls[0][0].url).pathname).toBe("/contact/");
  });

  it("returns an empty body for HEAD requests to rejected paths", async () => {
    const { env } = createEnv();
    const response = await worker.fetch(
      new Request("https://ticketdepart.com/.env", { method: "HEAD" }),
      env,
    );

    expect(response.status).toBe(404);
    expect(await response.text()).toBe("");
  });
});
