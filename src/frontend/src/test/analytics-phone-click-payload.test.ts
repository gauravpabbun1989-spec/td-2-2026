import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import phoneConfig from "../../phone-config.json";

/**
 * Characterization baseline for the parts of the GA4 `phone_click` contract in
 * `lib/analytics.ts` that the upcoming request does NOT intentionally change.
 *
 * The behavior under change is the tracking module's *loading* and its
 * *exactly-once firing guarantee* — how the module is imported at startup and
 * how many events a single tel: click produces. Nothing here asserts either of
 * those: the existing `analytics-phone-click.test.ts` covers the module's own
 * listener registration and per-click count, and those assertions are expected
 * to move with the fix. What is frozen here is the adjacent, stable contract
 * that must survive the fix:
 *
 *   - the event name and the `cta_location` / `page_path` / `page_title`
 *     payload shape;
 *   - the `data-ocid` -> `aria-label` -> `"tel_link"` location precedence;
 *   - `gtag` preferred over the `dataLayer` fallback when both are present;
 *   - `trackPhoneClick(location)` emitting the same payload as a click.
 *
 * Coverage limit: this file exercises the module in isolation. It does not
 * execute `main.tsx`, so it cannot prove the deployed entry point imports the
 * module; that wiring is asserted by inspection of `main.tsx`, not here.
 */

type GtagCall = [string, string, Record<string, unknown>];

type WindowWithAnalytics = typeof window & {
  gtag?: (...args: unknown[]) => void;
  dataLayer?: unknown[];
};

function installGtag() {
  const calls: GtagCall[] = [];
  const gtag = (...args: unknown[]) => {
    calls.push(args as GtagCall);
  };
  (window as WindowWithAnalytics).gtag = gtag;
  return calls;
}

function phoneClickCalls(calls: GtagCall[]): GtagCall[] {
  return calls.filter(
    (call) => call[0] === "event" && call[1] === "phone_click",
  );
}

/** The document-level click listener the module registers on import. */
let registeredListener: EventListener | undefined;

/**
 * Creates an anchor and stops jsdom from attempting real navigation when it is
 * clicked. The module's document-level listener still sees the bubbled click.
 */
function makeLink(href: string): HTMLAnchorElement {
  const link = document.createElement("a");
  link.href = href;
  link.addEventListener("click", (event) => event.preventDefault());
  return link;
}

async function loadAnalytics() {
  vi.resetModules();
  const addSpy = vi.spyOn(document, "addEventListener");
  const analytics = await import("@/lib/analytics");
  const clickRegistrations = addSpy.mock.calls.filter(
    ([type]) => type === "click",
  );
  registeredListener = clickRegistrations[0]?.[1] as EventListener | undefined;
  addSpy.mockRestore();
  return { analytics };
}

