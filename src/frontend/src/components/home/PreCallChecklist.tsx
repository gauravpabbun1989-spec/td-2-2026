import { Section, SectionHeading } from "@/components/Section";
import { Link } from "@tanstack/react-router";
import { Check } from "lucide-react";

const CHECKLIST = [
  {
    title: "Your departure and arrival cities",
    detail:
      "Airport names or codes if you know them — and whether nearby airports are acceptable.",
  },
  {
    title: "Travel dates and flexibility",
    detail:
      "Exact dates if you have them, or the window you are working with if you can move a day or two.",
  },
  {
    title: "Number of travelers",
    detail:
      "Adults, children with their ages, and infants. This changes both pricing and seating.",
  },
  {
    title: "Passport names as printed",
    detail:
      "Tickets must match the passport exactly. Have the full legal names in front of you.",
  },
  {
    title: "Baggage needs",
    detail:
      "Checked bags, carry-on only, or sports and oversized equipment you need to bring.",
  },
  {
    title: "Seating and cabin preferences",
    detail:
      "Aisle or window, seats together, extra legroom, or a premium cabin you are considering.",
  },
  {
    title: "Any loyalty or known traveler numbers",
    detail:
      "Frequent flyer numbers and TSA PreCheck or Global Entry details, if you want them applied.",
  },
  {
    title: "Your budget range",
    detail:
      "A realistic range helps us show you the right options first instead of the most expensive ones.",
  },
] as const;

/**
 * Practical pre-call checklist. Giving travelers this list up front makes the
 * first call faster and more useful for both sides.
 */
export function PreCallChecklist() {
  return (
    <Section
      tone="navy"
      ocid="home.pre_call_section"
      aria-labelledby="home-pre-call-heading"
    >
      <SectionHeading
        id="home-pre-call-heading"
        eyebrow="Before you call"
        title="Have these details ready"
        description="You do not need all of it — but the more you have, the faster we can quote accurate options."
        className="[&_p:last-child]:text-primary-foreground/75"
      />

      <ul className="mt-12 grid gap-x-8 gap-y-6 sm:grid-cols-2">
        {CHECKLIST.map((item, index) => (
          <li
            key={item.title}
            data-ocid={`home.checklist_item.${index + 1}`}
            className="flex items-start gap-3.5 border-t border-primary-foreground/15 pt-5"
          >
            <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
              <Check aria-hidden="true" className="size-3.5" strokeWidth={3} />
            </span>
            <div className="min-w-0">
              <h3 className="text-base font-semibold leading-snug">
                {item.title}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-primary-foreground/75">
                {item.detail}
              </p>
            </div>
          </li>
        ))}
      </ul>

      <p className="mt-10 text-sm leading-relaxed text-primary-foreground/75">
        Cannot call right now?{" "}
        <Link
          to="/contact/"
          data-ocid="home.pre_call_trip_request_link"
          className="font-medium text-primary-foreground underline underline-offset-4 transition-smooth hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          Send a trip request
        </Link>{" "}
        with the same details and we will follow up.
      </p>
    </Section>
  );
}
