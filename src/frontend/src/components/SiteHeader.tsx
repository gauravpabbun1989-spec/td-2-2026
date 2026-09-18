import { CallCta } from "@/components/CallCta";
import { NAV_ITEMS, SITE } from "@/lib/site";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import { Menu, Phone, Plane, X } from "lucide-react";
import { useEffect, useState } from "react";

/**
 * Sticky site header: wordmark, primary navigation, and the persistent
 * click-to-call conversion control. Collapses to a drawer below `lg`.
 */
export function SiteHeader() {
  const [open, setOpen] = useState(false);

  // Lock body scroll while the mobile drawer is open.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  return (
    <header
      data-ocid="site.header"
      className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/85"
    >
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-5 sm:px-8 lg:h-20">
        <Link
          to="/"
          data-ocid="site.logo_link"
          className="group flex items-center gap-2.5 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-smooth group-hover:bg-primary/90">
            <Plane aria-hidden="true" className="size-5 -rotate-45" />
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-display text-lg font-bold tracking-tight text-foreground">
              TicketDepart
            </span>
            <span className="label-board mt-0.5 text-[0.6rem] text-muted-foreground">
              {SITE.tagline}
            </span>
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              data-ocid={`nav.link.${item.label.toLowerCase().replace(/\s+/g, "_")}`}
              activeOptions={{ exact: item.to === "/" }}
              className={cn(
                "rounded-full px-3.5 py-2 text-sm font-medium text-muted-foreground transition-smooth",
                "hover:bg-muted hover:text-foreground",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
              )}
              activeProps={{
                className: "bg-muted text-foreground font-semibold",
              }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <CallCta
            size="sm"
            className="hidden sm:inline-flex"
            ocid="header.call_button"
          />
          <a
            href={SITE.phoneHref}
            aria-label={`Call ${SITE.phoneDisplay}`}
            data-ocid="header.call_icon_button"
            className="inline-flex size-10 items-center justify-center rounded-full bg-accent text-accent-foreground transition-smooth hover:bg-accent/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:hidden"
          >
            <Phone aria-hidden="true" className="size-4" />
          </a>
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-nav-drawer"
            aria-label={open ? "Close navigation menu" : "Open navigation menu"}
            data-ocid="header.menu_toggle"
            className="inline-flex size-10 items-center justify-center rounded-full border border-border text-foreground transition-smooth hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background lg:hidden"
          >
            {open ? (
              <X aria-hidden="true" className="size-5" />
            ) : (
              <Menu aria-hidden="true" className="size-5" />
            )}
          </button>
        </div>
      </div>

      {open ? (
        <div
          id="mobile-nav-drawer"
          data-ocid="header.mobile_drawer"
          className="border-t border-border bg-card lg:hidden"
        >
          <nav
            aria-label="Mobile"
            className="mx-auto flex w-full max-w-6xl flex-col gap-1 px-5 py-4 sm:px-8"
          >
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                data-ocid={`mobile_nav.link.${item.label.toLowerCase().replace(/\s+/g, "_")}`}
                activeOptions={{ exact: item.to === "/" }}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 text-base font-medium text-muted-foreground transition-smooth hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                activeProps={{
                  className: "bg-muted text-foreground font-semibold",
                }}
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-3 flex flex-col gap-2 border-t border-border pt-4">
              <CallCta
                size="lg"
                className="w-full"
                ocid="mobile_nav.call_button"
              />
              <p className="text-center text-sm text-muted-foreground">
                {SITE.hours}
              </p>
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
