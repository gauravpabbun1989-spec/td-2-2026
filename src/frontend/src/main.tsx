import { InternetIdentityProvider } from "@caffeineai/core-infrastructure";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ReactDOM from "react-dom/client";

import App from "./App";
import "./index.css";
// Registers the document-level tel: click listener exactly once at startup so
// every phone click fires a single GA4 phone_click event.
import "./lib/analytics";

BigInt.prototype.toJSON = function () {
  return this.toString();
};

declare global {
  interface BigInt {
    toJSON(): string;
  }
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

// Remove the static first-paint shell after React has mounted so users never see
// an unstyled/code-like flash while the application bootstraps.
const initialLoader = document.getElementById("initial-loader");
if (initialLoader) initialLoader.remove();
rootElement.style.visibility = "visible";
