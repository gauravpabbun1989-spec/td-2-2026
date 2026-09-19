export function trackPhoneClick(location: string) {
  if (typeof window === "undefined") return;

  const gtag = (
    window as typeof window & {
      gtag?: (...args: unknown[]) => void;
    }
  ).gtag;

  if (!gtag) return;

  gtag("event", "phone_click", {
    cta_location: location,
    page_path: window.location.pathname,
    page_title: document.title,
  });
}
