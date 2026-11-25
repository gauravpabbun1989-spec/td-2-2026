import { SITE } from "@/lib/site";
import { useCallTrackingPhoneNumber } from "@/lib/dni";
import { Phone } from "lucide-react";

export function MobileCallBar() {
  const phone = useCallTrackingPhoneNumber();
  return (
    <div
      data-ocid="mobile_call.bar"
      className="fixed inset-x-0 bottom-0 z-[70] border-t border-white/10 bg-[#071a35]/95 px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] text-white shadow-[0_-12px_40px_-20px_rgba(0,0,0,0.5)] backdrop-blur-xl"
    >
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
        <div className="hidden min-w-0 flex-1 sm:block">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/55">Need flight reservation assistance?</p>
          <p className="mt-0.5 text-sm font-medium text-white/90">Speak with a reservation specialist about your trip.</p>
        </div>
        <a
          href={phone.ready ? phone.href : undefined}
          data-ocid="mobile_call.button"
          data-cta-location="sticky_mobile"
          aria-label={phone.ready ? `${SITE.ctaLabel}: ${phone.display}` : "Preparing call number"}
          aria-disabled={!phone.ready}
          aria-busy={!phone.ready}
          className={`flex min-h-12 w-full shrink-0 flex-wrap items-center justify-center gap-x-2 gap-y-0.5 rounded-full bg-accent px-3 py-2 text-xs font-bold text-accent-foreground shadow-[0_10px_24px_-12px_rgba(0,0,0,0.65)] transition-smooth hover:bg-accent/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:flex-nowrap sm:gap-2.5 sm:px-5 sm:text-sm sm:w-auto sm:min-w-[17rem] sm:shrink-0 ${!phone.ready ? "pointer-events-none opacity-70" : ""}`}
        >
          <Phone aria-hidden="true" className="size-4 shrink-0" />
          <span className="min-w-0 shrink-0 whitespace-nowrap text-center">{SITE.ctaLabel}</span>
          <span className="basis-full shrink-0 text-center text-[11px] leading-tight whitespace-nowrap sm:basis-auto sm:text-sm">{phone.ready ? phone.display : "Preparing call number…"}</span>
        </a>
      </div>
    </div>
  );
}
