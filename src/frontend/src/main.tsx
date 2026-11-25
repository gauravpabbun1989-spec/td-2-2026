import { InternetIdentityProvider } from "@caffeineai/core-infrastructure";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ReactDOM from "react-dom/client";

import App from "./App";
import "./index.css";
// Registers the document-level tel: click listener exactly once at startup so
// every phone click fires a single GA4 phone_click event.
import "./lib/analytics";
import { recordTrafficClickIfNeeded } from "./lib/dni";

BigInt.prototype.toJSON = function () {
  return this.toString();
};

declare global {
  interface BigInt {
    toJSON(): string;
  }
}

// Capture and persist the TrafficStars click ID before the app renders.
// Click recording is shared with the DNI hook so assignment waits for the click row.
const CLICK_STORAGE_KEY = "ticketdepart_traffic_click";
const CLICK_TTL_MS = 90 * 24 * 60 * 60 * 1000;

try {
  const params = new URLSearchParams(window.location.search);
  const incomingClickId = (params.get("click_id") || params.get("externalid") || params.get("external_id"))?.trim();
  if (incomingClickId && /^[A-Za-z0-9._~-]{1,200}$/.test(incomingClickId)) {
    const record = {
      clickId: incomingClickId,
      expiresAt: Date.now() + CLICK_TTL_MS,
    };
    window.localStorage.setItem(CLICK_STORAGE_KEY, JSON.stringify(record));
    const clickFlareId = params.get("cf_click_id");
    if (clickFlareId && /^[A-Za-z0-9._~-]{1,200}$/.test(clickFlareId.trim())) {
      const normalizedClickFlareId = clickFlareId.trim();
      window.sessionStorage.setItem("ticketdepart_clickflare_click_id", normalizedClickFlareId);
      window.localStorage.setItem("ticketdepart_clickflare_click", JSON.stringify({
        clickFlareId: normalizedClickFlareId,
        expiresAt: Date.now() + CLICK_TTL_MS,
      }));
    }
    void recordTrafficClickIfNeeded();
  } else {
    const stored = window.localStorage.getItem(CLICK_STORAGE_KEY);
    if (stored) {
      const record = JSON.parse(stored) as { clickId?: string; expiresAt?: number };
      if (!record.clickId || !record.expiresAt || record.expiresAt <= Date.now()) {
        window.localStorage.removeItem(CLICK_STORAGE_KEY);
      }
    }
  }
} catch {
  // Tracking must never prevent the booking-assistance site from rendering.
}

const queryClient = new QueryClient();
const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("TicketDepart root element was not found.");
}

const root = ReactDOM.createRoot(rootElement);

root.render(
  <QueryClientProvider client={queryClient}>
    <InternetIdentityProvider>
      <App />
    </InternetIdentityProvider>
  </QueryClientProvider>,
);


