import { CallCta } from "@/components/CallCta";
import { AIRLINE_ITEMS, NAV_ITEMS, SITE } from "@/lib/site";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import { Menu, Phone, Plane, X } from "lucide-react";
import { useEffect, useState } from "react";

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previous; };
  }, [open]);

  return (
    <header data-ocid="site.header" className="sticky top-0 z-50 border-b border-border/70 bg-white/90 shadow-[0_4px_24px_-18px_rgba(8,24,48,0.35)] backdrop-blur-xl">
      <div className="mx-auto flex min-h-[4.25rem] w-full max-w-7xl items-center justify-between gap-2 px-4 sm:min-h-[4.5rem] sm:gap-4 sm:px-8 lg:h-20 lg:px-10">
        <Link to="/" data-ocid="site.logo_link" className="group flex items-center gap-3 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
          <span className="flex size-10 items-center justify-center rounded-xl bg-gradient-primary text-primary-foreground shadow-subtle transition-smooth group-hover:scale-105">
            <Plane aria-hidden="true" className="size-5 -rotate-45" />
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-display text-lg font-bold tracking-[-0.03em] text-foreground sm:text-xl">TicketDepart</span>
            <span className="mt-1 hidden text-[0.62rem] font-medium tracking-wide text-muted-foreground sm:block">Fly More. Worry Less.</span>
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden min-w-0 items-center gap-0.5 lg:flex xl:gap-1">
          <Link to="/" className="rounded-full px-2 py-2.5 text-xs font-semibold text-muted-foreground transition-smooth hover:bg-muted hover:text-foreground xl:px-2.5 xl:text-sm">Home</Link>
          <div className="relative">
            <details className="group">
              <summary className="cursor-pointer list-none rounded-full px-2 py-2.5 text-xs font-semibold text-muted-foreground transition-smooth hover:bg-muted hover:text-foreground sm:px-2.5 lg:text-[0.78rem] xl:px-3 xl:text-sm">Services</summary>
              <div className="absolute left-0 top-full z-50 mt-2 max-h-[min(70vh,32rem)] min-w-64 max-w-[calc(100vw-1rem)] overflow-y-auto overscroll-contain rounded-2xl border border-border bg-white p-2 shadow-elevated">
                {NAV_ITEMS.filter((item) => !["/", "/contact"].includes(item.to)).map((item) => (
                  <Link key={item.to} to={item.to} className="block rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground">{item.label}</Link>
                ))}
              </div>
            </details>
          </div>
          <div className="relative">
            <details className="group">
              <summary className="cursor-pointer list-none rounded-full px-2 py-2.5 text-xs font-semibold text-muted-foreground transition-smooth hover:bg-muted hover:text-foreground sm:px-2.5 lg:text-[0.78rem] xl:px-3 xl:text-sm">Menu</summary>
              <div className="absolute right-0 top-full z-50 mt-2 max-h-[min(70vh,32rem)] min-w-64 max-w-[calc(100vw-1rem)] overflow-y-auto overscroll-contain rounded-2xl border border-border bg-white p-2 shadow-elevated">
                {AIRLINE_ITEMS.map((item) => (
                  <Link key={item.to} to={item.to} className="block rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground">{item.label}</Link>
                ))}
              </div>
            </details>
          </div>
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={SITE.phoneHref}
            aria-label={"Call TicketDepart at " + SITE.phoneDisplay}
            data-ocid="header.call_button"
            data-cta-location="header"
            className="inline-flex h-10 shrink-0 items-center justify-center gap-1.5 rounded-full bg-accent px-2.5 text-[0.72rem] font-semibold tracking-tight text-accent-foreground shadow-subtle transition-smooth hover:scale-[1.02] hover:bg-accent/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:gap-2 sm:px-4 sm:text-sm"
          >
            <Phone aria-hidden="true" className="size-3.5 shrink-0 sm:size-4" />
            <span className="whitespace-nowrap">{SITE.phoneDisplay}</span>
          </a>
          <button type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-controls="mobile-nav-drawer" aria-label={open ? "Close navigation menu" : "Open navigation menu"} data-ocid="header.menu_toggle" className="inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-border bg-white text-foreground transition-smooth hover:bg-muted lg:hidden">
            {open ? <X aria-hidden="true" className="size-5" /> : <Menu aria-hidden="true" className="size-5" />}
          </button>
        </div>
      </div>

      {open ? (
        <div id="mobile-nav-drawer" data-ocid="header.mobile_drawer" className="max-h-[calc(100dvh-4.25rem)] overflow-y-auto overscroll-contain border-t border-border bg-white/95 backdrop-blur-xl lg:hidden">
          <nav aria-label="Mobile" className="mx-auto flex w-full max-w-7xl flex-col gap-1 px-4 py-4 sm:px-8">
            <Link to="/" onClick={() => setOpen(false)} className="rounded-xl px-4 py-3 text-base font-semibold text-muted-foreground hover:bg-muted hover:text-foreground">Home</Link>
            <details className="rounded-xl border border-border">
              <summary className="cursor-pointer list-none px-4 py-3 text-base font-semibold text-muted-foreground">Services</summary>
              <div className="border-t border-border px-2 py-2">
                {NAV_ITEMS.filter((item) => !["/", "/contact"].includes(item.to)).map((item) => (
                  <Link key={item.to} to={item.to} onClick={() => setOpen(false)} className="block rounded-xl px-3 py-3 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground">{item.label}</Link>
                ))}
              </div>
            </details>
            <details className="rounded-xl border border-border">
              <summary className="cursor-pointer list-none px-4 py-3 text-base font-semibold text-muted-foreground">Menu</summary>
              <div className="border-t border-border px-2 py-2">
                {AIRLINE_ITEMS.map((item) => (
                  <Link key={item.to} to={item.to} onClick={() => setOpen(false)} className="block rounded-xl px-3 py-3 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground">{item.label}</Link>
                ))}
              </div>
            </details>
            <div className="mt-3 flex flex-col gap-2 border-t border-border pt-4">
              <CallCta size="lg" className="w-full" ocid="mobile_nav.call_button" ctaLocation="mobile_nav" />
              <p className="text-center text-sm text-muted-foreground">{SITE.hours}</p>
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}