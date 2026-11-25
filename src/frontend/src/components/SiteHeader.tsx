import { AIRLINE_ITEMS, NAV_ITEMS, SITE } from "@/lib/site";
import { useDniPhoneNumber } from "@/lib/dni";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight, BriefcaseBusiness, Globe2, Menu, Phone, PlaneTakeoff, Route, X } from "lucide-react";
import { useEffect, useState } from "react";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const phone = useDniPhoneNumber();
  const menuGroups = [
    {
      title: "Flight Booking",
      icon: PlaneTakeoff,
      items: NAV_ITEMS.filter((item) =>
        [
          "/flight-booking",
          "/flight-search",
          "/book-a-flight-by-phone",
          "/international-flight-booking",
          "/last-minute-flight-booking",
        ].includes(item.to),
      ),
    },
    {
      title: "Travel Assistance",
      icon: BriefcaseBusiness,
      items: [
        { label: "Multi-City Flights", to: "/multi-city-flight-booking" },
        { label: "Group Flights", to: "/group-flight-booking" },
        { label: "Business & First Class", to: "/business-class-flight-booking" },
        { label: "Flight Change Assistance", to: "/flight-change-assistance" },
        { label: "Contact", to: "/contact" },
      ],
    },
    { title: "Airlines", icon: Globe2, items: AIRLINE_ITEMS },
    {
      title: "Popular Routes",
      icon: Route,
      items: [
        { label: "USA to Canada", to: "/flights-usa-to-canada" },
        { label: "USA to Mexico", to: "/flights-usa-to-mexico" },
        { label: "USA to UK", to: "/flights-usa-to-uk" },
        { label: "USA to Europe", to: "/flights-usa-to-europe" },
        { label: "New York to London", to: "/flights-new-york-to-london" },
      ],
    },
  ] as const;

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <header
      data-ocid="site.header"
      className="sticky top-0 z-50 border-b border-border/70 bg-white/90 shadow-[0_4px_24px_-18px_rgba(8,24,48,0.35)] backdrop-blur-xl"
    >
      <div className="mx-auto flex min-h-[4.25rem] w-full max-w-7xl items-center justify-between gap-2 px-4 sm:min-h-[4.5rem] sm:gap-4 lg:h-20 lg:px-10">
        <Link
          to="/"
          data-ocid="site.logo_link"
          className="group flex min-w-0 items-center gap-3 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-primary text-primary-foreground shadow-subtle transition-smooth group-hover:scale-105">
            <PlaneTakeoff aria-hidden="true" className="size-5 -rotate-6" />
          </span>
          <span className="truncate font-display text-lg font-extrabold tracking-[-0.04em] text-foreground sm:text-xl">
            TicketDepart
          </span>
        </Link>

        <div className="flex shrink-0 items-center gap-2">
          <a
            href={phone.href}
            aria-label={`Call TicketDepart at ${phone.display}`}
            data-ocid="header.call_button"
            data-cta-location="header"
            className="inline-flex h-10 shrink-0 items-center justify-center gap-1.5 rounded-full bg-accent px-3 text-xs font-bold tracking-tight text-accent-foreground shadow-subtle transition-smooth hover:scale-[1.02] hover:bg-accent/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:gap-2 sm:px-4 sm:text-sm"
          >
            <Phone aria-hidden="true" className="size-3.5 shrink-0 sm:size-4" />
            <span>Call</span>
            <span className="hidden whitespace-nowrap sm:inline">{phone.display}</span>
          </a>
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="site-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            data-ocid="header.menu_toggle"
            className="inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-border bg-white text-foreground transition-smooth hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            {open ? <X aria-hidden="true" className="size-5" /> : <Menu aria-hidden="true" className="size-5" />}
          </button>
        </div>
      </div>

      {open ? (
        <div
          id="site-menu"
          data-ocid="header.mobile_drawer"
          className="absolute inset-x-0 top-full z-50 max-h-[calc(100dvh-4.25rem)] overflow-y-auto overscroll-contain border-t border-border bg-white/98 shadow-elevated backdrop-blur-xl"
        >
          <nav aria-label="Site menu" className="mx-auto w-full max-w-7xl">
            <div className="border-b border-border px-4 py-3 sm:px-8">
              <Link
                to="/"
                onClick={() => setOpen(false)}
                className="inline-flex rounded-full px-3 py-2 text-sm font-semibold text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                Home
              </Link>
            </div>
            <div className="grid gap-5 p-4 sm:grid-cols-2 xl:grid-cols-4">
              {menuGroups.map((group) => {
                const Icon = group.icon;
                return (
                  <div key={group.title} className="min-w-0">
                    <div className="mb-2 flex items-center gap-2 px-2">
                      <span className="flex size-8 items-center justify-center rounded-lg bg-primary/8 text-primary">
                        <Icon aria-hidden="true" className="size-4" />
                      </span>
                      <h3 className="text-sm font-bold text-foreground">{group.title}</h3>
                    </div>
                    <div className="space-y-0.5">
                      {group.items.map((item) => (
                        <Link
                          key={item.to}
                          to={item.to}
                          onClick={() => setOpen(false)}
                          className="flex min-w-0 items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-smooth hover:bg-muted hover:text-foreground"
                        >
                          <span className="min-w-0 truncate">{item.label}</span>
                          <ArrowUpRight aria-hidden="true" className="size-3.5 shrink-0 opacity-50" />
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
