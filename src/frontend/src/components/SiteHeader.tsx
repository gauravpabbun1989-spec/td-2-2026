import { createActor } from "@/backend";
import { CallCta } from "@/components/CallCta";
import { AIRLINE_ITEMS, SITE } from "@/lib/site";
import { cn } from "@/lib/utils";
import { useActor, useInternetIdentity } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { Menu, Phone, Plane, X } from "lucide-react";
import { useEffect, useState } from "react";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { actor, isFetching: actorFetching } = useActor(createActor);
  const { isAuthenticated } = useInternetIdentity();
  const adminQuery = useQuery({
    queryKey: ["isCallerAdmin"],
    queryFn: async () => (actor ? actor.isCallerAdmin() : false),
    enabled: !!actor && !actorFetching && isAuthenticated,
    retry: false,
  });
  const isAdmin = isAuthenticated && adminQuery.data === true;

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
            <span className="mt-1 hidden text-[0.58rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground sm:block">Flight assistance</span>
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
          <Link to="/flight-booking" className="rounded-full px-3 py-2.5 text-sm font-semibold text-muted-foreground transition-smooth hover:bg-muted hover:text-foreground">Flight Booking</Link>
          <Link to="/delta-airlines" className="rounded-full px-3 py-2.5 text-sm font-semibold text-muted-foreground transition-smooth hover:bg-muted hover:text-foreground">Delta Airlines</Link>
          <Link to="/united-airlines" className="rounded-full px-3 py-2.5 text-sm font-semibold text-muted-foreground transition-smooth hover:bg-muted hover:text-foreground">United Airlines</Link>
          <Link to="/american-airlines" className="rounded-full px-3 py-2.5 text-sm font-semibold text-muted-foreground transition-smooth hover:bg-muted hover:text-foreground">American Airlines</Link>
          <Link to="/southwest-airlines" className="rounded-full px-3 py-2.5 text-sm font-semibold text-muted-foreground transition-smooth hover:bg-muted hover:text-foreground">Southwest Airlines</Link>
          <div className="relative">
            <details className="group">
              <summary className="cursor-pointer list-none rounded-full px-3 py-2.5 text-sm font-semibold text-muted-foreground transition-smooth hover:bg-muted hover:text-foreground">More Airlines</summary>
              <div className="absolute right-0 top-full z-50 mt-2 max-h-[70vh] min-w-56 max-w-[calc(100vw-2rem)] overflow-y-auto rounded-2xl border border-border bg-white p-2 shadow-elevated">
                {AIRLINE_ITEMS.filter((item) => !["/delta-airlines", "/united-airlines", "/american-airlines", "/southwest-airlines"].includes(item.to)).map((item) => (
                  <Link key={item.to} to={item.to} className="block rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground">{item.label}</Link>
                ))}
              </div>
            </details>
          </div>
        </nav>

        <div className="flex items-center gap-2">
          <CallCta size="sm" className="hidden sm:inline-flex shadow-subtle" ocid="header.call_button" />
          <a href={SITE.phoneHref} aria-label={SITE.ctaLabel} data-ocid="header.call_icon_button" className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-subtle transition-smooth hover:scale-105 sm:hidden">
            <Phone aria-hidden="true" className="size-4" />
          </a>
          <button type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-controls="mobile-nav-drawer" aria-label={open ? "Close navigation menu" : "Open navigation menu"} data-ocid="header.menu_toggle" className="inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-border bg-white text-foreground transition-smooth hover:bg-muted lg:hidden">
            {open ? <X aria-hidden="true" className="size-5" /> : <Menu aria-hidden="true" className="size-5" />}
          </button>
        </div>
      </div>

      {open ? (
        <div id="mobile-nav-drawer" data-ocid="header.mobile_drawer" className="max-h-[calc(100vh-4.25rem)] overflow-y-auto border-t border-border bg-white/95 backdrop-blur-xl lg:hidden">
          <nav aria-label="Mobile" className="mx-auto flex w-full max-w-7xl flex-col gap-1 px-4 py-4 sm:px-8">
            <Link to="/flight-booking" onClick={() => setOpen(false)} className="rounded-xl px-4 py-3 text-base font-semibold text-muted-foreground hover:bg-muted hover:text-foreground">Flight Booking</Link>
            <Link to="/delta-airlines" onClick={() => setOpen(false)} className="rounded-xl px-4 py-3 text-base font-semibold text-muted-foreground hover:bg-muted hover:text-foreground">Delta Airlines</Link>
            <Link to="/united-airlines" onClick={() => setOpen(false)} className="rounded-xl px-4 py-3 text-base font-semibold text-muted-foreground hover:bg-muted hover:text-foreground">United Airlines</Link>
            <Link to="/american-airlines" onClick={() => setOpen(false)} className="rounded-xl px-4 py-3 text-base font-semibold text-muted-foreground hover:bg-muted hover:text-foreground">American Airlines</Link>
            <Link to="/southwest-airlines" onClick={() => setOpen(false)} className="rounded-xl px-4 py-3 text-base font-semibold text-muted-foreground hover:bg-muted hover:text-foreground">Southwest Airlines</Link>
            <div className="border-t border-border pt-3 mt-2">
              <p className="px-4 pb-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">More Airlines</p>
              {AIRLINE_ITEMS.filter((item) => !["/delta-airlines", "/united-airlines", "/american-airlines", "/southwest-airlines"].includes(item.to)).map((item) => (
                <Link key={item.to} to={item.to} onClick={() => setOpen(false)} className="block rounded-xl px-4 py-3 text-base font-medium text-muted-foreground hover:bg-muted hover:text-foreground">{item.label}</Link>
              ))}
            </div>
            <div className="mt-3 flex flex-col gap-2 border-t border-border pt-4">
              <CallCta size="lg" className="w-full" ocid="mobile_nav.call_button" />
              <p className="text-center text-sm text-muted-foreground">{SITE.hours}</p>
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}