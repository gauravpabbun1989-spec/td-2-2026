import { Section, SectionHeading } from "@/components/Section";
import { HOME_FAQS } from "@/components/home/HomeFaq.data";
import { Link } from "@tanstack/react-router";
import { ChevronDown } from "lucide-react";

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
