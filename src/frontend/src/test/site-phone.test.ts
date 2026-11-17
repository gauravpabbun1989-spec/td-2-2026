import { describe, expect, it } from "vitest";
import { SITE } from "@/lib/site";

describe("TicketDepart production phone number", () => {
  it("uses the current number for visible CTAs and tel links", () => {
    expect(SITE.phoneDisplay).toBe("+1-833-225-0511");
    expect(SITE.phoneHref).toBe("tel:+18332250511");
  });
});
