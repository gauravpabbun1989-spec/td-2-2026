/**
 * GA4 phone-click tracking.
 *
 * The delegated document-level listener registered at import time is the single
 * source of truth for `tel:` link clicks. `trackPhoneClick` remains available
 * for explicit call sites, but it is idempotent per click event so a component
 * that also calls it for a `tel:` link cannot produce a second `phone_click`
 * event for the same click.
 */

/**
 * Window used to collapse a component's own `trackPhoneClick(location)` call
 * and the delegated listener into a single event when the component does not
 * pass the originating click event. Both paths run synchronously within one
 * click dispatch, so this only needs to cover that dispatch.
 */
const DEDUPE_WINDOW_MS = 250;

/** Click events the delegated listener has already emitted for. */
const handledClicks = new WeakSet<Event>();

/** Location -> timestamp of the most recent emit. */
const recentEmits = new Map<string, number>();

function emitPhoneClick(location: string) {
  if (typeof window === "undefined") return;

  recentEmits.set(location, Date.now());

  const eventParams = {
    cta_location: location,
    page_path: window.location.pathname,
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

/**
 * Emits a `phone_click` event for `location`. Pass the originating click event
 * when one is available so a click the delegated listener also observes still
 * produces exactly one event.
 */
export function trackPhoneClick(location: string, event?: Event) {
  if (event && handledClicks.has(event)) return;
  if (event) handledClicks.add(event);
  emitPhoneClick(location);
}

// Track every tel: link on the site so phone-click measurement does not depend
// on a specific React component's click handler.
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
