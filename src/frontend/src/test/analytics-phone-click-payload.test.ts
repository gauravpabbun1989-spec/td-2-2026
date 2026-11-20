import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

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
  });

  afterEach(() => {
    if (registeredListener) {
      document.removeEventListener("click", registeredListener);
      registeredListener = undefined;
    }
    (window as WindowWithAnalytics).gtag = undefined;
    (window as WindowWithAnalytics).dataLayer = undefined;
  });

  it("includes cta_location, page_path, and page_title in the event payload", async () => {
    const calls = installGtag();
    await loadAnalytics();

    const link = makeLink("tel:+18777888010");
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


  it("retains a valid TrafficStars click ID across same-session navigation for phone intent", async () => {
    const calls = installGtag();
    window.history.replaceState({}, "", "/?click_id=td-click-123");
    const { analytics } = await loadAnalytics();

    expect(window.sessionStorage.getItem("ticketdepart_trafficstars_click_id")).toBe("td-click-123");

    window.history.replaceState({}, "", "/flight-booking");
    analytics.trackPhoneClick("header.call_button");

    const events = phoneClickCalls(calls);
    expect(events).toHaveLength(1);
    expect(events[0][2]).toMatchObject({
      trafficstars_click_id: "td-click-123",
      conversion_stage: "phone_click",
    });
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

    const link = makeLink("tel:+18777888010");
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

    const link = makeLink("tel:+18777888010");
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

    const link = makeLink("tel:+18777888010");
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
