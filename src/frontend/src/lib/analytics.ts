/**
 * GA4 conversion instrumentation.
 *
 * The site uses a single document-level listener for tel: links so phone
 * clicks are measured consistently across shared and page-specific CTAs.
 * No PII is sent to GA4.
 */

const DEDUPE_WINDOW_MS = 250;
const LANDING_PAGE_KEY = "ticketdepart_landing_page";
const handledClicks = new WeakSet<Event>();
const recentEmits = new Map<string, number>();

type AnalyticsWindow = Window & {
  gtag?: (...args: unknown[]) => void;
  dataLayer?: unknown[];
};

function getWindow(): AnalyticsWindow | null {
  if (typeof window === "undefined") return null;
  return window as AnalyticsWindow;
}

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

  return raw.replace(/\/+$/, "") || "/";
}

function getLandingPage() {
  if (typeof window === "undefined") return "/";

  try {
    const existing = window.sessionStorage.getItem(LANDING_PAGE_KEY);
    if (existing) return existing;

    const current = getCleanPagePath();
    window.sessionStorage.setItem(LANDING_PAGE_KEY, current);
    return current;
  } catch {
    return getCleanPagePath();
  }
}

function getDeviceCategory() {
  if (typeof window === "undefined") return "unknown";
  return window.matchMedia("(max-width: 767px)").matches ? "mobile" : "desktop";
}

function getTrafficContext() {
  if (typeof window === "undefined") {
    return { source: "unknown", medium: "unknown" };
  }

  const params = new URLSearchParams(window.location.search);
  const utmSource = params.get("utm_source")?.trim();
  const utmMedium = params.get("utm_medium")?.trim();

  if (utmSource || utmMedium) {
    return {
      source: utmSource || "unknown",
      medium: utmMedium || "unknown",
    };
  }

  if (!document.referrer) {
    return { source: "direct", medium: "none" };
  }

  try {
    return {
      source: new URL(document.referrer).hostname || "referral",
      medium: "referral",
    };
  } catch {
    return { source: "referral", medium: "referral" };
  }
}

function inferCtaLocation(link: Element | null, explicit?: string) {
  if (explicit) return explicit;

  const marker =
    link?.getAttribute("data-ocid") ||
    link?.getAttribute("aria-label") ||
    "";

  if (marker.includes("mobile_call")) return "sticky_mobile";
  if (marker.includes("header")) return "header";
  if (marker.includes("footer")) return "footer";
  if (marker.includes("success")) return "callback_success";
  if (marker.includes("hero")) return "hero";
  return "content";
}

function buildCommonParams() {
  const traffic = getTrafficContext();

  return {
    page_path: getCleanPagePath(),
    landing_page: getLandingPage(),
    device_category: getDeviceCategory(),
    source: traffic.source,
    medium: traffic.medium,
  };
}

export function trackEvent(
  eventName: string,
  params: Record<string, string | number | boolean | undefined> = {},
) {
  const win = getWindow();
  if (!win) return;

  const eventParams = {
    ...buildCommonParams(),
    ...params,
  };

  if (win.gtag) {
    win.gtag("event", eventName, eventParams);
    return;
  }

  win.dataLayer = win.dataLayer || [];
  win.dataLayer.push(["event", eventName, eventParams]);
}

function emitPhoneClick(
  location: string,
  link?: Element | null,
) {
  const ctaText = link?.textContent?.replace(/\s+/g, " ").trim();

  recentEmits.set(location, Date.now());

  trackEvent("phone_click", {
    cta_location: location,
    ...(ctaText ? { cta_text: ctaText.slice(0, 120) } : {}),
  });
}

export function trackPhoneClick(location: string, event?: Event) {
  if (event && handledClicks.has(event)) return;
  if (event) handledClicks.add(event);
  emitPhoneClick(location);
}

export function trackCallbackFormStart(location = "contact_form") {
  trackEvent("callback_form_start", {
    callback_location: location,
  });
}

export function trackCallbackFormSubmit(location = "contact_form") {
  trackEvent("callback_form_submit", {
    callback_location: location,
  });
}

export function trackCallbackFormError(
  location = "contact_form",
  reason = "submission",
) {
  trackEvent("callback_form_error", {
    callback_location: location,
    error_reason: reason,
  });
}

export function trackCallbackFormSuccess(location = "contact_form") {
  trackEvent("callback_form_success", {
    callback_location: location,
  });
}

/**
 * Preserves the existing generate_lead conversion while keeping callback
 * success separately measurable. No submitted form fields are included.
 */
export function trackLeadSubmit(location = "contact_form") {
  trackCallbackFormSuccess(location);
  trackEvent("generate_lead", {
    lead_type: "callback_request",
    lead_location: location,
  });
}

if (typeof document !== "undefined") {
  try {
    const current = getCleanPagePath();
    if (!window.sessionStorage.getItem(LANDING_PAGE_KEY)) {
      window.sessionStorage.setItem(LANDING_PAGE_KEY, current);
    }
  } catch {
    // Session storage may be unavailable in privacy-restricted browsers.
  }

  document.addEventListener("click", (event) => {
    if (handledClicks.has(event)) return;

    const target = event.target as Element | null;
    const link = target?.closest?.('a[href^="tel:"]');

    if (!link) return;

    handledClicks.add(event);

    const location = inferCtaLocation(
      link,
      link.getAttribute("data-cta-location") || undefined,
    );

    const last = recentEmits.get(location);
    if (last !== undefined && Date.now() - last < DEDUPE_WINDOW_MS) return;

    emitPhoneClick(location, link);
  });
}
