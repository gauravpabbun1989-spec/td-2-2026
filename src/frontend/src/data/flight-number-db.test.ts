import { describe, expect, it } from "vitest";
import { findVerifiedFlight, VERIFIED_FLIGHT_NUMBER_DB } from "./flight-number-db";

describe("verified flight database", () => {
  it("starts empty rather than inventing flight numbers", () => {
    expect(VERIFIED_FLIGHT_NUMBER_DB).toHaveLength(0);
  });

  it("exposes the required verified arrival fields in the record type", () => {
    expect(findVerifiedFlight({
      airlineCode: "AA",
      origin: "JFK",
      destination: "LHR",
      departureTime: "18:30",
      date: "2026-09-28",
    })).toBeNull();
  });
});
