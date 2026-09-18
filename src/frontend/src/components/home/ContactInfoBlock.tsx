import { CallCta } from "@/components/CallCta";
import { Section, SectionHeading } from "@/components/Section";
import { ADDRESS_LINE, SITE } from "@/lib/site";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Clock, Mail, MapPin, Phone } from "lucide-react";

/**
 * Contact information block: phone, email, mailing address, and 24/7 hours.
 * The phone entry is the primary conversion path and is a real tel: link.
 */
export function ContactInfoBlock() {
  return (
    <Section
      tone="paper"
      ocid="home.contact_section"
      aria-labelledby="home-contact-heading"
    >
      <SectionHeading
        id="home-contact-heading"
        eyebrow="Contact"
        title="Talk to a travel specialist"
        description="Call any time, day or night. Prefer to write? Email works too."
      />

      <div className="mt-12 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-subtle sm:p-8">
          <div className="flex items-center gap-3">
            <span className="flex size-11 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Phone aria-hidden="true" className="size-5" />
            </span>
            <div>
              <p className="label-board text-accent">Call us</p>
              <a
                href={SITE.phoneHref}
                data-ocid="home.contact_phone_link"
                className="mt-1 block font-display text-2xl font-bold tracking-tight text-foreground transition-smooth hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:text-3xl"
              >
                {SITE.phoneDisplay}
              </a>
            </div>
          </div>

          <p className="mt-5 flex items-center gap-2 text-sm text-muted-foreground">
            <Clock aria-hidden="true" className="size-4 text-accent" />
            {SITE.hours}
          </p>

          <div className="mt-6">
            <CallCta
              size="lg"
              className="w-full sm:w-auto"
              ocid="home.contact_call_button"
            />
          </div>

          <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
            Prefer to write?{" "}
            <Link
              to="/contact"
              data-ocid="home.contact_trip_request_link"
              className="font-medium text-primary underline underline-offset-4 transition-smooth hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              Send a trip request
            </Link>{" "}
            and we will follow up by email.
          </p>
        </div>

        <dl className="grid gap-4">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-subtle">
            <dt className="flex items-center gap-2.5">
              <Mail aria-hidden="true" className="size-5 text-accent" />
              <span className="label-board text-muted-foreground">Email</span>
            </dt>
            <dd className="mt-2.5">
              <a
                href={SITE.emailHref}
                data-ocid="home.contact_email_link"
                className="break-words text-base font-medium text-foreground underline underline-offset-4 transition-smooth hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                {SITE.email}
              </a>
            </dd>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-subtle">
            <dt className="flex items-center gap-2.5">
              <MapPin aria-hidden="true" className="size-5 text-accent" />
              <span className="label-board text-muted-foreground">
                Mailing address
              </span>
            </dt>
            <dd className="mt-2.5 text-base leading-relaxed text-foreground">
              <address className="not-italic">
                {SITE.legalName}
                <br />
                {ADDRESS_LINE}
              </address>
            </dd>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-subtle">
            <dt className="label-board text-muted-foreground">
              Before you call
            </dt>
            <dd className="mt-2.5">
              <Link
                to="/flight-booking"
                data-ocid="home.contact_flight_booking_link"
                className="inline-flex min-h-11 items-center gap-2 text-base font-medium text-primary underline underline-offset-4 transition-smooth hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                See how our flight booking service works
                <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
            </dd>
          </div>
        </dl>
      </div>
    </Section>
  );
}