describe("GA4 phone_click payload contract", () => {
  beforeEach(() => {
    // Assign `undefined` rather than `delete`: the module treats a falsy
    // `gtag` as absent and a falsy `dataLayer` as empty, so this is equivalent
    // and avoids the lint rule against `delete` on globals.
    (window as WindowWithAnalytics).gtag = undefined;
    (window as WindowWithAnalytics).dataLayer = undefined;
    window.sessionStorage.removeItem("ticketdepart_paid_click_attribution_v1");
    window.sessionStorage.removeItem("ticketdepart_trafficstars_click_id");
    window.sessionStorage.removeItem("ticketdepart_trafficstars_clicked_at");
    window.sessionStorage.removeItem("ticketdepart_trafficstars_banner_id");
    window.sessionStorage.removeItem("ticketdepart_clickflare_click_id");
    window.localStorage.removeItem("ticketdepart_traffic_click");
    window.localStorage.removeItem("ticketdepart_clickflare_click");
    window.localStorage.removeItem("ticketdepart_paid_click_attribution_v1");
    window.history.replaceState({}, "", "/");
  });

  afterEach(() => {
    if (registeredListener) {
      document.removeEventListener("click", registeredListener);
      registeredListener = undefined;
    }
    vi.unstubAllGlobals();
    (window as WindowWithAnalytics).gtag = undefined;
    (window as WindowWithAnalytics).dataLayer = undefined;
  });

  it("includes cta_location, page_path, and page_title in the event payload", async () => {
    const calls = installGtag();
    await loadAnalytics();

    const link = makeLink(phoneConfig.href);
    link.setAttribute("data-ocid", "header.call_button");
    document.body.append(link);

    link.click();

    const events = phoneClickCalls(calls);
    expect(events).toHaveLength(1);
    expect(events[0][2]).toMatchObject({
      cta_location: "header",
      page_path: window.location.pathname,
      page_title: document.title,
    });

    link.remove();
  });


  it("retains a TrafficStars click ID for analytics but never sends an incomplete phone intent", async () => {
    const calls = installGtag();
    const fetchMock = vi.fn().mockResolvedValue({ type: "opaque" });
    vi.stubGlobal("fetch", fetchMock);
    window.history.replaceState({}, "", "/?click_id=td-click-123&banner_id=8369514");
    const { analytics } = await loadAnalytics();

    // The browser can still measure the phone click, but the paid intent must
    // not be sent until the matching ClickFlare ID is present.
    analytics.trackPhoneClick("header.call_button");
    const storedAttribution = JSON.parse(
      window.sessionStorage.getItem("ticketdepart_paid_click_attribution_v1") || "null",
    );
    expect(storedAttribution).toMatchObject({
      clickId: "td-click-123",
      clickFlareId: null,
      bannerId: "8369514",
    });
    const clickedAt = storedAttribution?.clickedAt as string | undefined;
    expect(clickedAt).toBeTruthy();
    expect(Number.isNaN(Date.parse(clickedAt || ""))).toBe(false);

    window.history.replaceState({}, "", "/flight-booking");
    analytics.trackPhoneClick("footer.call_button");

    const events = phoneClickCalls(calls);
    expect(events).toHaveLength(2);
    expect(JSON.parse(window.sessionStorage.getItem("ticketdepart_paid_click_attribution_v1") || "null")?.clickedAt).toBe(clickedAt);
    expect(events[1][2]).toMatchObject({
      trafficstars_click_id: "td-click-123",
      conversion_stage: "phone_click",
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("sends a durable call-intent request after the landing URL has been cleaned", async () => {
    const calls = installGtag();
    const fetchMock = vi.fn().mockResolvedValue({ type: "opaque" });
    vi.stubGlobal("fetch", fetchMock);
    window.history.replaceState({}, "", "/?click_id=td-click-456&cf_click_id=cf-click-456&banner_id=8369514");
    const { analytics } = await loadAnalytics();

    // Simulate a browser/session transition where sessionStorage was cleared
    // but main.tsx's durable landing-click record remains.
    window.sessionStorage.removeItem("ticketdepart_paid_click_attribution_v1");
    window.sessionStorage.removeItem("ticketdepart_trafficstars_click_id");
    window.sessionStorage.removeItem("ticketdepart_trafficstars_clicked_at");
    window.sessionStorage.removeItem("ticketdepart_trafficstars_banner_id");
    // The persistent combined pair remains after session storage is cleared.
    expect(JSON.parse(window.localStorage.getItem("ticketdepart_paid_click_attribution_v1") || "null")).toMatchObject({
      clickId: "td-click-456",
      clickFlareId: "cf-click-456",
    });
    window.history.replaceState({}, "", "/flight-change/");
    analytics.trackPhoneClick("header.call_button");

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe("https://ticketdepart-call-tracker.gaurav-pabbun.workers.dev/intent");
    expect(init).toMatchObject({
      method: "POST",
      mode: "no-cors",
      credentials: "omit",
      keepalive: true,
    });
    expect(init.headers).toMatchObject({ "Content-Type": "text/plain;charset=UTF-8" });
    const payload = JSON.parse(String(init.body));
    expect(payload).toMatchObject({
      click_id: "td-click-456",
      clickflare_click_id: "cf-click-456",
      page_path: "/flight-change",
      cta_location: "header",
    });
    expect(payload.intent_id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[4-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
    expect(calls.filter((call) => call[0] === "event" && call[1] === "phone_click")).toHaveLength(1);
  });

  it("ignores an unresolved click ID macro", async () => {
    const calls = installGtag();
    window.history.replaceState({}, "", "/?click_id=%7Bclick_id%7D");
    const { analytics } = await loadAnalytics();

    analytics.trackPhoneClick("header.call_button");

    const events = phoneClickCalls(calls);
    expect(events).toHaveLength(1);
    expect(events[0][2]).not.toHaveProperty("trafficstars_click_id");
  });

  it("derives cta_location from aria-label when data-ocid is absent", async () => {
    const calls = installGtag();
    await loadAnalytics();

    const link = makeLink(phoneConfig.href);
    link.setAttribute("aria-label", "Speak with a Travel Specialist");
    document.body.append(link);

    link.click();

    const events = phoneClickCalls(calls);
    expect(events).toHaveLength(1);
    expect(events[0][2]).toMatchObject({
      cta_location: "content",
    });

    link.remove();
  });

  it("falls back to the tel_link location when neither data-ocid nor aria-label is present", async () => {
    const calls = installGtag();
    await loadAnalytics();

    const link = makeLink(phoneConfig.href);
    document.body.append(link);

    link.click();

    const events = phoneClickCalls(calls);
    expect(events).toHaveLength(1);
    expect(events[0][2]).toMatchObject({ cta_location: "content" });

    link.remove();
  });

  it("prefers gtag over the dataLayer when both are available", async () => {
    const calls = installGtag();
    (window as WindowWithAnalytics).dataLayer = [];
    await loadAnalytics();

    const link = makeLink(phoneConfig.href);
    link.setAttribute("data-ocid", "footer.call_button");
    document.body.append(link);

    link.click();

    expect(phoneClickCalls(calls)).toHaveLength(1);
    // The gtag path returns early, so the dataLayer must stay untouched.
    expect((window as WindowWithAnalytics).dataLayer).toEqual([]);

    link.remove();
  });

  it("emits the same payload shape from an explicit trackPhoneClick call", async () => {
    const calls = installGtag();
    const { analytics } = await loadAnalytics();

    analytics.trackPhoneClick("contact.success.call_link");

    const events = phoneClickCalls(calls);
    expect(events).toHaveLength(1);
    expect(events[0][2]).toMatchObject({
      cta_location: "callback_success",
      page_path: window.location.pathname,
      page_title: document.title,
    });
  });
});
