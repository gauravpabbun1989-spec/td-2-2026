import { describe, expect, it, vi } from "vitest";
import worker, {
  canonicalRedirectPath,
  isRejectedRequestPath,
  normalizeRequestPath,
  type Env,
} from "../worker";

function createEnv(contentType = "text/html; charset=utf-8") {
  const fetch = vi.fn(async (request: Request) => {
    const path = new URL(request.url).pathname;
    return new Response(path === "/404.html" ? "custom not found" : "asset", {
      status: 200,
      headers: { "Content-Type": contentType },
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
    expect(await response.text()).toContain("This page has departed");
    expect(response.headers.get("x-robots-tag")).toBe("noindex, nofollow");
    expect(response.headers.get("x-ticketdepart-worker")).toBe("edge");
    expect(fetch).not.toHaveBeenCalled();
  });

  it("returns a real 404 for unknown HTML routes with or without a trailing slash", async () => {
    for (const pathname of ["/not-a-real-route", "/not-a-real-route/", "/not-a-real-route.html"]) {
      const { env, fetch } = createEnv();
      const response = await worker.fetch(
        new Request(`https://ticketdepart.com${pathname}`),
        env,
      );

      expect(response.status).toBe(404);
      expect(await response.text()).toContain("This page has departed");
      expect(response.headers.get("x-robots-tag")).toBe("noindex, nofollow");
      expect(response.headers.get("x-ticketdepart-worker")).toBe("edge");
      expect(fetch).not.toHaveBeenCalled();
    }
  });

  it("allows direct access to the branded 404 asset document", async () => {
    const { env, fetch } = createEnv();
    const response = await worker.fetch(
      new Request("https://ticketdepart.com/404.html"),
      env,
    );

    expect(response.status).toBe(200);
    expect(await response.text()).toBe("custom not found");
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
    expect(await response.text()).toContain("This page has departed");
    expect(response.headers.get("x-robots-tag")).toBe("noindex, nofollow");
  });

  it("normalizes public route URLs to their trailing-slash canonical", async () => {
    const { env, fetch } = createEnv();
    const response = await worker.fetch(
      new Request("https://ticketdepart.com/flights-from-new-york?source=gsc"),
      env,
    );

    expect(response.status).toBe(301);
    expect(response.headers.get("location")).toBe(
      "https://ticketdepart.com/flights-from-new-york/?source=gsc",
    );
    expect(fetch).not.toHaveBeenCalled();
    expect(canonicalRedirectPath("/flights-from-new-york")).toBe(
      "/flights-from-new-york/",
    );
  });

  it("redirects the legacy booking-assistance alias to the primary booking URL", async () => {
    const { env, fetch } = createEnv();
    const response = await worker.fetch(
      new Request("https://ticketdepart.com/flight-booking-assistance"),
      env,
    );

    expect(response.status).toBe(301);
    expect(response.headers.get("location")).toBe(
      "https://ticketdepart.com/flight-booking/",
    );
    expect(fetch).not.toHaveBeenCalled();
  });

  it("does not rewrite API paths or static asset URLs", async () => {
    expect(canonicalRedirectPath("/api/flight-search")).toBeNull();
    expect(canonicalRedirectPath("/assets/app.js")).toBeNull();
    expect(canonicalRedirectPath("/contact/")).toBeNull();
    expect(canonicalRedirectPath("/not-a-real-route")).toBeNull();
  });

  it("serves the phone-booking guide from its exact generated HTML document", async () => {
    const { env, fetch } = createEnv();
    const request = new Request("https://ticketdepart.com/how-to-book-a-flight-by-phone/");

    const response = await worker.fetch(request, env);

    expect(response.status).toBe(200);
    expect(response.headers.get("x-ticketdepart-worker")).toBe("edge");
    expect(fetch).toHaveBeenCalledTimes(1);
    const assetUrl = new URL(fetch.mock.calls[0][0].url);
    expect(assetUrl.pathname).toBe("/how-to-book-a-flight-by-phone/index.html");
  });

  it("serves the New York landing page from its exact generated HTML document", async () => {
    const { env, fetch } = createEnv();
    const request = new Request("https://ticketdepart.com/flights-from-new-york/?source=gsc");

    const response = await worker.fetch(request, env);

    expect(response.status).toBe(200);
    expect(await response.text()).toBe("asset");
    expect(fetch).toHaveBeenCalledTimes(1);
    const assetUrl = new URL(fetch.mock.calls[0][0].url);
    expect(assetUrl.pathname).toBe("/flights-from-new-york/index.html");
    expect(assetUrl.search).toBe("?source=gsc");
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

  it("prevents stale HTML shells while preserving normal asset caching", async () => {
    const { env } = createEnv();
    const htmlResponse = await worker.fetch(
      new Request("https://ticketdepart.com/flight-cancellation-assistance/"),
      env,
    );

    expect(htmlResponse.headers.get("cache-control")).toBe(
      "no-store, max-age=0, must-revalidate",
    );
    expect(htmlResponse.headers.get("cdn-cache-control")).toBe("no-store");

    const assetEnv = createEnv("application/javascript").env;
    const assetResponse = await worker.fetch(
      new Request("https://ticketdepart.com/assets/app.js"),
      assetEnv,
    );

    expect(assetResponse.headers.get("cache-control")).toBeNull();
    expect(assetResponse.headers.get("cdn-cache-control")).toBeNull();
  });

  it("returns an empty body for HEAD requests to rejected paths", async () => {
    const { env } = createEnv();
    const response = await worker.fetch(
      new Request("https://ticketdepart.com/.env", { method: "HEAD" }),
      env,
    );

    expect(response.status).toBe(404);
    expect(await response.text()).toBe("");
    expect(response.headers.get("x-robots-tag")).toBe("noindex, nofollow");
  });
});
