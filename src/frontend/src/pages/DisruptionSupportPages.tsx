import { CallCta } from "@/components/CallCta";
import { Section, SectionHeading } from "@/components/Section";
import { Seo } from "@/components/Seo";
import { SITE } from "@/lib/site";
import { breadcrumbSchema, faqSchema, serviceSchema, webPageSchema } from "@/lib/seo";
import { Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, Phone } from "lucide-react";

const PAGES = {
  cancellation: {
    path: "/flight-cancellation-assistance",
    title: "Flight Cancellation Assistance by Phone | TicketDepart",
    description: "Need help understanding a flight cancellation or refund request? Call TicketDepart to discuss your ticket, fare conditions, and available next steps with an independent travel specialist.",
    heading: "Flight cancellation and refund assistance by phone",
    intro: "Airline cancellation rules can depend on the ticket, route, timing, and fare conditions. TicketDepart can help you organize the details and discuss the options that may be available for your booking.",
    points: ["Existing flight cancellation questions", "Refund and travel-credit questions", "Fare-rule and ticket-condition review", "Domestic and international itineraries", "Changes before departure", "Urgent cancellation requests"],
    steps: ["Have your confirmation code or ticket number and passenger name ready.", "Tell the specialist why you need to cancel and what outcome you are seeking.", "Review the applicable options, conditions, and any disclosed fees before proceeding."],
    faq: [
      ["Can you help me cancel a flight?", "Call TicketDepart with your booking details. A specialist can review the information you provide and explain the cancellation or rebooking options that may apply."],
      ["Will I automatically receive a full refund?", "Not necessarily. Refund eligibility depends on the airline, fare rules, ticket conditions, timing, and applicable regulations."],
      ["Can I request a travel credit instead?", "Depending on the ticket and airline rules, a travel credit may be one of the available options. The applicable conditions should be reviewed before confirmation."],
      ["Are you the airline's official cancellation department?", "No. TicketDepart is an independent U.S. travel agency and is not affiliated with, endorsed by, or sponsored by any airline."],
    ],
    related: [["Flight change & rebooking", "/flight-change-rebooking"], ["Same-day flight booking", "/same-day-flight-booking"], ["Flight booking assistance", "/flight-booking-assistance"]],
  },
  missedFlight: {
    path: "/missed-flight-rebooking",
    title: "Missed Flight Rebooking Assistance by Phone | TicketDepart",
    description: "Missed your flight? Call TicketDepart to discuss rebooking information, itinerary details, and available options with an independent travel specialist.",
    heading: "Missed flight rebooking help by phone",
    intro: "If you have missed a flight, timing matters. TicketDepart can help you organize your booking information and discuss the rebooking options that may be available under the airline and ticket rules.",
    points: ["Missed-departure rebooking questions", "Same-day alternative itineraries", "Return-flight coordination", "Domestic and international travel", "Confirmation and ticket details", "Fare and change-condition questions"],
    steps: ["Keep your confirmation code, ticket number, passenger name, and missed flight details nearby.", "Explain where you are, where you need to go, and how quickly you need to travel.", "Review available alternatives and applicable fare or change conditions before confirming."],
    faq: [
      ["What should I do after missing a flight?", "Call as soon as possible and have your booking details ready. A specialist can discuss the information and rebooking options available under the applicable ticket rules."],
      ["Can you guarantee a replacement flight?", "No. Replacement options depend on airline inventory, ticket conditions, fare rules, and the timing of the request."],
      ["Can you help with a same-day alternative?", "You can call and discuss same-day options. Availability and pricing can change continuously and are not guaranteed until confirmed."],
      ["Are you the airline's official missed-flight department?", "No. TicketDepart is an independent U.S. travel agency and is not affiliated with, endorsed by, or sponsored by any airline."],
    ],
    related: [["Flight change & rebooking", "/flight-change-rebooking"], ["Same-day flight booking", "/same-day-flight-booking"], ["Flight cancellation assistance", "/flight-cancellation-assistance"]],
  },
} as const;

type Kind = keyof typeof PAGES;

