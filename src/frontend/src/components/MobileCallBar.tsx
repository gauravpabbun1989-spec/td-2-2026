import { SITE } from "@/lib/site";
import { Phone } from "lucide-react";

/**
 * Fixed bottom conversion bar for small screens. Keeps the phone number one
 * tap away on the mobile Google-search traffic this site is built for.
 */
export function MobileCallBar() {
  return (
    <div
      data-ocid="mobile_call.bar"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-card/85 sm:hidden"
    >
      <a
        href={SITE.phoneHref}
        data-ocid="mobile_call.button"
        aria-label={`${SITE.ctaLabel} at ${SITE.phoneDisplay}`}
        className="flex min-h-12 w-full items-center justify-center gap-2.5 rounded-full bg-accent px-5 text-sm font-semibold text-accent-foreground shadow-subtle transition-smooth hover:bg-accent/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <Phone aria-hidden="true" className="size-4 shrink-0" />
        <span className="truncate">
          {SITE.ctaLabel} · {SITE.phoneDisplay}
        </span>
      </a>
    </div>
  );
}
