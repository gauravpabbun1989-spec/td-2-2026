export function trackPhoneClick(location: string) {
  if (typeof window === "undefined") return;

  const eventParams = {
    cta_location: location,
    page_path: window.location.pathname,
    page_title: document.title,
  };

  const gtag = (
    window as typeof window & {
      gtag?: (...args: unknown[]) => void;
      dataLayer?: unknown[];
    }
  ).gtag;

  if (gtag) {
    gtag("event", "phone_click", eventParams);
    return;
  }

  // Queue the event if the Google tag script has not finished loading yet.
  // The gtag bootstrap in index.html drains this queue once available.
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(["event", "phone_click", eventParams]);
}