function SupportPage({ kind }: { kind: Kind }) {
  const page = PAGES[kind];
  const faq: { question: string; answer: string }[] = page.faq.map(([question, answer]) => ({ question, answer }));
  const breadcrumbs = [{ name: "Home", path: "/" }, { name: "Flight Booking", path: "/flight-booking" }, { name: page.heading, path: page.path }];
  return (
    <>
      <Seo title={page.title} description={page.description} path={page.path} structuredData={[breadcrumbSchema(breadcrumbs), faqSchema(faq), webPageSchema({ title: page.title, description: page.description, path: page.path }), serviceSchema({ name: page.heading, description: page.description, path: page.path })]} />
      <Section tone="paper">
        <nav aria-label="Breadcrumb"><ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground"><li><Link to="/">Home</Link></li><li aria-hidden="true">/</li><li><Link to="/flight-booking">Flight Booking</Link></li><li aria-hidden="true">/</li><li aria-current="page" className="font-semibold text-foreground">{page.heading}</li></ol></nav>
        <div className="mt-10 grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
          <div><p className="label-board text-accent">Travel support</p><h1 className="mt-4 max-w-4xl text-balance text-4xl font-bold leading-[1.08] sm:text-5xl">{page.heading}</h1><p className="mt-6 max-w-3xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">{page.intro}</p><div className="mt-8 flex flex-col gap-3 sm:flex-row"><CallCta size="lg" ocid={kind + ".hero_call"} /><Link to="/contact" className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-primary/25 bg-card px-6 text-base font-medium text-primary">Send trip details <ArrowRight className="size-4" /></Link></div><p className="mt-5 flex items-center gap-2 text-sm text-muted-foreground"><Phone className="size-4 text-accent" />{SITE.hours} · {SITE.phoneDisplay}</p></div>
          <aside className="rounded-2xl border border-border bg-card p-6 shadow-elevated sm:p-7"><h2 className="label-board text-muted-foreground">This page covers</h2><ul className="mt-5 space-y-3">{page.points.map((item) => <li key={item} className="flex items-start gap-3"><CheckCircle2 className="mt-0.5 size-5 shrink-0 text-accent" /><span className="text-sm leading-relaxed">{item}</span></li>)}</ul></aside>
        </div>
      </Section>
      <Section tone="muted"><SectionHeading eyebrow="How it works" title="Organize the details before you decide" description="A short phone conversation can help clarify what information and conditions apply to the booking." /><ol className="mt-10 grid gap-4 md:grid-cols-3">{page.steps.map((step, index) => <li key={step} className="rounded-2xl border border-border bg-card p-6"><span className="label-board text-accent">0{index + 1}</span><p className="mt-3 text-sm leading-relaxed text-muted-foreground">{step}</p></li>)}</ol></Section>
      <Section tone="paper"><SectionHeading eyebrow="Questions" title="Frequently asked questions" description="Straight answers before you call." /><dl className="mt-10 grid gap-4 lg:grid-cols-2">{page.faq.map((item) => { const [question, answer] = item; return <div key={question} className="rounded-2xl border border-border bg-card p-6"><dt className="font-display text-base font-semibold">{question}</dt><dd className="mt-3 text-sm leading-relaxed text-muted-foreground">{answer}</dd></div>; })}</dl></Section>
      <Section tone="paper"><SectionHeading eyebrow="Related help" title="More flight-booking assistance" description="Continue with another booking or travel-support topic." /><div className="mt-8 grid gap-3 md:grid-cols-3">{page.related.map(([label, path]) => <Link key={path} to={path} className="rounded-xl border border-border bg-card px-5 py-4 text-sm font-semibold text-primary">{label} <span aria-hidden="true">→</span></Link>)}</div></Section>
      <Section tone="navy"><div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between"><div className="max-w-2xl"><p className="label-board text-accent">Need help now?</p><h2 className="mt-3 text-3xl font-semibold sm:text-4xl">Talk through your flight situation with a specialist</h2><p className="mt-4 text-base leading-relaxed text-primary-foreground/80">Call {SITE.phoneDisplay}. We are available 24/7 for travel-planning and booking assistance.</p></div><CallCta size="lg" showNumber ocid={kind + ".final_call"} /></div></Section>
    </>
  );
}
export function FlightCancellationAssistancePage() { return <SupportPage kind="cancellation" />; }
export function MissedFlightRebookingPage() { return <SupportPage kind="missedFlight" />; }
