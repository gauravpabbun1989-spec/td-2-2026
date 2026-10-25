import { CallCta } from "@/components/CallCta";
import { PageContentExpansion } from "@/components/PageContentExpansion";
import { Section, SectionHeading } from "@/components/Section";
import { Seo } from "@/components/Seo";
import { breadcrumbSchema, serviceSchema, webPageSchema } from "@/lib/seo";
import { SITE } from "@/lib/site";
import { Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2 } from "lucide-react";

const faqs = [
  { question: "Can you help with corporate flight bookings?", answer: "Yes. TicketDepart can discuss corporate and business travel itineraries by phone, including routes, dates, cabin preferences, connections, and fare conditions." },
  { question: "Can you help book flights for employees or executives?", answer: "Yes. You can discuss traveler counts, schedules, preferred airports, cabins, and other itinerary requirements with a travel specialist." },
  { question: "Can you help with international corporate travel?", answer: "Yes. We can discuss international routing, connections, premium cabins, flexible dates, and the fare conditions that apply to the itinerary." },
  { question: "Can you help compare business-class options?", answer: "A specialist can discuss business-class schedules, aircraft or cabin information where published, connections, and fare rules for your itinerary." },
  { question: "What should I have ready before calling?", answer: "Have the origin, destination, travel dates, traveler count, preferred cabin, airline preferences, and any schedule or airport requirements you already know." },
];

const items = [
  ["Corporate travel planning", "Discuss employee, executive, client, and business-trip flight requirements in one conversation."],
  ["Business-class booking", "Compare premium-cabin schedules, routing, connection times, and applicable fare conditions."],
  ["International business travel", "Work through long-haul routes, connection airports, flexible dates, and cabin preferences."],
  ["Multiple travelers", "Discuss coordinated itineraries for employees, executives, teams, or clients traveling on related schedules."],
  ["Flexible schedules", "Review alternative dates, airports, and routing when business priorities allow flexibility."],
  ["Fare and baggage terms", "Ask about baggage, changes, cancellations, and other conditions before authorizing payment."],
];

export function CorporateFlightBookingPage() {
  const path = "/corporate-flight-booking";
  const title = "Corporate Flight Booking by Phone | Business Travel | TicketDepart";
  const description = "Book corporate and business travel flights by phone with TicketDepart. Discuss employee and executive travel, business class, international routes, schedules, and fare conditions.";

  return (
    <>
      <Seo title={title} description={description} path={path} indexable={false} structuredData={[
        breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Corporate flight booking", path }]),
        webPageSchema({ title, description, path }),
        serviceSchema({ name: "Corporate flight booking assistance", description, path }),
      ]} />
      <Section tone="paper">
        <nav aria-label="Breadcrumb"><ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground"><li><Link to="/" className="font-medium hover:text-foreground">Home</Link></li><li aria-hidden="true"><ArrowRight className="size-4" /></li><li><span aria-current="page" className="font-semibold text-foreground">Corporate flight booking</span></li></ol></nav>
        <div className="mx-auto mt-10 max-w-4xl">
          <p className="label-board text-accent">Corporate flight booking assistance</p>
          <h1 className="mt-4 text-balance text-4xl font-bold leading-[1.08] sm:text-5xl lg:text-6xl">Corporate flight booking by phone</h1>
          <p className="mt-6 max-w-3xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">Need to arrange business travel for yourself, employees, executives, or clients? Discuss routes, schedules, business-class options, connections, traveler details, and fare conditions with a TicketDepart travel specialist.</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row"><CallCta size="lg" /><Link to="/contact/" className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-primary/25 bg-card px-6 text-base font-medium text-primary hover:bg-primary hover:text-primary-foreground">Request a callback <ArrowRight className="size-4" /></Link></div>
          <p className="mt-5 text-sm text-muted-foreground">{SITE.hours} · Independent travel agency</p>
        </div>
      </Section>
      <Section tone="muted">
        <SectionHeading eyebrow="Business travel support" title="Practical help for corporate itineraries" description="Start with the route, dates, travelers, and business requirements. A specialist can work through the available booking options and terms." />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{items.map(([title, text]) => <article key={title} className="rounded-2xl border border-border bg-card p-6 shadow-subtle"><CheckCircle2 className="size-5 text-accent" /><h2 className="mt-4 font-display text-lg font-semibold">{title}</h2><p className="mt-3 text-sm leading-relaxed text-muted-foreground">{text}</p></article>)}</div>
      </Section>
      <Section tone="paper">
        <SectionHeading eyebrow="Before you call" title="Have the trip details ready" description="The more of these details you know, the easier it is to discuss relevant options." />
        <ul className="mx-auto mt-10 grid max-w-4xl gap-4 sm:grid-cols-2">{["Origin and destination","Travel dates and flexibility","Number of travelers","Business or economy preference","Preferred airlines or airports","Schedule and connection requirements"].map(item => <li key={item} className="flex items-start gap-3 rounded-xl border border-border bg-card p-5 text-sm"><CheckCircle2 className="mt-0.5 size-5 shrink-0 text-accent" /><span>{item}</span></li>)}</ul>
      </Section>
      <PageContentExpansion subject="corporate flight booking" intro="Corporate travel often has a schedule or business requirement behind the flight itself." points={items} context="For business travel, the itinerary may need to work around meetings, employee schedules, client commitments, airport preferences, and cabin requirements. A useful booking conversation should consider the complete trip rather than treating the flight as an isolated purchase." />

      <Section tone="paper">
        <SectionHeading eyebrow="FAQ" title="Corporate flight booking questions" description="Straight answers before you call." />
        <div className="mx-auto mt-10 max-w-3xl space-y-4">{faqs.map(f => <details key={f.question} className="rounded-2xl border border-border bg-card p-5 shadow-subtle"><summary className="cursor-pointer font-semibold">{f.question}</summary><p className="mt-3 text-sm leading-relaxed text-muted-foreground">{f.answer}</p></details>)}</div>
      </Section>
      <Section tone="navy">
        <div className="mx-auto max-w-3xl text-center"><p className="label-board text-accent">Available 24/7</p><h2 className="mt-4 text-balance text-3xl font-semibold sm:text-4xl">Talk through your business trip</h2><p className="mt-5 text-base leading-relaxed text-primary-foreground/80 sm:text-lg">Call with your route, dates, traveler details, and preferred cabin. Review available options and applicable terms before you decide.</p><div className="mt-8"><CallCta size="lg" showNumber /></div></div>
      </Section>
    </>
  );
}
