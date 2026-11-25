const ATTRIBUTION_STORAGE_KEY = "ticketdepart_paid_click_attribution_v1";
const TRAFFIC_CLICK_STORAGE_KEY = "ticketdepart_traffic_click";
const CLICKFLARE_STORAGE_KEY = "ticketdepart_clickflare_click";
const CLICK_TTL_MS = 90 * 24 * 60 * 60 * 1000;
const LEGACY_PAIR_MAX_SKEW_MS = 5 * 60 * 1000;

let memoryAttribution: PaidClickAttribution | null = null;

export type PaidClickAttribution = {
  clickId: string | null;
  clickFlareId: string | null;
  clickedAt: string;
  expiresAt: number;
  bannerId: string | null;
};

function normalizeClickId(value: string | null | undefined): string | null {
  const normalized = value?.trim() || "";
  return /^[A-Za-z0-9._~-]{1,200}$/.test(normalized) ? normalized : null;
}

function getParam(params: URLSearchParams, names: string[]): string | null {
  const wanted = new Set(names.map((name) => name.toLowerCase()));
  for (const [key, value] of params.entries()) {
    if (wanted.has(key.toLowerCase())) return value;
  }
  return null;
}

function readPairFromStorage(storage: Storage): PaidClickAttribution | null {
  try {
    const raw = storage.getItem(ATTRIBUTION_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<PaidClickAttribution>;
    const expiresAt = Number(parsed.expiresAt);
    if (!Number.isFinite(expiresAt) || expiresAt <= Date.now()) return null;
    const clickedAt = typeof parsed.clickedAt === "string" && !Number.isNaN(Date.parse(parsed.clickedAt))
      ? new Date(parsed.clickedAt).toISOString()
      : new Date().toISOString();
    return {
      clickId: normalizeClickId(parsed.clickId),
      clickFlareId: normalizeClickId(parsed.clickFlareId),
      clickedAt,
      expiresAt,
      bannerId: normalizeClickId(parsed.bannerId),
    };
  } catch {
    return null;
  }
}

function readLegacyPair(): PaidClickAttribution | null {
  try {
    const trafficRaw = window.localStorage.getItem(TRAFFIC_CLICK_STORAGE_KEY);
    const flareRaw = window.localStorage.getItem(CLICKFLARE_STORAGE_KEY);
    const traffic = trafficRaw ? JSON.parse(trafficRaw) as { clickId?: string; expiresAt?: number } : null;
    const flare = flareRaw ? JSON.parse(flareRaw) as { clickFlareId?: string; expiresAt?: number } : null;
    const clickId = normalizeClickId(traffic?.clickId);
    const clickFlareId = normalizeClickId(flare?.clickFlareId);
    const trafficExpiry = Number(traffic?.expiresAt);
    const flareExpiry = Number(flare?.expiresAt);
    const hasTraffic = Boolean(clickId && Number.isFinite(trafficExpiry) && trafficExpiry > Date.now());
    const hasFlare = Boolean(clickFlareId && Number.isFinite(flareExpiry) && flareExpiry > Date.now());
    if (!hasTraffic && !hasFlare) return null;

    // The previous implementation stored the two IDs independently. Only
    // migrate them as a pair when their expiry timestamps show they were
    // captured together, rather than combining unrelated old visits.
    const paired = hasTraffic && hasFlare && Math.abs(trafficExpiry - flareExpiry) <= LEGACY_PAIR_MAX_SKEW_MS;
    const now = Date.now();
    return {
      clickId: hasTraffic ? clickId : null,
      clickFlareId: paired ? clickFlareId : null,
      clickedAt: new Date(now).toISOString(),
      expiresAt: Math.max(hasTraffic ? trafficExpiry : 0, paired ? flareExpiry : 0),
      bannerId: null,
    };
  } catch {
    return null;
  }
}

function persistPair(pair: PaidClickAttribution) {
  const value = JSON.stringify(pair);
  try {
    window.sessionStorage.setItem(ATTRIBUTION_STORAGE_KEY, value);
  } catch {
    // Session storage can be blocked independently from persistent storage.
  }
  try {
    window.localStorage.setItem(ATTRIBUTION_STORAGE_KEY, value);
  } catch {
    // Persistent storage can be blocked independently from session storage.
  }
}

/**
 * Capture the TrafficStars external click ID and ClickFlare visit ID as one
 * visit-scoped pair. A new ID never inherits the other half from a different
 * visit. Storage failures are isolated so one blocked storage API cannot
 * prevent the other from retaining the pair or interrupt the call CTA.
 */
export function capturePaidClickAttribution(search?: string): PaidClickAttribution | null {
  if (typeof window === "undefined" && search === undefined) return null;

  const currentSearch = search ?? window.location.search;
  const params = new URLSearchParams(currentSearch);
  const urlClickId = normalizeClickId(getParam(params, ["click_id", "externalid", "external_id"]));
  const urlClickFlareId = normalizeClickId(getParam(params, ["cf_click_id", "clickflare_click_id"]));
  const bannerId = normalizeClickId(getParam(params, ["banner_id"]));

  let existing: PaidClickAttribution | null = null;
  if (typeof window !== "undefined") {
    try {
      existing = readPairFromStorage(window.sessionStorage);
    } catch {
      // Access to the session storage object itself may be denied.
    }
    if (!existing) {
      try {
        existing = readPairFromStorage(window.localStorage);
      } catch {
        // Access to the persistent storage object itself may be denied.
      }
    }
    if (!existing) {
      const memoryIsValid = memoryAttribution && memoryAttribution.expiresAt > Date.now();
      existing = memoryIsValid ? memoryAttribution : readLegacyPair();
    }
  }

  let pair: PaidClickAttribution | null = existing;
  if (urlClickId || urlClickFlareId) {
    const sameVisit = Boolean(existing) &&
      (!urlClickId || existing?.clickId === urlClickId) &&
      (!urlClickFlareId || existing?.clickFlareId === urlClickFlareId);

    if (sameVisit && existing) {
      pair = {
        ...existing,
        clickId: urlClickId || existing.clickId,
        clickFlareId: urlClickFlareId || existing.clickFlareId,
        bannerId: bannerId || existing.bannerId,
      };
    } else {
      const now = Date.now();
      pair = {
        clickId: urlClickId,
        clickFlareId: urlClickFlareId,
        clickedAt: new Date(now).toISOString(),
        expiresAt: now + CLICK_TTL_MS,
        bannerId,
      };
    }
  }

  if (pair && (pair.clickId || pair.clickFlareId)) {
    memoryAttribution = pair;
    if (typeof window !== "undefined") persistPair(pair);
  }

  return pair;
}
