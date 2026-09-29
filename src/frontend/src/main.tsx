import { InternetIdentityProvider } from "@caffeineai/core-infrastructure";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ReactDOM from "react-dom/client";

// The route HTML generator intentionally includes crawlable SEO content inside #root.
// React replaces that static content on startup. Keep the pre-React document hidden
// so visitors do not see a one-frame flash of the crawler fallback on any route.
import App from "./App";
import "./index.css";
// Registers the document-level tel: click listener exactly once at startup so
// every phone click fires a single GA4 phone_click event.
import "./lib/analytics";

BigInt.prototype.toJSON = function () {
  return this.toString();

requestAnimationFrame(() => {
  rootElement?.classList.remove("pre-react-render");
});
};

declare global {
  interface BigInt {
    toJSON(): string;
  }
}

const queryClient = new QueryClient();

const rootElement = document.getElementById("root");
if (rootElement) {
  rootElement.classList.add("pre-react-render");
}

ReactDOM.createRoot(rootElement!).render(
  <QueryClientProvider client={queryClient}>
    <InternetIdentityProvider>
      <App />
    </InternetIdentityProvider>
  </QueryClientProvider>,
);
