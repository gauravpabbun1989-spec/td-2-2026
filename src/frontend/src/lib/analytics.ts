/**
 * GA4 phone-click and lead tracking.
 *
 * Phone clicks are tracked centrally from tel: links so measurement does not
 * depend on individual CTA components. Page paths are normalized before being
 * attached to custom events to prevent malformed concatenated URL strings from
 * polluting the conversion funnel reports.
 */

const DEDUPE_WINDOW_MS = 250;
const handledClicks = new WeakSet<Event>();
const recentEmits = new Map<string, number>();

function getCleanPagePath() {
  if (typeof window === "undefined") return "/";

  const raw = window.location.pathname || "/";
  const absoluteUrlIndex = raw.indexOf("https://");
  const httpUrlIndex = raw.indexOf("http://");
  const cutAt = [absoluteUrlIndex, httpUrlIndex]
    .filter((index) => index >= 0)
    .sort((a, b) => a - b)[0];

  if (cutAt !== undefined && cutAt > 0) {
    return raw.slice(0, cutAt).replace(/\/+$/, "") || "/";
  }

  return raw;
}

function emitPhoneClick(location: string) {
  if (typeof window === "undefined") return;

  recentEmits.set(location, Date.now());

  const eventParams = {
    cta_location: location,
    page_path: getCleanPagePath(),
    page_title: document.title,
  };

  const win = window as typeof window & {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  };

  if (win.gtag) {
    win.gtag("event", "phone_click", eventParams);
    return;
  }

  win.dataLayer = win.dataLayer || [];
  win.dataLayer.push(["event", "phone_click", eventParams]);
}

export function trackLeadSubmit(location = "contact_form") {
  if (typeof window === "undefined") return;

  const eventParams = {
    lead_type: "callback_request",
    lead_location: location,
    page_path: getCleanPagePath(),
    page_title: document.title,
  };

  const win = window as typeof window & {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  };

  if (win.gtag) {
    win.gtag("event", "generate_lead", eventParams);
    return;
  }

  win.dataLayer = win.dataLayer || [];
  win.dataLayer.push(["event", "generate_lead", eventParams]);
}

export function trackPhoneClick(location: string, event?: Event) {
  if (event && handledClicks.has(event)) return;
  if (event) handledClicks.add(event);
  emitPhoneClick(location);
}

if (typeof document !== "undefined") {
  document.addEventListener("click", (event) => {
    if (handledClicks.has(event)) return;

    const target = event.target as Element | null;
    const link = target?.closest?.('a[href^="tel:"]');

    if (!link) return;

    handledClicks.add(event);

    const location =
      link.getAttribute("data-ocid") ||
      link.getAttribute("aria-label") ||
      "tel_link";

    const last = recentEmits.get(location);
    if (last !== undefined && Date.now() - last < DEDUPE_WINDOW_MS) return;

    emitPhoneClick(location);
  });
}
