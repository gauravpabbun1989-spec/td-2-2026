import { CallCta } from "@/components/CallCta";
import { Section, SectionHeading } from "@/components/Section";
import { ADDRESS_LINE, SITE } from "@/lib/site";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Clock, Mail, MapPin } from "lucide-react";

export function ContactInfoBlock() {
  return (
    <Section tone="paper" ocid="home.contact_section" aria-labelledby="home-contact-heading">
      <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-stretch">
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-primary p-7 text-white shadow-premium sm:p-10">
          <div className="absolute -right-20 -top-20 size-56 rounded-full bg-accent/20 blur-3xl" />
          <div className="relative">
            <p className="label-board text-accent">Here when you need us</p>
            <h2 id="home-contact-heading" className="mt-3 max-w-xl text-balance text-3xl font-semibold leading-tight sm:text-4xl">
              Helpful flight guidance, without the pressure.
            </h2>
            <p className="mt-5 max-w-xl text-base leading-7 text-white/70">
              Speak with a travel specialist about your route, dates, cabin, baggage, changes, or other booking questions. You stay in control of the decision.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <CallCta size="lg" ocid="home.contact_call_button" />
              <Link to="/contact" data-ocid="home.contact_trip_request_link" className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 text-sm font-semibold text-white backdrop-blur hover:bg-white hover:text-primary">
                Request a callback <ArrowRight className="size-4" />
              </Link>
            </div>
            <div className="mt-8 flex items-center gap-2 text-sm text-white/65">
              <Clock className="size-4 text-accent" aria-hidden="true" />
              {SITE.hours}
            </div>
          </div>
        </div>

        <div className="grid gap-4">
          <div className="rounded-[1.5rem] border border-border bg-card p-6 shadow-subtle sm:p-7">
            <div className="flex items-center gap-3">
              <span className="flex size-11 items-center justify-center rounded-2xl bg-accent/10 text-accent"><Mail className="size-5" aria-hidden="true" /></span>
              <div><p className="label-board text-muted-foreground">Email</p><a href={SITE.emailHref} data-ocid="home.contact_email_link" className="mt-1 block break-words font-semibold text-foreground hover:text-accent">{SITE.email}</a></div>
            </div>
          </div>
          <div className="rounded-[1.5rem] border border-border bg-card p-6 shadow-subtle sm:p-7">
            <div className="flex items-start gap-3">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary"><MapPin className="size-5" aria-hidden="true" /></span>
              <div><p className="label-board text-muted-foreground">Mailing address</p><address className="mt-1 text-sm leading-6 not-italic text-foreground">{SITE.legalName}<br />{ADDRESS_LINE}</address></div>
            </div>
          </div>
          <div className="rounded-[1.5rem] border border-border bg-card p-6 shadow-subtle sm:p-7">
            <p className="label-board text-muted-foreground">Explore before you call</p>
            <Link to="/flight-booking" data-ocid="home.contact_flight_booking_link" className="mt-2 inline-flex items-center gap-2 font-semibold text-primary hover:text-accent">
              See how flight booking assistance works <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </div>
    </Section>
  );
}
