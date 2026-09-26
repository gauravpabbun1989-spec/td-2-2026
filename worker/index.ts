type Env = { ASSETS: Fetcher; };

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store", "access-control-allow-origin": "*" } });
}

function validDate(value: string) { return /^\d{4}-\d{2}-\d{2}$/.test(value); }
function weekday(value: string) { return new Intl.DateTimeFormat("en-US", { weekday: "short", timeZone: "UTC" }).format(new Date(value + "T00:00:00Z")); }
function formatDuration(minutes?: number) { if (!minutes || minutes <= 0) return undefined; const hours = Math.floor(minutes / 60); const mins = minutes % 60; return hours ? hours + "h " + mins + "m" : mins + "m"; }

async function fetchRoute(origin: string, destination: string) {
  const response = await fetch("https://air-routes.com/api/route/" + origin + "-" + destination, { headers: { accept: "application/json" } });
  if (!response.ok) { if (response.status === 404) return null; throw new Error("Air-Routes could not return this route."); }
  return (await response.json()) as { route_id?: string; from?: string; to?: string; status?: string; seasonality_label?: string | null; flying_min?: number; airlines?: Array<{ airline_code?: string; airline?: string; schedule?: Array<{ day?: string; times?: string[] }>; seasonal_note?: string | null; }>; };
}

function normalize(route: Awaited<ReturnType<typeof fetchRoute>>, requestedDate: string) {
  if (!route) return [];
  const requestedDay = weekday(requestedDate);
  const flights: Array<Record<string, unknown>> = [];
  for (const airline of route.airlines ?? []) {
    for (const day of airline.schedule ?? []) {
      if (day.day !== requestedDay) continue;
      for (const time of day.times ?? []) {
        flights.push({
          id: (route.route_id ?? ((route.from ?? "") + "-" + (route.to ?? ""))) + "-" + (airline.airline_code ?? airline.airline ?? "airline") + "-" + requestedDate + "-" + time,
          airlineName: airline.airline ?? airline.airline_code ?? "Airline",
          flightNumber: "",
          departure: { iata: route.from ?? "", city: "", date: requestedDate, time },
          arrival: { iata: route.to ?? "", city: "", date: requestedDate, time: "" },
          duration: formatDuration(route.flying_min),
          stops: 0,
          status: route.status === "active" ? "Scheduled route" : route.status ?? "Scheduled route",
        });
      }
    }
  }
  return flights;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // Keep one canonical URL form for static pages. Cloudflare Assets can
    // serve both /path and /path/; redirect the trailing-slash variant so
    // search engines see a single URL instead of duplicate page variants.
    if (url.pathname.length > 1 && url.pathname.endsWith("/") && !url.pathname.startsWith("/api/")) {
      const canonicalUrl = new URL(url);
      canonicalUrl.pathname = canonicalUrl.pathname.replace(/\\/+$/, "");
      return Response.redirect(canonicalUrl.toString(), 301);
    }

    if (url.pathname !== "/api/flight-schedules") return env.ASSETS.fetch(request);
    if (request.method !== "GET") return json({ error: "Method not allowed" }, 405);
    const origin = (url.searchParams.get("origin") ?? "").toUpperCase();
    const destination = (url.searchParams.get("destination") ?? "").toUpperCase();
    const departureDate = url.searchParams.get("departureDate") ?? "";
    const returnDate = url.searchParams.get("returnDate") ?? "";
    const tripType = url.searchParams.get("tripType") ?? "One way";
    if (!/^[A-Z]{3}$/.test(origin) || !/^[A-Z]{3}$/.test(destination)) return json({ error: "Origin and destination must be IATA airport codes." }, 400);
    if (!validDate(departureDate) || (returnDate && !validDate(returnDate))) return json({ error: "Use YYYY-MM-DD dates." }, 400);
    if (tripType === "Round trip" && (!returnDate || returnDate < departureDate)) return json({ error: "A valid return date is required for a round trip." }, 400);
    try {
      const outbound = await fetchRoute(origin, destination);
      const flights = normalize(outbound, departureDate);
      if (tripType === "Round trip") { const inbound = await fetchRoute(destination, origin); flights.push(...normalize(inbound, returnDate)); }
      return json({ flights, source: "Air-Routes.com", dateSpecificMatch: true, note: "Results are matched to the selected date’s operating weekday. Air-Routes does not provide unique flight numbers or date-specific flight records." });
    } catch (error) {
      return json({ error: error instanceof Error ? error.message : "Schedule search failed." }, 502);
    }
  },
};