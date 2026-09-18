import { Section, SectionHeading } from "@/components/Section";
import { faqSchema } from "@/lib/seo";
import { Link } from "@tanstack/react-router";
import { ChevronDown } from "lucide-react";

export const HOME_FAQS = [
  {
    question: "Is TicketDepart an airline?",
    answer:
      "No. TicketDepart is an independent travel agency. We are not affiliated with, endorsed by, or the official customer service of any airline. We research, compare, and book flights on your behalf as your agent.",
  },
  {
    question: "How much does it cost to call?",
    answer:
      "Calling is free and there is no obligation to book. You can ask questions, compare options, and decide afterward. If you do book, any service fee is disclosed clearly before you confirm.",
  },
  {
    question: "Can you help with international flights?",
    answer:
      "Yes. International travel is a large part of what we do, including long-haul routes, connections through major hubs, and itineraries that cross multiple regions. We can also talk through entry requirements and realistic connection times.",
  },
  {
    question: "What is a multi-city itinerary?",
    answer:
      "A multi-city itinerary has more than one stopover or direction change — for example, flying into one city and out of another, or visiting several cities in sequence. We sequence the segments so the routing and pricing work together.",
  },
  {
    question: "Can you book group travel?",
    answer:
      "Yes. We handle family groups, sports teams, church and community groups, and corporate travel. Call with your traveler count and dates and we will work through seating and coordination.",
  },
  {
    question: "What if my plans change after booking?",
    answer:
      "Call us. We will review the fare conditions on your ticket, explain what changes are allowed and any costs involved, and rebook or restructure the trip where possible.",
  },
  {
    question: "Do you charge for changes or cancellations?",
    answer:
      "Any airline change or cancellation fees come from the fare rules of your ticket, and we explain those before you book. Where we apply a service fee for handling a change, we tell you the amount before we proceed.",
  },
  {
    question: "How do I get my ticket after booking?",
    answer:
      "Once your booking is confirmed, we send your confirmation and itinerary to the email address you provide. Your ticket number and flight details will be included so you can check in directly with the airline.",
  },
] as const;

/**
 * Visible FAQ section. The same data drives the FAQPage structured data so the
 * markup and the schema can never disagree.
 */
export function HomeFaq() {
  return (
    <Section
      tone="paper"
      ocid="home.faq_section"
      aria-labelledby="home-faq-heading"
    >
      <SectionHeading
        id="home-faq-heading"
        eyebrow="Questions"
        title="Frequently asked questions"
        description="Straight answers about how our flight booking service works."
      />

      <div className="mt-12 grid gap-3 lg:grid-cols-2 lg:gap-x-8">
        {HOME_FAQS.map((faq, index) => (
          <details
            key={faq.question}
            data-ocid={`home.faq_item.${index + 1}`}
            className="group rounded-xl border border-border bg-card px-5 py-4 shadow-subtle transition-smooth open:shadow-elevated"
          >
            <summary className="flex min-h-11 cursor-pointer list-none items-start justify-between gap-4 text-left text-base font-semibold leading-snug marker:content-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background">
              <span>{faq.question}</span>
              <ChevronDown
                aria-hidden="true"
                className="mt-0.5 size-5 shrink-0 text-accent transition-transform duration-300 group-open:rotate-180"
              />
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {faq.answer}
            </p>
          </details>
        ))}
      </div>

      <p className="mt-10 text-sm leading-relaxed text-muted-foreground">
        Still have a question?{" "}
        <Link
          to="/contact"
          data-ocid="home.faq_contact_link"
          className="font-medium text-primary underline underline-offset-4 transition-smooth hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          Contact our travel desk
        </Link>{" "}
        and a specialist will answer it.
      </p>
    </Section>
  );
}

/** FAQPage structured data matching the visible questions above. */
export function homeFaqSchema(): Record<string, unknown> {
  return faqSchema(HOME_FAQS);
}
