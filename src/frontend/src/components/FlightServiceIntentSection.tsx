import { CallCta } from "@/components/CallCta";
import { Section, SectionHeading } from "@/components/Section";

type Props = {
  airline?: string;
  routeLabel?: string;
  country?: string;
  hub?: string;
  airportLabel?: string;
};

export function FlightServiceIntentSection({
  airline,
  routeLabel,
  country,
  hub,
  airportLabel,
}: Props) {
  const subject = airline
    ? `${airline} flight`
    : routeLabel
      ? `${routeLabel} flight`
      : "flight";
  const destinationContext = country
    ? ` for travelers in the United States traveling to ${country}`
    : "";
  const hubContext = hub ? ` The main connection hub is ${hub}.` : "";
  const airportContext = airportLabel ? ` Major gateway context: ${airportLabel}.` : "";

  // Keep airline + service combinations explicit for visitors searching for
  // airline-specific changes, cancellations, and rebooking help. The shared
  // layout remains the same; the wording reflects the service intent.
  const topics = [
    [
      airline ? `${airline} Flight Booking` : "New Flight Booking",
      `Discuss dates, routing, traveler details, cabin preference, and the complete fare for a new ${subject} before authorizing payment.`,
    ],
    [
      airline ? `${airline} Changes` : "Change an Existing Flight",
      `Review the ticket's change rules, deadlines, possible fare differences, and available alternatives for your existing ${subject}.`,
    ],
    [
      airline ? `${airline} Cancellation` : "Cancellation Options",
      `Check the cancellation deadline, possible refund or credit, and any applicable fees before authorizing a request for your ${subject}.`,
    ],
    [
      airline ? `${airline} Rebooking` : "Rebook a Flight",
      `Compare replacement dates and routes for your ${subject}; options depend on the original ticket terms and current availability.`,
    ],
  ] as const;

  return (
    <Section tone="paper" ocid="flight_service_intent">
      <SectionHeading
        eyebrow="Flight changes, cancellations & rebooking"
        title={`${subject.charAt(0).toUpperCase() + subject.slice(1)} support when plans change`}
        description={`Need to change, cancel, rebook, reschedule, or book a ${subject}${destinationContext}? Review the service options below and call when you want to discuss the details with a travel specialist.${hubContext}${airportContext}`}
      />
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {topics.map(([title, body]) => (
          <article key={title} className="rounded-2xl border border-border bg-card p-5 shadow-subtle">
            <h3 className="font-display text-base font-semibold">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
          </article>
        ))}
      </div>
      <div className="mt-8 flex justify-center">
        <CallCta size="lg" ocid="flight_service_intent.call" />
      </div>
    </Section>
  );
}
