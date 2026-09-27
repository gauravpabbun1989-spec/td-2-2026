/**
 * GA4 conversion and engagement instrumentation.
 *
 * The site uses a single document-level listener for tel: links so phone
 * clicks are measured consistently across shared and page-specific CTAs.
 * No PII is sent to GA4.
 */

const DEDUPE_WINDOW_MS = 250;
const LANDING_PAGE_KEY = "ticketdepart_landing_page";
const ENGAGEMENT_EVENT_DELAY_MS = 10_000;
const SCROLL_THRESHOLDS = [25, 50, 75, 90] as const;
const handledClicks = new WeakSet<Event>();
const recentEmits = new Map<string, number>();
const emittedScrollDepths = new Set<number>();

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
    return raw.slice(0, cutAt).replace(/\/+$//, "") || "/";
  }

  return raw.replace(/\/+$//, "") || "/";
}

/** Ignore obvious scanner/probe paths in custom funnel events. */
function isSuspiciousPath(path = getCleanPagePath()) {
  return /(?:^|\/)(?:wp-admin|proc\/self|api\/uploads|api\/attachments|\.env|rclone\\.conf|var\/run\/secrets|document\\.php|dashboard\/\.env)(?:\/|$)/i.test(path);
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
  if (typeof window.matchMedia !== "function") return "unknown";
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

function normalizeCtaLocation(location: string) {
  const normalized = location
    .replace(/\\.(call_button|button|call_link)$/i, "")
    .replace(/\\.(phone_button|phone_link)$/i, "");

  if (normalized === "contact.success") return "callback_success";
  if (normalized === "mobile_call") return "sticky_mobile";
  return normalized;
}

function inferCtaLocation(link: Element | null, explicit?: string) {
  if (explicit) return normalizeCtaLocation(explicit);

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
    page_title: document.title,
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
  if (!win || isSuspiciousPath()) return;

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

function emitPhoneClick(location: string, link?: Element | null) {
  const ctaText = link?.textContent?.replace(/\\s+/g, " ").trim();

  recentEmits.set(location, Date.now());

  trackEvent("phone_click", {
    cta_location: location,
    ...(ctaText ? { cta_text: ctaText.slice(0, 120) } : {}),
  });
}

export function trackPhoneClick(location: string, event?: Event) {
  if (event && handledClicks.has(event)) return;
  if (event) handledClicks.add(event);

  const normalizedLocation = normalizeCtaLocation(location);
  const last = recentEmits.get(normalizedLocation);
  if (last !== undefined && Date.now() - last < DEDUPE_WINDOW_MS) return;

  emitPhoneClick(normalizedLocation);
}

export function trackCallbackFormStart(location = "contact_form") {
  trackEvent("callback_form_start", { callback_location: location });
}

export function trackCallbackFormSubmit(location = "contact_form") {
  trackEvent("callback_form_submit", { callback_location: location });
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
  trackEvent("callback_form_success", { callback_location: location });
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

  // A 10-second qualified-engagement signal gives CRO reporting a cleaner
  // human-intent metric than raw bounce rate alone.
  if (!isSuspiciousPath()) {
    window.setTimeout(() => {
      trackEvent("qualified_page_engagement", { engagement_seconds: 10 });
    }, ENGAGEMENT_EVENT_DELAY_MS);
  }

  const emitScrollDepth = () => {
    if (isSuspiciousPath()) return;

    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    if (scrollable <= 0) return;

    const depth = Math.round((window.scrollY / scrollable) * 100);
    for (const threshold of SCROLL_THRESHOLDS) {
      if (depth >= threshold && !emittedScrollDepths.has(threshold)) {
        emittedScrollDepths.add(threshold);
        trackEvent("scroll_depth", { percent_scrolled: threshold });
      }
    }
  };

  window.addEventListener("scroll", emitScrollDepth, { passive: true });

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
