import { CallCta } from "@/components/CallCta";
import { trackEvent } from "@/lib/analytics";
import { Clock3, Headset, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useRouterState } from "@tanstack/react-router";

const DISMISSED_KEY = "ticketdepart_call_now_popup_dismissed_v2";
const POPUP_SHOW_DELAY_MS = 100;
const CALL_PROMPT_DELAY_MS = 9000;

export function CallNowPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [isCallPromptActive, setIsCallPromptActive] = useState(false);
  const hasShownThisSession = useRef(false);
  const hasDismissedPopup = useRef(false);
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const pathnameRef = useRef(pathname);

  useEffect(() => {
    pathnameRef.current = pathname;
  }, [pathname]);

  useEffect(() => {
    if (typeof window === "undefined" || pathnameRef.current.startsWith("/admin")) return;
    if (hasShownThisSession.current) return;

    try {
      // Only an explicit dismissal suppresses the popup for this tab session.
      // A legacy "shown" flag must not prevent a fresh direct visit from seeing it.
      if (window.sessionStorage.getItem(DISMISSED_KEY) === "1") {
        hasShownThisSession.current = true;
        hasDismissedPopup.current = true;
        return;
      }
    } catch {
      // In-memory refs still prevent repeated behavior while this component remains mounted.
    }

    const popupTimer = window.setTimeout(() => {
      hasShownThisSession.current = true;
      const landingPath = pathnameRef.current;
      setIsOpen(true);
      trackEvent("call_now_popup_impression", {
        popup_location: "sitewide_modal",
        landing_path: landingPath,
      });
    }, POPUP_SHOW_DELAY_MS);

    // After nine seconds, visually prompt the visitor to tap the existing call button.
    // Browsers can block timer-triggered tel: navigation, so preserve the visitor's
    // control and let the existing CTA open the dialer after a tap. Never prompt after X.
    const callPromptTimer = window.setTimeout(() => {
      if (hasDismissedPopup.current || document.visibilityState === "hidden") return;
      setIsCallPromptActive(true);
      window.requestAnimationFrame(() => {
        document
          .querySelector<HTMLAnchorElement>('[data-ocid="call_now_popup.call_button"]')
          ?.focus({ preventScroll: true });
      });
      trackEvent("call_dialer_prompt_shown", {
        delay_ms: CALL_PROMPT_DELAY_MS,
        landing_path: pathnameRef.current,
      });
    }, CALL_PROMPT_DELAY_MS);

    return () => {
      window.clearTimeout(popupTimer);
      window.clearTimeout(callPromptTimer);
    };
  }, []);

  const dismissPopup = useCallback(() => {
    setIsOpen(false);
    hasShownThisSession.current = true;
    hasDismissedPopup.current = true;
    setIsCallPromptActive(false);
    try {
      window.sessionStorage.setItem(DISMISSED_KEY, "1");
      // Retain the legacy key for compatibility, but it is no longer used to suppress display.
      window.sessionStorage.setItem("ticketdepart_call_now_popup_shown_v2", "1");
    } catch {
      // In-memory dismissal still works when browser storage is blocked.
    }
    trackEvent("call_now_popup_dismiss", {
      popup_location: "sitewide_modal",
      landing_path: pathnameRef.current,
    });
  }, []);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] grid min-h-dvh place-items-center overflow-y-auto bg-slate-950/60 p-3 backdrop-blur-sm">
      <dialog
        open
        aria-modal="true"
        aria-labelledby="call-now-popup-title"
        aria-describedby="call-now-popup-description"
        className="relative m-0 my-auto max-h-[calc(100dvh-1.5rem)] w-full max-w-md overflow-y-auto rounded-3xl border border-white/20 bg-background p-0 text-foreground shadow-2xl"
      >
        <div className="relative overflow-hidden bg-primary px-6 pb-7 pt-8 text-primary-foreground sm:px-8">
          <div aria-hidden="true" className="absolute -right-8 -top-12 size-40 rounded-full border-[24px] border-white/10" />
          <button
            type="button"
            onClick={dismissPopup}
            aria-label="Close call assistance popup"
            data-ocid="call_now_popup.close_button"
            className="absolute right-4 top-4 z-10 inline-flex size-9 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <X className="size-5" />
          </button>
          <div className="relative flex size-14 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/20">
            <Headset aria-hidden="true" className="size-7" />
          </div>
          <p className="relative mt-5 text-xs font-bold uppercase tracking-[0.18em] text-white/75">TicketDepart · Flight assistance</p>
          <h2 id="call-now-popup-title" className="relative mt-2 text-balance text-2xl font-bold leading-tight sm:text-3xl">
            Need help planning your next flight?
          </h2>
          <p id="call-now-popup-description" className="relative mt-3 text-sm leading-6 text-white/85">
            Talk through your route, travel dates, cabin, baggage or booking options with an independent travel specialist.
          </p>
        </div>

        <div className="px-6 pb-6 pt-5 sm:px-8 sm:pb-7">
          <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Clock3 aria-hidden="true" className="size-5" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground">Travel assistance, 24/7</p>
              <p className="mt-0.5 text-xs leading-5 text-muted-foreground">Call when it suits you. A specialist can discuss the options.</p>
            </div>
          </div>

          {isCallPromptActive && (
            <output
              aria-live="polite"
              className="mt-4 block rounded-xl border-2 border-primary bg-primary/10 p-3 text-center motion-safe:animate-pulse"
            >
              <p className="text-sm font-bold text-foreground">Ready to speak with a flight specialist?</p>
              <p className="mt-1 text-base font-extrabold tracking-wide text-primary">+1-888-958-0280</p>
              <p className="mt-1 text-xs text-muted-foreground">Tap the call button below to open your phone dialer.</p>
            </output>
          )}

          <CallCta
            size="lg"
            showNumber
            ctaLocation="call_now_popup"
            ocid="call_now_popup.call_button"
            className={`mt-5 flex min-h-14 w-full rounded-2xl ${isCallPromptActive ? "ring-4 ring-primary/40 motion-safe:animate-pulse" : ""}`}
          />
        </div>
      </dialog>
    </div>,
    document.body,
  );
}
