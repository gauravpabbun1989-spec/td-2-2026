function sendPhoneClick(location: string) {
  if (typeof window === "undefined") return;

  const eventParams = {
    cta_location: location,
    page_path: window.location.pathname,
    page_title: document.title,
  };

  const win = window as typeof window & {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  };

  if (win.gtag) {
    win.gtag("event", "phone_click", eventParams);
    return;
  }

  win.dataLayer = win.dataLayer || [];
  win.dataLayer.push(["event", "phone_click", eventParams]);
}

export function trackPhoneClick(location: string) {
  sendPhoneClick(location);
}

// Track every tel: link on the site so phone-click measurement does not depend
// on a specific React component's click handler.
if (typeof document !== "undefined") {
  document.addEventListener("click", (event) => {
    const target = event.target as Element | null;
    const link = target?.closest?.('a[href^="tel:"]');

    if (!link) return;

    const location =
      link.getAttribute("data-ocid") ||
      link.getAttribute("aria-label") ||
      "tel_link";

    sendPhoneClick(location);
  });
}
