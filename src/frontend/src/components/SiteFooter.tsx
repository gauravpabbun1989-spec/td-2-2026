import { CallCta } from "@/components/CallCta";
import { ADDRESS_LINE, LEGAL_ITEMS, NAV_ITEMS, SITE } from "@/lib/site";
import { Link } from "@tanstack/react-router";
import { Clock, Mail, MapPin, Plane } from "lucide-react";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer data-ocid="site.footer" className="relative overflow-hidden bg-[#071a35] text-white">
      <div className="absolute -right-32 top-0 h-80 w-80 rounded-full bg-accent/10 blur-3xl" />
      <div className="relative mx-auto w-full max-w-7xl px-5 py-14 sm:px-8 sm:py-16 lg:px-10">
        <div className="mb-10 rounded-[1.75rem] border border-white/10 bg-white/5 p-6 backdrop-blur sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="label-board text-accent">Independent travel agency</p>
              <h2 className="mt-2 font-display text-2xl font-semibold">Flight help without the runaround.</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-white/60">Clear information, human assistance, and a straightforward booking experience.</p>
            </div>
            <CallCta size="lg" ocid="footer.call_button" />
          </div>
        </div>

        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                <Plane aria-hidden="true" className="size-5 -rotate-45" />
              </span>
              <span className="font-display text-xl font-bold">{SITE.name}</span>
            </div>
            <p className="mt-4 max-w-md text-sm leading-6 text-white/65">{SITE.description}</p>
            <p className="label-board mt-5 text-accent">{SITE.hours}</p>
          </div>

          <div>
            <h2 className="label-board text-white/45">Contact</h2>
            <ul className="mt-4 space-y-3 text-sm">
              <li><a href={SITE.emailHref} data-ocid="footer.email_link" className="flex gap-2.5 text-white/70 hover:text-accent"><Mail className="mt-0.5 size-4 shrink-0" aria-hidden="true" /><span className="break-all">{SITE.email}</span></a></li>
              <li className="flex gap-2.5 text-white/70"><MapPin className="mt-0.5 size-4 shrink-0" aria-hidden="true" /><address className="not-italic">{ADDRESS_LINE}</address></li>
              <li className="flex gap-2.5 text-white/70"><Clock className="mt-0.5 size-4 shrink-0" aria-hidden="true" /><span>Open 24 hours, 7 days a week</span></li>
            </ul>
          </div>

          <div>
            <h2 className="label-board text-white/45">Explore</h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              {NAV_ITEMS.map((item) => (
                <li key={item.to}><Link to={item.to} data-ocid={`footer.link.${item.label.toLowerCase().replace(/\s+/g, "_")}`} className="text-white/70 transition-smooth hover:text-accent">{item.label}</Link></li>
              ))}
            </ul>
            <h2 className="label-board mt-6 text-white/45">Legal</h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              {LEGAL_ITEMS.map((item) => (
                <li key={item.to}><Link to={item.to} data-ocid={`footer.link.${item.label.toLowerCase().replace(/\s+/g, "_")}`} className="text-white/70 transition-smooth hover:text-accent">{item.label}</Link></li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-7">
          <p className="max-w-5xl text-xs leading-5 text-white/45">{SITE.disclosure}</p>
          <div className="mt-6 flex flex-col gap-2 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between">
            <p>© {year} {SITE.legalName}. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}