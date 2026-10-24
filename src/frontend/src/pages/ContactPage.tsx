import { CallCta } from "@/components/CallCta";
import { PageContentExpansion } from "@/components/PageContentExpansion";
import { Section, SectionHeading } from "@/components/Section";
import { Seo } from "@/components/Seo";
import { TripRequestForm } from "@/components/contact/TripRequestForm";
import {
  breadcrumbSchema,
  contactPointSchema,
  organizationSchema,
} from "@/lib/seo";
import { ADDRESS_LINE, SITE } from "@/lib/site";
import { Clock, Mail, MapPin } from "lucide-react";

const CONTACT_DETAILS = [
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
  { step: "01", title: "We review your request", body: "A specialist reads your route, dates, and traveler count, then reviews the trip details you provide." },
  { step: "02", title: "We call or email you back", body: "You get clear options and the important trade-offs explained — no pressure and no obligation to book." },
  { step: "03", title: "You decide, we handle the rest", body: "If you want to move forward, we help with the booking details and next steps." },
] as const;

export function ContactPage() {
  return (
    <>
      <Seo
        title="Contact TicketDepart | Speak with a Travel Specialist"
        description="Contact TicketDepart about your flight plans. Call +1-888-958-0280 or send your trip details for a callback."
        path="/contact"
        structuredData={[
          organizationSchema(),
          contactPointSchema(),
          breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Contact", path: "/contact" }]),
        ]}
      />

      <Section tone="paper" ocid="contact.hero.section">
        <p className="label-board text-accent">Contact</p>
        <h1 className="mt-3 max-w-3xl text-balance text-4xl font-semibold leading-[1.08] sm:text-5xl lg:text-6xl">
          Talk to a real travel specialist about your flight
        </h1>
        <p className="mt-5 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
          Tell us where you are going and when. A specialist from our travel desk can review your trip and help you understand the next steps.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
          <CallCta size="lg" ocid="contact.hero.call_button" ctaLocation="contact_hero" />
          <a href="#trip-request" data-ocid="contact.hero.form_link" className="inline-flex h-12 items-center justify-center rounded-full border border-primary/25 bg-card px-6 text-base font-medium text-primary transition-smooth hover:bg-primary hover:text-primary-foreground">
            Request a callback instead
          </a>
        </div>
        <p className="mt-4 text-sm text-muted-foreground">{SITE.hours}</p>
      </Section>

      <Section tone="muted" ocid="contact.details.section">
        <SectionHeading eyebrow="Reach us" title="Simple ways to get in touch" description="Call for the fastest answer, or request a callback if you would rather send your trip details first." />
        <dl className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CONTACT_DETAILS.map((detail) => (
            <div key={detail.label} data-ocid={`contact.detail.${detail.label.toLowerCase()}`} className="flex flex-col rounded-[1.5rem] border border-border bg-card p-6 shadow-subtle">
              <span className="inline-flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary"><detail.icon aria-hidden="true" className="size-5" /></span>
              <dt className="label-board mt-4 text-muted-foreground">{detail.label}</dt>
              <dd className="mt-2 text-base font-medium leading-snug">
                {"href" in detail && detail.href ? <a href={detail.href} className="break-words hover:text-accent hover:underline">{detail.value}</a> : detail.value}
              </dd>
              <dd className="mt-1 text-sm text-muted-foreground">{detail.note}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section id="trip-request" tone="paper" ocid="contact.form.section" aria-labelledby="trip-request-heading">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)] lg:gap-14">
          <div>
            <SectionHeading id="trip-request-heading" eyebrow="Trip request" title="Send your trip details" description="Share the basics and we will come back with options. Fields marked with an asterisk are required." />
            <ol className="mt-8 space-y-6">
              {WHAT_HAPPENS_NEXT.map((item) => (
                <li key={item.step} className="flex gap-4">
                  <span className="label-board mt-1 shrink-0 text-accent">{item.step}</span>
                  <div><h3 className="text-base font-semibold">{item.title}</h3><p className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.body}</p></div>
                </li>
              ))}
            </ol>
          </div>
          <TripRequestForm />
        </div>
      </Section>

      <PageContentExpansion subject="contacting TicketDepart about a flight" intro="When you contact TicketDepart, the most useful starting point is a clear description of the trip you are trying to arrange or the reservation you need help understanding." points={[["Trip basics", "Origin, destination, dates, travelers, and cabin preference."],["Existing reservation", "Confirmation code, ticket details, passenger name, and current itinerary."],["Travel priorities", "Schedule, airport, connection, baggage, seating, or flexibility needs."],["Questions before booking", "Fare conditions, changes, cancellations, refunds, credits, and applicable charges."]]} context="You do not need a perfect itinerary before contacting us. The purpose of the conversation is to understand what you need, identify the practical details that matter, and explain the available next steps clearly." />

      <Section tone="navy" ocid="contact.disclosure.section">
        <div className="max-w-3xl">
          <p className="label-board text-accent">Independent agency</p>
          <h2 className="mt-3 text-2xl font-semibold sm:text-3xl">Who you are working with</h2>
          <p className="mt-4 text-pretty text-base leading-relaxed text-primary-foreground/80">{SITE.disclosure}</p>
          <p className="mt-4 text-pretty text-base leading-relaxed text-primary-foreground/80">We are a U.S.-based travel agency, not an airline. Your booking is made through an airline or authorized distributor, and applicable airline fare rules and conditions apply.</p>
          <div className="mt-8"><CallCta variant="solid" size="lg" ocid="contact.disclosure.call_button" /></div>
        </div>
      </Section>
    </>
  );
}
