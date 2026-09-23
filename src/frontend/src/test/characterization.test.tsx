import { screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ADDRESS_LINE, SITE } from "@/lib/site";
import { renderRoute } from "@/test/render-route";

/**
 * Characterization baseline for TicketDepart behavior that the upcoming
 * request does NOT intentionally change. The request expands the callback
 * form's field set, adds backend fields, changes the success state, adds
 * airline images, and expands SEO/structured data — none of that is frozen
 * here. What is frozen is adjacent working behavior: the airline FAQ content,
 * the contact page's own contact-details block, and the "what happens next"
 * steps. These are the parts a rewrite of the form or the SEO layer could
 * silently break.
 */

const AIRLINE_PAGES = [
  {
    path: "/delta-airlines",
    heading: /delta airlines bookings handled/i,
    faqOcid: "delta.faq",
    // A question unique to the Delta page, so a copy-paste across pages fails.
    uniqueQuestion: /can ticketdepart book delta airlines flights for me\?/i,
  },
  {
    path: "/united-airlines",
    heading: /united airlines itineraries/i,
    faqOcid: "united.faq",
    uniqueQuestion: /is ticketdepart part of united airlines\?/i,
  },
  {
    path: "/american-airlines",
    heading: /american airlines trips/i,
    faqOcid: "american.faq",
    uniqueQuestion: /is ticketdepart affiliated with american airlines\?/i,
  },
] as const;

/**
 * Reads the FAQ question/answer text from a page's FAQ section. The three
 * airline pages render the same content with two different markup shapes —
 * Delta and American use `<dl>` with `<dt>`/`<dd>`, United uses `<h3>`/`<p>` —
 * so read each `faq_item` container and accept either question/answer element.
 */
function readFaq(faqOcid: string): { questions: string[]; answers: string[] } {
  const section = document.querySelector(`[data-ocid="${faqOcid}"]`);
  if (!section) throw new Error(`FAQ section ${faqOcid} not found`);

  const items = Array.from(
    section.querySelectorAll<HTMLElement>('[data-ocid*=".faq_item."]'),
  );
  const questions: string[] = [];
  const answers: string[] = [];
  for (const item of items) {
    const question = item.querySelector("dt, h3");
    const answer = item.querySelector("dd, p");
    if (question) questions.push((question.textContent ?? "").trim());
    if (answer) answers.push((answer.textContent ?? "").trim());
  }
  return { questions, answers };
}

describe("airline FAQ content", () => {
  it.each(AIRLINE_PAGES)(
    "$path keeps a substantive FAQ with its own questions",
    async ({ path, heading, faqOcid, uniqueQuestion }) => {
      renderRoute(path);
      await screen.findByRole("heading", { level: 1, name: heading });

      const { questions, answers } = readFaq(faqOcid);

      // Each airline page renders its FAQ as question/answer pairs. Assert the
      // pairs are real content, not empty placeholders.
      expect(questions.length).toBeGreaterThanOrEqual(5);
      expect(answers.length).toBe(questions.length);
      for (const question of questions) {
        expect(question.length).toBeGreaterThan(10);
      }
      for (const answer of answers) {
        expect(answer.length).toBeGreaterThan(40);
      }

      // The page's own question must be present, so the three pages are not
      // sharing one generic FAQ block.
      expect(questions.some((question) => uniqueQuestion.test(question))).toBe(
        true,
      );
    },
  );

  it("does not reuse the same FAQ questions across the three airline pages", async () => {
    const questionSets: string[][] = [];
    for (const { path, heading, faqOcid } of AIRLINE_PAGES) {
      const { unmount } = renderRoute(path);
      await screen.findByRole("heading", { level: 1, name: heading });
      questionSets.push(
        readFaq(faqOcid).questions.map((question) => question.toLowerCase()),
      );
      unmount();
    }

    // No question may appear on more than one airline page.
    const seen = new Set<string>();
    for (const questions of questionSets) {
      for (const question of questions) {
        expect(seen.has(question)).toBe(false);
        seen.add(question);
      }
    }
  });
});

describe("contact page contact details", () => {
  it("lists phone, email, office, and hours with working links", async () => {
    renderRoute("/contact");
    await screen.findByRole("heading", {
      level: 1,
      name: /talk to a real travel specialist/i,
    });

    const details = document.querySelector(
      '[data-ocid="contact.details.section"]',
    );
    expect(details).not.toBeNull();
    const scope = within(details as HTMLElement);

    expect(
      scope.getByRole("link", { name: SITE.phoneDisplay }),
    ).toHaveAttribute("href", SITE.phoneHref);
    expect(scope.getByRole("link", { name: SITE.email })).toHaveAttribute(
      "href",
      SITE.emailHref,
    );
    expect(scope.getByText(ADDRESS_LINE)).toBeInTheDocument();
    expect(scope.getByText(/open 24\/7/i)).toBeInTheDocument();
  });

  it("explains the three steps that follow a request", async () => {
    renderRoute("/contact");
    await screen.findByRole("heading", {
      level: 1,
      name: /talk to a real travel specialist/i,
    });

    expect(
      screen.getByRole("heading", { name: /we review your request/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /we call or email you back/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: /you decide, we handle the rest/i,
      }),
    ).toBeInTheDocument();
  });
});
