import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

/**
 * Characterization baseline for the GA4 `phone_click` contract in
 * `lib/analytics.ts`. The accepted requirement is that clicking a `tel:` link
 * fires exactly one `phone_click` event, so this file freezes the module's own
 * observable contract: one event per tel: click, no event for a non-tel: click,
 * and one event per explicit `trackPhoneClick` call.
 *
 * `main.tsx` imports `lib/analytics` for its side effect, so the module's
 * document-level listener is registered exactly once at app startup. The module
 * registers that listener at import time; jsdom keeps one `document` for the
 * whole file, so each test resets the module registry, captures the listener
 * the fresh import registers, and removes it afterwards — otherwise listeners
 * from earlier tests would stack and every click would fire several events.
 *
 * Coverage limit: this file proves the module's contract and that a single
 * import registers a single listener. It does not execute `main.tsx`, so it
 * cannot prove the deployed entry point imports the module; that wiring is
 * asserted by inspection of `main.tsx`, not by a test here.
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
function makeLink(href: string, ocid: string): HTMLAnchorElement {
  const link = document.createElement("a");
  link.href = href;
  link.setAttribute("data-ocid", ocid);
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
  return { analytics, clickRegistrations };
}

describe("GA4 phone_click tracking", () => {
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

  it("registers exactly one document-level click listener on import", async () => {
    // The accepted requirement is exactly one event per click. A second
    // listener registered at import time would double every event, so the
    // single-registration guarantee is asserted directly.
    const { clickRegistrations } = await loadAnalytics();
    expect(clickRegistrations).toHaveLength(1);
  });

  it("fires exactly one phone_click event when a tel: link is clicked", async () => {
    const calls = installGtag();
    await loadAnalytics();

    const link = makeLink("tel:+18889580280", "header.call_button");
    link.textContent = "+1 888-958-0280";
    document.body.append(link);

    link.click();

    expect(phoneClickCalls(calls)).toHaveLength(1);
    expect(phoneClickCalls(calls)[0][2]).toMatchObject({
      cta_location: "header",
    });

    link.remove();
  });

  it("fires exactly one phone_click event when a nested element inside a tel: link is clicked", async () => {
    const calls = installGtag();
    await loadAnalytics();

    const link = makeLink("tel:+18889580280", "mobile_call.button");
    const icon = document.createElement("span");
    icon.textContent = "call";
    link.append(icon);
    document.body.append(link);

    // The click target is the inner span, not the anchor itself; the listener
    // must still resolve the enclosing tel: link exactly once.
    icon.click();

    expect(phoneClickCalls(calls)).toHaveLength(1);

    link.remove();
  });

  it("does not fire phone_click for a non-tel: link", async () => {
    const calls = installGtag();
    await loadAnalytics();

    const link = makeLink(
      "mailto:support@ticketdestinations.com",
      "contact.email_fallback_link",
    );
    link.textContent = "Email us";
    document.body.append(link);

    link.click();

    expect(phoneClickCalls(calls)).toHaveLength(0);

    link.remove();
  });

  it("fires exactly one phone_click event per explicit trackPhoneClick call", async () => {
    const calls = installGtag();
    const { analytics } = await loadAnalytics();

    analytics.trackPhoneClick("contact.success.call_link");

    expect(phoneClickCalls(calls)).toHaveLength(1);
    expect(phoneClickCalls(calls)[0][2]).toMatchObject({
      cta_location: "callback_success",
    });
  });

  it("falls back to the dataLayer when gtag is unavailable", async () => {
    await loadAnalytics();

    const link = makeLink("tel:+18889580280", "footer.call_button");
    document.body.append(link);

    link.click();

    const dataLayer = (window as WindowWithAnalytics).dataLayer;
    expect(dataLayer).toBeDefined();
    const events = (dataLayer ?? []).filter(
      (entry): entry is GtagCall =>
        Array.isArray(entry) &&
        entry[0] === "event" &&
        entry[1] === "phone_click",
    );
    expect(events).toHaveLength(1);

    link.remove();
  });
});
