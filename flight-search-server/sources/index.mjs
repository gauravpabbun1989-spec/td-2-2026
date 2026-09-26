import { searchLocalScheduleDatabase } from "./local-schedule-database.mjs";

const sourceAdapters = [
  {
    name: "ticketdepart-local-schedule-database",
    search: searchLocalScheduleDatabase,
  },
];

export function registerSource(adapter) {
  if (!adapter || typeof adapter.search !== "function") {
    throw new TypeError("A source adapter must expose search(query)");
  }
  sourceAdapters.push(adapter);
}

export async function searchSources(query) {
  if (!sourceAdapters.length) {
    return {
      outbound: [],
      inbound: [],
      sourceStatus: [{
        source: "none",
        status: "not_configured",
        message: "No permitted flight-information sources are configured yet.",
      }],
    };
  }

  const settled = await Promise.allSettled(
    sourceAdapters.map(async (adapter) => ({
      source: adapter.name,
      results: await adapter.search(query),
    })),
  );

  const sourceStatus = [];
  const offers = [];

  for (let i = 0; i < settled.length; i += 1) {
    const result = settled[i];
    const adapter = sourceAdapters[i];

    if (result.status === "fulfilled") {
      sourceStatus.push({ source: adapter.name, status: "ok" });
      offers.push(...result.value.results);
    } else {
      sourceStatus.push({
        source: adapter.name,
        status: "error",
        message: result.reason instanceof Error ? result.reason.message : "Source failed",
      });
    }
  }

  const unique = new Map();
  for (const offer of offers) {
    const key = [
      offer.airlineCode,
      offer.flightNumber,
      offer.departure?.iata,
      offer.arrival?.iata,
      offer.departure?.time,
      offer.arrival?.time,
      offer.departure?.date,
    ].join("|");

    if (!unique.has(key)) unique.set(key, { ...offer, fare: undefined });
  }

  const sorted = [...unique.values()].sort((a, b) =>
    String(a.departure?.time || "").localeCompare(String(b.departure?.time || "")),
  );

  return {
    outbound: sorted.filter((item) => item.direction !== "inbound"),
    inbound: sorted.filter((item) => item.direction === "inbound"),
    sourceStatus,
  };
}
