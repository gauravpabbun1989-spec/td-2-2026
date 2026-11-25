import { useEffect, useState } from "react";
import { SITE } from "@/lib/site";

const TRACKER_BASE_URL = "https://ticketdepart-call-tracker.gaurav-pabbun.workers.dev";
const CLICK_ENDPOINT = TRACKER_BASE_URL + "/click";
const DNI_ENDPOINT = TRACKER_BASE_URL + "/dni/assign";
const CLICK_STORAGE_KEY = "ticketdepart_traffic_click";
const CLICKFLARE_STORAGE_KEY = "ticketdepart_clickflare_click_id";

type DniPhone = { href: string; display: string; ready: boolean };
type DniResponse = { ok?: boolean; assigned?: boolean; did?: string };

const fallbackPhone: DniPhone = { href: SITE.phoneHref, display: SITE.phoneDisplay, ready: true };

let cachedPhone: DniPhone | null = null;
let pendingAssignment: Promise<DniPhone | null> | null = null;
let clickRecordPromise: Promise<boolean> | null = null;

function normalizeClickId(value: string | null): string | null {
  const normalized = value?.trim() || "";
  return /^[A-Za-z0-9._~-]{1,200}$/.test(normalized) ? normalized : null;
}

function formatDid(did: string): string | null {
  const digits = did.replace(/\D/g, "");
  if (!/^1?\d{10}$/.test(digits)) return null;
  const national = digits.length === 11 ? digits.slice(1) : digits;
  return `+1-${national.slice(0, 3)}-${national.slice(3, 6)}-${national.slice(6)}`;
}

function getClickIds() {
  const params = new URLSearchParams(window.location.search);
  const clickIdFromUrl = normalizeClickId(params.get("click_id") || params.get("externalid") || params.get("external_id"));
  let clickId = clickIdFromUrl;
  if (!clickId) {
    try {
      const stored = window.localStorage.getItem(CLICK_STORAGE_KEY);
      if (stored) {
        const record = JSON.parse(stored) as { clickId?: string; expiresAt?: number };
        if (record.expiresAt && record.expiresAt > Date.now()) {
          clickId = normalizeClickId(record.clickId || null);
        }
      }
    } catch {
      // Tracking must never block a phone call.
    }
  }

  const incomingClickFlareId = normalizeClickId(
    params.get("cf_click_id"),
  );
  let clickFlareId = incomingClickFlareId;
  try {
    if (clickFlareId) {
      window.sessionStorage.setItem(CLICKFLARE_STORAGE_KEY, clickFlareId);
    } else {
      clickFlareId = normalizeClickId(window.sessionStorage.getItem(CLICKFLARE_STORAGE_KEY));
    }
  } catch {
    // The current landing URL still supplies the click ID when storage is blocked.
  }
  return { clickId, clickFlareId };
}

function hasPaidClickContext(): boolean {
  if (typeof window === "undefined") return false;
  const { clickId, clickFlareId } = getClickIds();
  return Boolean(clickId && clickFlareId);
}

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
    const attempt = fetch(url.toString(), {
      method: "GET",
      mode: "cors",
      credentials: "omit",
      cache: "no-store",
      keepalive: true,
      referrerPolicy: "no-referrer",
    }).then((response) => response.ok).catch(() => false);
    clickRecordPromise = attempt.then((ok) => {
      if (!ok) clickRecordPromise = null;
      return ok;
    });
  }
  return clickRecordPromise;
}

async function requestDniAssignment(): Promise<DniPhone | null> {
  const { clickId, clickFlareId } = getClickIds();
  if (!clickId || !clickFlareId) return null;
  try {
    let clickRecorded = await recordTrafficClickIfNeeded();
    if (!clickRecorded) clickRecorded = await recordTrafficClickIfNeeded();
    if (!clickRecorded) return null;
    const response = await fetch(DNI_ENDPOINT, {
      method: "POST",
      mode: "cors",
      credentials: "omit",
      headers: { "Content-Type": "text/plain;charset=UTF-8" },
      body: JSON.stringify({ click_id: clickId, clickflare_click_id: clickFlareId }),
    });
    if (!response.ok) return null;
    const data = await response.json() as DniResponse;
    if (data.ok !== true || data.assigned !== true || !data.did) return null;
    const display = formatDid(data.did);
    if (!display) return null;
    return { href: `tel:+${data.did.replace(/\D/g, "")}`, display, ready: true };
  } catch {
    return null;
  }
}

/** Paid visitors receive a server-assigned DID; direct PSTN calls are attributed by the DID, not browser state. */
export function useDniPhoneNumber(): DniPhone {
  const [phone, setPhone] = useState<DniPhone>(() => ({
    ...fallbackPhone,
    ready: !hasPaidClickContext(),
  }));

  useEffect(() => {
    if (cachedPhone) {
      setPhone(cachedPhone);
      return;
    }
    const { clickId, clickFlareId } = getClickIds();
    if (!clickId || !clickFlareId) {
      setPhone(fallbackPhone);
      return;
    }
    if (!pendingAssignment) {
      pendingAssignment = requestDniAssignment().then((assigned) => {
        if (assigned) cachedPhone = assigned;
        return assigned;
      });
    }
    let active = true;
    void pendingAssignment.then((assigned) => {
      if (!active) return;
      setPhone(assigned || fallbackPhone);
    });
    return () => { active = false; };
  }, []);

  return phone;
}
