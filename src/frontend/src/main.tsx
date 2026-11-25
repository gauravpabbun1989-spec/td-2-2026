import { InternetIdentityProvider } from "@caffeineai/core-infrastructure";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ReactDOM from "react-dom/client";

import App from "./App";
import "./index.css";
// Registers the document-level tel: click listener exactly once at startup so
// every phone click fires a single GA4 phone_click event.
import "./lib/analytics";
import { capturePaidClickAttribution } from "./lib/click-attribution";
import { recordTrafficClickIfNeeded } from "./lib/dni";

BigInt.prototype.toJSON = function () {
  return this.toString();
};

declare global {
  interface BigInt {
    toJSON(): string;
  }
}

// Capture both paid-click identifiers as one visit-scoped pair before rendering.
// The shared helper handles query aliases and independently guarded storage APIs.
try {
  const attribution = capturePaidClickAttribution();
  if (attribution?.clickId) {
    void recordTrafficClickIfNeeded();
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


