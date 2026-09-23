import { createActor } from "@/backend";
import { CallCta } from "@/components/CallCta";
import { NAV_ITEMS, SITE } from "@/lib/site";
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
    <header data-ocid="site.header" className="sticky top-0 z-50 border-b border-border/70 bg-white/85 shadow-[0_4px_24px_-18px_rgba(8,24,48,0.35)] backdrop-blur-xl">
      <div className="mx-auto flex h-[4.5rem] w-full max-w-7xl items-center justify-between gap-4 px-5 sm:px-8 lg:h-20 lg:px-10">
        <Link to="/" data-ocid="site.logo_link" className="group flex items-center gap-3 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
          <span className="flex size-10 items-center justify-center rounded-xl bg-gradient-primary text-primary-foreground shadow-subtle transition-smooth group-hover:scale-105">
            <Plane aria-hidden="true" className="size-5 -rotate-45" />
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-display text-xl font-bold tracking-[-0.03em] text-foreground">TicketDepart</span>
            <span className="mt-1 text-[0.58rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Flight assistance</span>
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              data-ocid={`nav.link.${item.label.toLowerCase().replace(/\s+/g, "_")}`}
              activeOptions={{ exact: item.to === "/" }}
              className={cn("rounded-full px-3 py-2.5 text-sm font-medium text-muted-foreground transition-smooth hover:bg-muted hover:text-foreground", "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring")}
              activeProps={{ className: "bg-primary text-primary-foreground font-semibold shadow-subtle" }}
            >
              {item.label}
            </Link>
          ))}
          <span className="mx-1 h-5 w-px bg-border" aria-hidden="true" />
          {[
            { label: "Delta", to: "/delta-airlines" },
            { label: "United", to: "/united-airlines" },
            { label: "American", to: "/american-airlines" },
            { label: "Southwest", to: "/southwest-airlines" },
          ].map((item) => (
            <Link
              key={item.to}
              to={item.to}
              data-ocid={`nav.airline.${item.label.toLowerCase()}`}
              className={cn("rounded-full px-2.5 py-2.5 text-xs font-semibold text-muted-foreground transition-smooth hover:bg-muted hover:text-foreground", "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring")}
              activeProps={{ className: "bg-primary text-primary-foreground font-semibold shadow-subtle" }}
            >
              {item.label}
            </Link>
          ))}
          {isAdmin ? <Link to="/admin/leads" data-ocid="nav.link.leads_desk" className="rounded-full px-4 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted">Leads Desk</Link> : null}
        </nav>

        <div className="flex items-center gap-2">
          <CallCta size="sm" className="hidden sm:inline-flex shadow-subtle" ocid="header.call_button" />
          <a href={SITE.phoneHref} aria-label={SITE.ctaLabel} data-ocid="header.call_icon_button" className="inline-flex size-10 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-subtle transition-smooth hover:scale-105 sm:hidden">
            <Phone aria-hidden="true" className="size-4" />
          </a>
          <button type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-controls="mobile-nav-drawer" aria-label={open ? "Close navigation menu" : "Open navigation menu"} data-ocid="header.menu_toggle" className="inline-flex size-10 items-center justify-center rounded-full border border-border bg-white text-foreground transition-smooth hover:bg-muted lg:hidden">
            {open ? <X aria-hidden="true" className="size-5" /> : <Menu aria-hidden="true" className="size-5" />}
          </button>
        </div>
      </div>

      {open ? (
        <div id="mobile-nav-drawer" data-ocid="header.mobile_drawer" className="border-t border-border bg-white/95 backdrop-blur-xl lg:hidden">
          <nav aria-label="Mobile" className="mx-auto flex w-full max-w-7xl flex-col gap-1 px-5 py-4 sm:px-8">
            {NAV_ITEMS.map((item) => (
              <Link key={item.to} to={item.to} data-ocid={`mobile_nav.link.${item.label.toLowerCase().replace(/\s+/g, "_")}`} activeOptions={{ exact: item.to === "/" }} onClick={() => setOpen(false)} className="rounded-xl px-4 py-3 text-base font-medium text-muted-foreground hover:bg-muted hover:text-foreground" activeProps={{ className: "bg-primary text-primary-foreground font-semibold" }}>
                {item.label}
              </Link>
            ))}
            <div className="border-t border-border pt-3 mt-2">
              <p className="px-4 pb-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Airline Guides</p>
              {[
                { label: "Delta Airlines", to: "/delta-airlines" },
                { label: "United Airlines", to: "/united-airlines" },
                { label: "American Airlines", to: "/american-airlines" },
                { label: "Southwest Airlines", to: "/southwest-airlines" },
              ].map((item) => (
                <Link key={item.to} to={item.to} data-ocid={`mobile_nav.airline.${item.label.toLowerCase().replace(/\s+/g, "_")}`} onClick={() => setOpen(false)} className="block rounded-xl px-4 py-3 text-base font-medium text-muted-foreground hover:bg-muted hover:text-foreground" activeProps={{ className: "bg-primary text-primary-foreground font-semibold" }}>
                  {item.label}
                </Link>
              ))}
            </div>
            {isAdmin ? <Link to="/admin/leads" data-ocid="mobile_nav.link.leads_desk" onClick={() => setOpen(false)} className="rounded-xl px-4 py-3 text-base font-medium text-muted-foreground hover:bg-muted">Leads Desk</Link> : null}
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