import { SITE } from "@/lib/site";
import { capturePaidClickAttribution } from "@/lib/click-attribution";

const TRACKER_BASE_URL = "https://ticketdepart-call-tracker.gaurav-pabbun.workers.dev";
const CLICK_ENDPOINT = TRACKER_BASE_URL + "/click";

type CallPhone = { href: string; display: string; ready: true };

let clickRecordPromise: { key: string; promise: Promise<boolean> } | null = null;

/** Save the paired paid-click identifiers server-side; no additional phone numbers are allocated. */
export function recordTrafficClickIfNeeded(): Promise<boolean> {
  if (typeof window === "undefined") return Promise.resolve(false);
  const attribution = capturePaidClickAttribution();
  if (!attribution?.clickId) return Promise.resolve(false);

  const { clickId, clickFlareId, bannerId } = attribution;
  const requestKey = `${clickId}:${clickFlareId || ""}`;
  if (clickRecordPromise?.key === requestKey) return clickRecordPromise.promise;

  const url = new URL(CLICK_ENDPOINT);
  url.searchParams.set("click_id", clickId);
  if (clickFlareId) url.searchParams.set("cf_click_id", clickFlareId);
  url.searchParams.set("path", window.location.pathname);
  if (bannerId) url.searchParams.set("banner_id", bannerId);

  const promise = fetch(url.toString(), {
    method: "GET",
    mode: "cors",
    credentials: "omit",
    cache: "no-store",
    keepalive: true,
    referrerPolicy: "no-referrer",
  }).then((response) => response.ok).catch(() => false).then((ok) => {
    if (!ok && clickRecordPromise?.key === requestKey) clickRecordPromise = null;
    return ok;
  });
  clickRecordPromise = { key: requestKey, promise };
  return promise;
}

/** Every caller continues dialing the one published toll-free number. */
export function useCallTrackingPhoneNumber(): CallPhone {
  return { href: SITE.phoneHref, display: SITE.phoneDisplay, ready: true };
}
