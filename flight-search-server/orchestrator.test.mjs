import assert from "node:assert/strict";
import { registerSource, searchSources } from "./sources/index.mjs";

registerSource({
  name: "test-source",
  async search(query) {
    assert.equal(query.from, "EWR");
    return [
      {
        airline: "Test Air",
        airlineCode: "TA",
        flightNumber: "TA100",
        direction: "outbound",
        departure: { iata: "EWR", date: query.departure, time: "08:00" },
        arrival: { iata: "LAX", date: query.departure, time: "11:00" },
        durationMinutes: 360,
        stops: 0,
        aircraft: "A320",
        cabin: query.cabin,
        fare: 999,
      },
      {
        airline: "Test Air",
        airlineCode: "TA",
        flightNumber: "TA100",
        direction: "outbound",
        departure: { iata: "EWR", date: query.departure, time: "08:00" },
        arrival: { iata: "LAX", date: query.departure, time: "11:00" },
        durationMinutes: 360,
        stops: 0,
        aircraft: "A320",
        cabin: query.cabin,
        fare: 999,
      }
    ];
  },
});

const result = await searchSources({
  from: "EWR",
  to: "LAX",
  departure: "2026-10-01",
  returnDate: "",
  travelers: 1,
  cabin: "Economy",
});

assert.equal(result.outbound.length, 1);
assert.equal(result.outbound[0].fare, undefined);
assert.equal(result.outbound[0].flightNumber, "TA100");
console.log("orchestrator tests passed");
