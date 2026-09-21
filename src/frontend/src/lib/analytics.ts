/**
 * GA4 phone-click tracking.
 *
 * The delegated document-level listener is the single source of truth for
 * tel: link clicks. Each event carries page and acquisition context so a
 * phone click can be tied back to the visitor's landing page and campaign.
 */

const DEDUPE_WINDOW_MS = 250;
const handledClicks = new WeakSet<Event>();
const recentEmits = new Map<string, number>();

function firstTouchValue(key: string): string | undefined {
  if (typeof window === "undefined") return undefined;
  try {
    return sessionStorage.getItem(key) || undefined;
  } catch {
    return undefined;
  }
}

function captureFirstTouch() {
  if (typeof window === "undefined") return;
  try {
    const url = new URL(window.location.href);
    const values: Record<string, string> = {
      landing_path: window.location.pathname,
      landing_referrer: document.referrer,
    };
    for (const key of ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid"]) {
      const value = url.searchParams.get(key);
      if (value) values[key] = value;
    }
    for (const [key, value] of Object.entries(values)) {
      const storageKey = "td_first_" + key;
      if (!sessionStorage.getItem(storageKey)) sessionStorage.setItem(storageKey, value);
    }
  } catch {
    // Tracking must never interfere with site functionality.
  }
}

function emitPhoneClick(location: string) {
  if (typeof window === "undefined") return;
  captureFirstTouch();
  const eventParams = {
    cta_location: location,
    page_path: window.location.pathname,
    page_title: document.title,
    landing_path: firstTouchValue("td_first_landing_path"),
    landing_referrer: firstTouchValue("td_first_landing_referrer"),
    utm_source: firstTouchValue("td_first_utm_source"),
    utm_medium: firstTouchValue("td_first_utm_medium"),
    utm_campaign: firstTouchValue("td_first_utm_campaign"),
    utm_term: firstTouchValue("td_first_utm_term"),
    utm_content: firstTouchValue("td_first_utm_content"),
    gclid: firstTouchValue("td_first_gclid"),
  };
  recentEmits.set(location, Date.now());
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

export function trackPhoneClick(location: string, event?: Event) {
  if (event && handledClicks.has(event)) return;
  if (event) handledClicks.add(event);
  emitPhoneClick(location);
}

if (typeof document !== "undefined") {
  captureFirstTouch();
  document.addEventListener("click", (event) => {
    if (handledClicks.has(event)) return;
    const target = event.target as Element | null;
    const link = target?.closest?.('a[href^="tel:"]');
    if (!link) return;
    handledClicks.add(event);
    const location = link.getAttribute("data-ocid") || link.getAttribute("aria-label") || "tel_link";
    const last = recentEmits.get(location);
    if (last !== undefined && Date.now() - last < DEDUPE_WINDOW_MS) return;
    emitPhoneClick(location);
  });
}
