import { CallCta } from "@/components/CallCta";
import { Section, SectionHeading } from "@/components/Section";
import { Seo } from "@/components/Seo";
import { TripRequestForm } from "@/components/contact/TripRequestForm";
import {
  breadcrumbSchema,
  contactPointSchema,
  organizationSchema,
} from "@/lib/seo";
import { ADDRESS_LINE, SITE } from "@/lib/site";
import { Clock, Mail, MapPin, Phone } from "lucide-react";

const CONTACT_DETAILS = [
  {
    icon: Phone,
    label: "Phone",
    value: SITE.phoneDisplay,
    href: SITE.phoneHref,
    note: "Fastest way to reach a specialist",
  },
  {
    icon: Mail,
    label: "Email",
    value: SITE.email,
    href: SITE.emailHref,
    note: "Replies within one business day",
  },
  {
    icon: MapPin,
    label: "Office",
    value: ADDRESS_LINE,
    note: "Torrance, California",
  },
  {
    icon: Clock,
    label: "Hours",
    value: "Open 24/7",
    note: "Including weekends and holidays",
  },
] as const;

const WHAT_HAPPENS_NEXT = [
  {
    step: "01",
    title: "We review your request",
    body: "A specialist reads your route, dates, and traveler count, then checks live availability across the airlines that serve it.",
  },
  {
    step: "02",
    title: "We call or email you back",
    body: "You get real options with total prices and the trade-offs explained — no pressure and no obligation to book.",
  },
  {
    step: "03",
    title: "You decide, we handle the rest",
    body: "If you want to move forward, we take care of ticketing, seat requests, and the details that are easy to miss.",
  },
] as const;

export function ContactPage() {
  return (
    <>
      <Seo
        title="Contact TicketDepart | Speak with a Travel Specialist"
        description="Contact TicketDepart to plan your next flight. Call +1 855-544-9001 any time, or send your trip details and a travel specialist will follow up with options."
        path="/contact"
        structuredData={[
          organizationSchema(),
          contactPointSchema(),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Contact", path: "/contact" },
          ]),
        ]}
      />

      <Section tone="paper" ocid="contact.hero.section">
        <p className="label-board text-accent">Contact</p>
        <h1 className="mt-3 max-w-3xl text-balance text-4xl font-semibold leading-[1.08] sm:text-5xl lg:text-6xl">
          Talk to a real travel specialist
        </h1>
        <p className="mt-5 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
          Tell us where you are going and when. A specialist from our travel
          desk will compare the options and call you back with clear pricing —
          usually the same day.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
          <CallCta size="lg" ocid="contact.hero.call_button" />
          <a
            href="#trip-request"
            data-ocid="contact.hero.form_link"
            className="inline-flex h-12 items-center justify-center rounded-full border border-primary/25 bg-card px-6 text-base font-medium text-primary transition-smooth hover:bg-primary hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Send trip details instead
          </a>
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          {SITE.hours} — call {SITE.phoneDisplay} any time, day or night.
        </p>
      </Section>

      <Section tone="muted" ocid="contact.details.section">
        <SectionHeading
          eyebrow="Reach us"
          title="Every way to get in touch"
          description="Call for the fastest answer, or use the details below if you would rather write to us first."
        />
        <dl className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CONTACT_DETAILS.map((detail) => (
            <div
              key={detail.label}
              data-ocid={`contact.detail.${detail.label.toLowerCase()}`}
              className="flex flex-col rounded-2xl border border-border bg-card p-5 shadow-subtle"
            >
              <span className="inline-flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                <detail.icon aria-hidden="true" className="size-5" />
              </span>
              <dt className="label-board mt-4 text-muted-foreground">
                {detail.label}
              </dt>
              <dd className="mt-2 text-base font-medium leading-snug">
                {"href" in detail && detail.href ? (
                  <a
                    href={detail.href}
                    className="underline-offset-4 hover:text-accent hover:underline"
                  >
                    {detail.value}
                  </a>
                ) : (
                  detail.value
                )}
              </dd>
              <dd className="mt-1 text-sm text-muted-foreground">
                {detail.note}
              </dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section
        id="trip-request"
        tone="paper"
        ocid="contact.form.section"
        aria-labelledby="trip-request-heading"
      >
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)] lg:gap-14">
          <div>
            <SectionHeading
              id="trip-request-heading"
              eyebrow="Trip request"
              title="Send your trip details"
              description="Share the basics and we will come back with options. Fields marked with an asterisk are required."
            />
            <ol className="mt-8 space-y-6">
              {WHAT_HAPPENS_NEXT.map((item) => (
                <li key={item.step} className="flex gap-4">
                  <span className="label-board mt-1 shrink-0 text-accent">
                    {item.step}
                  </span>
                  <div>
                    <h3 className="text-base font-semibold">{item.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      {item.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
          <TripRequestForm />
        </div>
      </Section>

      <Section tone="navy" ocid="contact.disclosure.section">
        <div className="max-w-3xl">
          <p className="label-board text-accent">Independent agency</p>
          <h2 className="mt-3 text-2xl font-semibold sm:text-3xl">
            Who you are working with
          </h2>
          <p className="mt-4 text-pretty text-base leading-relaxed text-primary-foreground/80">
            {SITE.disclosure}
          </p>
          <p className="mt-4 text-pretty text-base leading-relaxed text-primary-foreground/80">
            We are a U.S.-based travel agency, not an airline. Every booking is
            made through the airline or an authorized distributor, and your
            ticket is issued in your own name.
          </p>
          <div className="mt-8">
            <CallCta
              variant="solid"
              size="lg"
              ocid="contact.disclosure.call_button"
            />
          </div>
        </div>
      </Section>
    </>
  );
}
