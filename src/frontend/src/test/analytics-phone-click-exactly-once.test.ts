import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

/**
 * Cover for the hardened exactly-once contract in `lib/analytics.ts`.
 *
 * The accepted requirement is that a `tel:` link click emits exactly one
 * `phone_click` event — no double-firing and no missed firing — even when a
 * component also calls the exported `trackPhoneClick` for the same click. The
 * module now keeps the delegated document-level listener as the single source
 * of truth and makes `trackPhoneClick` idempotent per click event (a WeakSet of
 * handled events) with a 250ms location-keyed window guard for the no-event
 * path.
 *
 * The test browser blocks `tel:` link activation, so real navigation cannot be
 * observed. These tests assert the emitted `phone_click` events instead, which
 * is the observable contract the requirement is about.
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
  return { analytics };
}

describe("GA4 phone_click exactly-once contract", () => {
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
    vi.useRealTimers();
  });

  it("emits exactly one event when a component calls trackPhoneClick with the click event before the delegated listener runs", async () => {
    const calls = installGtag();
    const { analytics } = await loadAnalytics();

    const link = makeLink("tel:+18332250511", "header.call_button");
    document.body.append(link);

    // A component handler on the anchor runs before the document-level
    // listener (bubbling), and passes the originating event so the module can
    // recognize it as already handled.
    link.addEventListener("click", (event) => {
      analytics.trackPhoneClick("header.call_button", event);
    });

    link.click();

    expect(phoneClickCalls(calls)).toHaveLength(1);
    expect(phoneClickCalls(calls)[0][2]).toMatchObject({
      cta_location: "header",
    });

    link.remove();
  });

  it("emits exactly one event when a component calls trackPhoneClick with the click event after the delegated listener runs", async () => {
    const calls = installGtag();
    const { analytics } = await loadAnalytics();

    const link = makeLink("tel:+18332250511", "footer.call_button");
    document.body.append(link);

    // A capture-phase handler on `document` runs before the module's
    // bubble-phase listener; the module marks the event, so the later explicit
    // call with the same event must be a no-op.
    const capture = (event: Event) => {
      analytics.trackPhoneClick("footer.call_button", event);
    };
    document.addEventListener("click", capture, { capture: true });

    link.click();

    document.removeEventListener("click", capture, { capture: true });

    expect(phoneClickCalls(calls)).toHaveLength(1);

    link.remove();
  });

  it("emits exactly one event when a component calls trackPhoneClick without the event in the same click dispatch", async () => {
    const calls = installGtag();
    const { analytics } = await loadAnalytics();

    const link = makeLink("tel:+18332250511", "mobile_call.button");
    document.body.append(link);

    // No event is passed, so the WeakSet cannot help. The component handler
    // runs first and emits; the delegated listener then sees the same location
    // within the dedupe window and must stay silent.
    link.addEventListener("click", () => {
      analytics.trackPhoneClick("mobile_call.button");
    });

    link.click();

    expect(phoneClickCalls(calls)).toHaveLength(1);
    expect(phoneClickCalls(calls)[0][2]).toMatchObject({
      cta_location: "sticky_mobile",
    });

    link.remove();
  });

  it("emits exactly one event when the delegated listener runs before a no-event trackPhoneClick call", async () => {
    const calls = installGtag();
    const { analytics } = await loadAnalytics();

    const link = makeLink("tel:+18332250511", "contact.success.call_link");
    document.body.append(link);

    // Capture-phase handler runs first and calls without an event; the
    // delegated listener then sees the same location inside the window.
    const capture = () => {
      analytics.trackPhoneClick("contact.success.call_link");
    };
    document.addEventListener("click", capture, { capture: true });

    link.click();

    document.removeEventListener("click", capture, { capture: true });

    expect(phoneClickCalls(calls)).toHaveLength(1);

    link.remove();
  });

  it("still emits for a later click on the same location once the dedupe window has passed", async () => {
    vi.useFakeTimers();
    const calls = installGtag();
    await loadAnalytics();

    const link = makeLink("tel:+18332250511", "header.call_button");
    document.body.append(link);

    link.click();
    expect(phoneClickCalls(calls)).toHaveLength(1);

    // Advance past the 250ms location-keyed window so a genuine second click
    // is not swallowed as a duplicate of the first.
    vi.advanceTimersByTime(300);

    link.click();
    expect(phoneClickCalls(calls)).toHaveLength(2);

    link.remove();
  });

  it("does not emit for a non-tel: click even when a component calls trackPhoneClick with that event", async () => {
    const calls = installGtag();
    const { analytics } = await loadAnalytics();

    const link = makeLink(
      "mailto:support@ticketdestinations.com",
      "contact.email_fallback_link",
    );
    document.body.append(link);

    link.addEventListener("click", (event) => {
      analytics.trackPhoneClick("contact.email_fallback_link", event);
    });

    link.click();

    // The explicit call is the only source here; the delegated listener must
    // not add a second event for a non-tel: link.
    expect(phoneClickCalls(calls)).toHaveLength(1);

    link.remove();
  });
});
