import { SITE } from "@/lib/site";
import { Phone } from "lucide-react";

export function MobileCallBar() {
  return (
    <div
      data-ocid="mobile_call.bar"
      className="fixed inset-x-0 bottom-0 z-[70] border-t border-white/10 bg-[#071a35]/95 px-4 py-3 text-white shadow-[0_-12px_40px_-20px_rgba(0,0,0,0.5)] backdrop-blur-xl"
    >
      <div className="mx-auto flex w-full max-w-7xl items-center justify-center gap-3">
        <div className="hidden min-w-0 sm:block">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/55">Need flight assistance?</p>
          <p className="mt-0.5 text-sm font-medium text-white/90">Speak with a reservation specialist.</p>
        </div>
        <a
          href={SITE.phoneHref}
          data-ocid="mobile_call.button"
          data-cta-location="sticky_mobile"
          aria-label={`${SITE.ctaLabel}: ${SITE.phoneDisplay}`}
          className="flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-accent px-3 text-xs sm:gap-2.5 sm:px-5 sm:text-sm font-bold text-accent-foreground shadow-[0_10px_24px_-12px_rgba(0,0,0,0.65)] transition-smooth hover:bg-accent/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:w-auto sm:min-w-[20rem]"
        >
          <Phone aria-hidden="true" className="size-4 shrink-0" />
          <span>Call for Flight Assistance</span>
          <span className="whitespace-nowrap">{SITE.phoneDisplay}</span>
        </a>
      </div>
    </div>
  );
}
