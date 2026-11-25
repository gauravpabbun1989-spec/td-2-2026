import { SITE } from "@/lib/site";

const TRACKER_BASE_URL = "https://ticketdepart-call-tracker.gaurav-pabbun.workers.dev";
const CLICK_ENDPOINT = TRACKER_BASE_URL + "/click";
const CLICK_STORAGE_KEY = "ticketdepart_traffic_click";
const CLICKFLARE_STORAGE_KEY = "ticketdepart_clickflare_click_id";

type CallPhone = { href: string; display: string; ready: true };

function normalizeClickId(value: string | null): string | null {
  const normalized = value?.trim() || "";
  return /^[A-Za-z0-9._~-]{1,200}$/.test(normalized) ? normalized : null;
}

function getClickIds() {
  const params = new URLSearchParams(window.location.search);
  let clickId = normalizeClickId(params.get("click_id") || params.get("externalid") || params.get("external_id"));
  if (!clickId) {
    try {
      const stored = window.localStorage.getItem(CLICK_STORAGE_KEY);
      if (stored) {
        const record = JSON.parse(stored) as { clickId?: string; expiresAt?: number };
        if (record.expiresAt && record.expiresAt > Date.now()) clickId = normalizeClickId(record.clickId || null);
      }
    } catch {
      // Tracking storage must never block a call.
    }
  }

  let clickFlareId = normalizeClickId(params.get("cf_click_id"));
  try {
    if (clickFlareId) window.sessionStorage.setItem(CLICKFLARE_STORAGE_KEY, clickFlareId);
    else clickFlareId = normalizeClickId(window.sessionStorage.getItem(CLICKFLARE_STORAGE_KEY));
  } catch {
    // The URL remains available for this page view.
  }
  return { clickId, clickFlareId };
}

let clickRecordPromise: Promise<boolean> | null = null;

/** Save the paid click pair server-side; no extra tracking telephone numbers are allocated. */
export function recordTrafficClickIfNeeded(): Promise<boolean> {
  if (typeof window === "undefined") return Promise.resolve(false);
  const { clickId, clickFlareId } = getClickIds();
  if (!clickId) return Promise.resolve(false);
  if (!clickRecordPromise) {
    const url = new URL(CLICK_ENDPOINT);
    url.searchParams.set("click_id", clickId);
    if (clickFlareId) url.searchParams.set("cf_click_id", clickFlareId);
    url.searchParams.set("path", window.location.pathname);
    const bannerId = new URLSearchParams(window.location.search).get("banner_id");
    if (bannerId) url.searchParams.set("banner_id", bannerId);
    clickRecordPromise = fetch(url.toString(), {
      method: "GET",
      mode: "cors",
      credentials: "omit",
      cache: "no-store",
      keepalive: true,
      referrerPolicy: "no-referrer",
    }).then((response) => response.ok).catch(() => false).then((ok) => {
      if (!ok) clickRecordPromise = null;
      return ok;
    });
  }
  return clickRecordPromise;
}

/** Every caller continues dialing the one published toll-free number. */
export function useCallTrackingPhoneNumber(): CallPhone {
  return { href: SITE.phoneHref, display: SITE.phoneDisplay, ready: true };
}
