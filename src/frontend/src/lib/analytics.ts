/**
 * GA4 conversion and engagement instrumentation.
 *
 * The site uses a single document-level listener for tel: links so phone
 * clicks are measured consistently across shared and page-specific CTAs.
 * No PII is sent to GA4.
 */

import { capturePaidClickAttribution } from "@/lib/click-attribution";

const DEDUPE_WINDOW_MS = 250;

const US_TIMEZONES = new Set([
  "America/New_York",
  "America/Detroit",
  "America/Indiana/Indianapolis",
  "America/Indiana/Knox",
  "America/Indiana/Marengo",
  "America/Indiana/Petersburg",
  "America/Indiana/Tell_City",
  "America/Indiana/Vevay",
  "America/Indiana/Vincennes",
  "America/Indiana/Winamac",
  "America/Kentucky/Louisville",
  "America/Kentucky/Monticello",
  "America/Chicago",
  "America/Menominee",
  "America/North_Dakota/Beulah",
  "America/North_Dakota/Center",
  "America/North_Dakota/New_Salem",
  "America/Denver",
  "America/Boise",
  "America/Phoenix",
  "America/Los_Angeles",
  "America/Anchorage",
  "America/Juneau",
  "America/Sitka",
  "America/Metlakatla",
  "America/Yakutat",
  "America/Nome",
  "America/Adak",
  "Pacific/Honolulu",
]);

/** Identify explicit QA sessions and Google Tag Assistant preview traffic. */
export function isAnalyticsTestReferrer(referrer: string) {
  if (!referrer) return false;
  try {
    const hostname = new URL(referrer).hostname.toLowerCase();
    return (
      hostname === "tagassistant.google.com" ||
      hostname === "tagassistant.googleusercontent.com"
    );
  } catch {
    return false;
  }
}

export function isAnalyticsTestSession(
  search?: string,
  referrer?: string,
) {
  if (typeof window === "undefined" && search === undefined && referrer === undefined) {
    return false;
  }

  // Suppress only identifiable QA/preview sessions. Do not persist this
  // decision in sessionStorage: a later real visitor action in the same tab
  // must not inherit a previous Tag Assistant preview exclusion.
  const currentSearch = search ?? window.location.search;
  const currentReferrer = referrer ?? document.referrer;
  const params = new URLSearchParams(currentSearch);

  return (
    params.get("td_analytics_debug") === "1" ||
    params.has("gtm_debug") ||
    params.has("gtm_preview") ||
    isAnalyticsTestReferrer(currentReferrer)
  );
}

const LANDING_PAGE_KEY = "ticketdepart_landing_page";
const FUNNEL_ENTRY_KEY = "ticketdepart_funnel_entry_sent";
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
    return raw.slice(0, cutAt).replace(/\/+$/, "") || "/";
  }

  return raw.replace(/\/+$/, "") || "/";
}

/** Decode repeated URL encoding before checking known scanner/probe paths. */
function normalizePathForProbeCheck(path: string) {
  let decoded = path.toLowerCase();

  // Security scanners often encode path separators and dot-file names.
  // Decode a bounded number of times and stop safely on malformed escapes.
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const next = decodeURIComponent(decoded);
      if (next === decoded) break;
      decoded = next;
    } catch {
      break;
    }
  }

  return decoded.replace(/\\/g, "/").replace(/\/+$/, "") || "/";
}

