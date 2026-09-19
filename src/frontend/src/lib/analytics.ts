export function trackPhoneClick(location: string) {
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

  // Queue the event if the Google tag script has not finished loading yet.
  win.dataLayer = win.dataLayer || [];
  win.dataLayer.push(["event", "phone_click", eventParams]);
}