/** Ignore scanner/probe paths so automated security scans do not pollute funnel metrics. */
export function isSuspiciousPath(path = getCleanPagePath()) {
  const normalized = normalizePathForProbeCheck(path);
  const exactProbePaths = new Set([
    "/.env", "/.env::$data", "/.env.local", "/.env.production", "/.flaskenv", "/.htpasswd",
    "/.git", "/.git/config", "/.git-secret", "/.hg", "/.svn", "/.dockerenv",
    "/.bashrc", "/.npmrc", "/.zshrc", "/.circleci/config.yml", "/.next",
    "/.aws/credentials", "/.ssh", "/id_rsa", "/etc/passwd",
    "/wp-login.php", "/wp-config.php", "/wp-json", "/xmlrpc.php",
    "/phpinfo.php", "/php-info.php", "/config.php", "/composer.json",
    "/database.sql", "/dump.sql", "/backup.sql", "/server-status",
    "/server.key", "/key.pem", "/aws-credentials.txt", "/health",
    "/api", "/api/health", "/api/settings", "/api/account", "/api/config",
    "/api/env", "/api/v1/config", "/api/v1/env", "/api/v1/settings",
    "/webpack.config.js", "/debug/default/view", "/app_dev.php/_profiler/open",
    "/test_phpinfo5.php", "/serverless.yaml", "/ssl/server.key",
    "/proc/self/environ", "/var/run/secrets/kubernetes.io/serviceaccount/token",
    "/userfiles",
    "/**"
  ]);

  if (normalized.startsWith("//")) return true;
  if (exactProbePaths.has(normalized)) return true;

  return /(?:^|\/)(?:wp-admin|wp-includes|wp-content|phpmyadmin|cgi-bin|phpunit)(?:\/|$)/i.test(normalized)
    || /(?:^|\/)(?:config|credentials|secrets?|database|dump|backup|wp-config|phpinfo|php-info)\.(?:php|txt|json|sql|bak|old|save|yml|yaml)$/i.test(normalized)
    || /(?:^|\/)(?:\.env(?:\.[^/]+)?|\.git(?:-[^/]+)?|\.hg|\.svn|\.ssh|\.aws|\.next|\.circleci|\.docker|\.terraform|\.npmrc|\.yarnrc|\.flaskenv)(?:\/|$)/i.test(normalized)
    || /(?:^|\/)(?:var\/log|proc\/self|etc\/passwd|debug\/default\/view|app_dev\.php\/_profiler|_next\/webpack-hmr|webpack-hmr)(?:\/|$)/i.test(normalized)
    || /(?:^|\/)(?:\$\([^/]*\)|\$\{[^/]*\}|undefined|null)(?:\/|$)/i.test(normalized)
    || /\.(?:php|sql|tfstate|tfvars|toml|ini|conf|sh|lock|log|pem|key|bak|old|save|yaml|yml)$/i.test(normalized)
    || /(?:^|\/)(?:package\.json|docker-compose\.yml|serverless\.yml|webpack\.config\.js|terraform\.lock\.hcl)(?:\/|$)/i.test(normalized);
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


/**
 * Retain the TrafficStars click ID from the same captured visit as the
 * ClickFlare ID. The attribution helper rejects stale cross-visit pairs.
 */
function getTrafficStarsClickId(): string | undefined {
  return capturePaidClickAttribution()?.clickId ?? undefined;
}

function getIntentFamily(path = getCleanPagePath()) {
  if (/airlines|airline-reservation/i.test(path)) return "airline";
  if (/flight-(change|cancellation|booking-assistance|booking)|book-a-flight|international-flight|last-minute-flight|multi-city|group-flight|business-class|same-day|family-flight|pet-flight|infant-flight|baggage/i.test(path)) return "booking_service";
  if (/flights-from-|flights-[a-z-]+-to-[a-z-]+/i.test(path)) return "us_route";
  return path === "/" ? "homepage" : "content";
}

function getBrowserTimeContext() {
  try {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || "unknown";
    const hour = new Date().getHours();
    const usTimezone = US_TIMEZONES.has(timezone);
    return {
      browser_timezone: timezone,
      browser_local_hour: hour,
      browser_us_timezone: usTimezone,
    };
  } catch {
    return {
      browser_timezone: "unknown",
      browser_local_hour: -1,
      browser_us_timezone: false,
    };
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
    .replace(/\.(call_button|button|call_link)$/i, "")
    .replace(/\.(phone_button|phone_link)$/i, "");

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
    intent_family: getIntentFamily(),
    ...getBrowserTimeContext(),
  };
}

export function trackEvent(
  eventName: string,
  params: Record<string, string | number | boolean | undefined> = {},
) {
  const win = getWindow();
  if (!win || isSuspiciousPath() || isAnalyticsTestSession()) return;

  const eventParams = {
    ...buildCommonParams(),
    ...params,
    // A phone CTA immediately opens the device dialer. Prefer beacon transport
    // so the event has a better chance of reaching GA4 as the page backgrounds.
    ...(eventName === "phone_click" ? { transport_type: "beacon" } : {}),
  };

  if (win.gtag) {
    win.gtag("event", eventName, eventParams);
    return;
  }

  win.dataLayer = win.dataLayer || [];
  win.dataLayer.push(["event", eventName, eventParams]);
}

function createCallIntentId(): string {
  try {
    if (window.crypto?.randomUUID) return window.crypto.randomUUID();
  } catch {
    // Use the non-cryptographic fallback below on restricted browsers.
  }
  return `intent-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 14)}`;
}

function recordTrafficStarsCallIntent(attribution: PaidClickAttribution, location: string) {
  const { clickId, clickFlareId } = attribution;
  // A paid phone intent is valid only when both IDs from the same visit exist.
  if (!clickId || !clickFlareId) return;
  const endpoint = "https://ticketdepart-call-tracker.gaurav-pabbun.workers.dev/intent";
  try {
    const payload = {
      intent_id: createCallIntentId(),
      click_id: clickId,
      clickflare_click_id: clickFlareId,
      clicked_at: attribution.clickedAt,
      banner_id: attribution.bannerId ?? undefined,
      landing_path: getLandingPage(),
      page_path: getCleanPagePath(),
      cta_location: location,
      created_at: new Date().toISOString(),
    };
    const body = JSON.stringify(payload);

    // A keepalive fetch is the primary path: it survives the immediate tel:
    // navigation and works even when sendBeacon is unavailable. text/plain is
    // a CORS-safelisted content type accepted by the Worker without preflight.
    if (typeof fetch === "function") {
      void fetch(endpoint, {
        method: "POST",
        mode: "no-cors",
        credentials: "omit",
        keepalive: true,
        headers: { "Content-Type": "text/plain;charset=UTF-8" },
        body,
      }).catch(() => {
        try {
          if (navigator.sendBeacon) {
            navigator.sendBeacon(endpoint, new Blob([body], { type: "text/plain" }));
          }
        } catch {
          // Intent telemetry must never block the caller's phone action.
        }
      });
      return;
    }

    if (navigator.sendBeacon) {
      navigator.sendBeacon(endpoint, new Blob([body], { type: "text/plain" }));
    }
  } catch {
    // Intent telemetry must never block the caller's phone action.
  }
}

function emitPhoneClick(location: string, link?: Element | null) {
  const ctaText = link?.textContent?.replace(/\s+/g, " ").trim();

  recentEmits.set(location, Date.now());
  const paidClickAttribution = capturePaidClickAttribution();
  const trafficStarsClickId = paidClickAttribution?.clickId ?? undefined;
  if (paidClickAttribution?.clickId && paidClickAttribution.clickFlareId) {
    recordTrafficStarsCallIntent(paidClickAttribution, location);
  }

  trackEvent("phone_click", {
    conversion_stage: "phone_click",
    ...(trafficStarsClickId ? { trafficstars_click_id: trafficStarsClickId } : {}),
    intent_family: getIntentFamily(),
    cta_route: getCleanPagePath(),
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
  // A submit attempt is not a confirmed callback request.
  trackEvent("callback_form_submit", { callback_location: location });
}

export function trackCallbackRequest(location = "contact_form") {
  // Called only after the backend confirms that the lead was stored.
  trackEvent("callback_request", {
    callback_location: location,
    lead_status: "stored",
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

/**
 * CTA and popup impressions are intentionally not emitted as GA4 events.
 * Impressions are not leads. Keep lead reporting tied to explicit actions;
 * phone_click is a click-intent signal, not proof that a call connected.
 * Re-enable impression reporting only after key-event configuration and
 * reporting have been verified.
 */

if (typeof document !== "undefined") {
  // Capture TrafficStars click metadata on the landing page before SPA navigation.
  getTrafficStarsClickId();

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

  // Funnel entry is session-scoped: emit once for the first page in a session,
  // not on every route change/reload. The landing page remains session-stored.
  let funnelEntrySent = false;
  try {
    funnelEntrySent = window.sessionStorage.getItem(FUNNEL_ENTRY_KEY) === "1";
    if (!funnelEntrySent) window.sessionStorage.setItem(FUNNEL_ENTRY_KEY, "1");
  } catch {
    // If session storage is unavailable, fall back to one emission per module load.
  }
  if (!funnelEntrySent) {
    trackEvent("session_funnel_entry", {
      funnel_stage: "landing",
      funnel_entry_scope: "session",
      intent_family: getIntentFamily(),
    });
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

    // A tel: click is intent only. Never send a TrafficStars conversion here.
    // Goal 6487 is reserved for verified accepted calls from the call-tracking backend.
    emitPhoneClick(location, link);
  });
}
