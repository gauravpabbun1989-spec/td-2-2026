type Env = { ASSETS: Fetcher; Serp_API?: string; SERPAPI_KEY?: string; };

function htmlResponse(response: Response) {
  if (!response.ok) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().startsWith("text/html")) return response;
  const headers = new Headers(response.headers);
  headers.set("content-type", "text/html; charset=utf-8");
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
}

function json(body: unknown, status = 200, cacheable = false) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": cacheable ? "public, max-age=60, s-maxage=900" : "no-store",
      "access-control-allow-origin": "*",
    },
  });
}

type SerpSegment = {
  departure_airport?: { id?: string; name?: string; time?: string };
  arrival_airport?: { id?: string; name?: string; time?: string };
  duration?: number;
  airline?: string;
  airline_logo?: string;
  flight_number?: string;
};

type SerpFlight = {
  flights?: SerpSegment[];
  total_duration?: number;
  price?: number;
  departure_token?: string;
  booking_token?: string;
};

function normalizeSerpFlight(option: SerpFlight, index: number, cabin: string) {
  const segments = option.flights ?? [];
  const first = segments[0];
  const last = segments.at(-1);
  const uniqueAirlines = Array.from(new Set(segments.map((segment) => segment.airline).filter(Boolean)));
  const legs = segments.map((segment, segmentIndex) => ({
    airlineName: segment.airline ?? "Airline",
    airlineCode: segment.flight_number?.split(/\s+/)[0],
    logoUrl: segment.airline_logo,
    from: segment.departure_airport?.id ?? "",
    to: segment.arrival_airport?.id ?? "",
    departureTime: segment.departure_airport?.time ?? "",
    arrivalTime: segment.arrival_airport?.time ?? "",
    arrivalDate: segment.arrival_airport?.time?.slice(0, 10),
    duration: formatDuration(segment.duration),
    layoverMinutes: segmentIndex > 0 && segments[segmentIndex - 1]?.arrival_airport?.time && segment.departure_airport?.time
      ? Math.max(0, Math.round((Date.parse(segment.departure_airport.time.replace(" ", "T")) - Date.parse((segments[segmentIndex - 1].arrival_airport?.time ?? "").replace(" ", "T"))) / 60000))
      : undefined,
  }));
  return {
    id: "serpapi-" + index + "-" + (option.departure_token ?? option.booking_token ?? crypto.randomUUID()),
    airlineName: uniqueAirlines.join(" + ") || "Airline",
    airlineCode: legs[0]?.airlineCode,
    logoUrl: option.airline_logo ?? legs[0]?.logoUrl,
    departure: {
      iata: first?.departure_airport?.id ?? "",
      city: first?.departure_airport?.name ?? "",
      date: first?.departure_airport?.time?.slice(0, 10),
      time: first?.departure_airport?.time?.slice(11, 16) ?? "",
    },
    arrival: {
      iata: last?.arrival_airport?.id ?? "",
      city: last?.arrival_airport?.name ?? "",
      date: last?.arrival_airport?.time?.slice(0, 10),
      time: last?.arrival_airport?.time?.slice(11, 16) ?? "",
    },
    duration: formatDuration(option.total_duration),
    stops: Math.max(0, segments.length - 1),
    cabin,
    price: typeof option.price === "number" ? option.price : undefined,
    departureToken: option.departure_token,
    bookingToken: option.booking_token,
    legs,
  };
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

    // Drop common automated secret/file-discovery probes before Cloudflare
    // Assets serves the SPA shell. This keeps scanner traffic out of GA4 and
    // prevents the public app from rendering a 404 page for sensitive paths.
    let normalizedPath = url.pathname;
    try { normalizedPath = decodeURIComponent(url.pathname); } catch { /* keep raw path */ }
    const sensitiveProbe =
      normalizedPath === "/.env" ||
      normalizedPath.startsWith("/.env.") ||
      normalizedPath.startsWith("/.git/") ||
      normalizedPath.startsWith("/@fs/") ||
      normalizedPath.startsWith("/wp-admin") ||
      normalizedPath.startsWith("/proc/") ||
      normalizedPath.startsWith("/api/uploads/") ||
      normalizedPath.startsWith("/api/attachments/") ||
      normalizedPath.includes("/.aws/") ||
      normalizedPath === "/.dockerenv" ||
      normalizedPath === "/server-status" ||
      normalizedPath === "/rclone.conf" ||
      normalizedPath.includes("/.config/") ||
      normalizedPath.includes("/.ssh/") ||
      normalizedPath.includes("/var/run/secrets/") ||
      normalizedPath.includes("/proc/self/") ||
      normalizedPath.includes("../") ||
      normalizedPath.includes("..%2f") ||
      normalizedPath.includes("%2e%2e%2f") ||
      normalizedPath.endsWith("/document.php") ||
      normalizedPath.endsWith("/SITEMAP.XML") ||
      /settings\/\.env(?:\/|$)/i.test(normalizedPath) ||
      /admin\/\.env(?:\/|$)/i.test(normalizedPath);

    if (sensitiveProbe) {
      return new Response("Not Found", {
        status: 404,
        headers: {
          "content-type": "text/plain; charset=utf-8",
          "cache-control": "public, max-age=300",
        },
      });
    }

    // Keep the public hostname canonical so www and non-www do not expose duplicate pages.
    if (url.hostname === "www.ticketdepart.com") {
      const canonicalUrl = new URL(url);
      canonicalUrl.hostname = "ticketdepart.com";
      return Response.redirect(canonicalUrl.toString(), 301);
    }

    // Keep one canonical URL form for static pages. Cloudflare Assets can
    // serve both /path and /path/; redirect the trailing-slash variant so
    // search engines see a single URL instead of duplicate page variants.
    if (url.pathname.length > 1 && url.pathname.endsWith("/") && !url.pathname.startsWith("/api/")) {
      const canonicalUrl = new URL(url);
      canonicalUrl.pathname = canonicalUrl.pathname.replace(/\/+$/, "");
      return Response.redirect(canonicalUrl.toString(), 301);
    }

    // Serve crawler-facing static assets explicitly before SPA/asset fallback.
    // This avoids relying on extensionless/SPA fallback behavior for XML/TXT resources.
    if (url.pathname === "/sitemap.xml" || url.pathname === "/robots.txt") {
      const assetResponse = await env.ASSETS.fetch(new Request(new URL(url.pathname, url.origin), request));
      if (assetResponse.ok) {
        const headers = new Headers(assetResponse.headers);
        headers.set("cache-control", "public, max-age=3600, s-maxage=86400");
        if (url.pathname === "/sitemap.xml") headers.set("content-type", "application/xml; charset=utf-8");
        if (url.pathname === "/robots.txt") headers.set("content-type", "text/plain; charset=utf-8");
        return new Response(assetResponse.body, { status: assetResponse.status, headers });
      }
      return new Response("Not Found", { status: 404, headers: { "content-type": "text/plain; charset=utf-8" } });
    }

    // Resolve generated route entry points explicitly. The build creates
    // /route/index.html for crawlable pages; requesting that file directly
    // makes extensionless URLs deterministic for external crawlers.
    if (url.pathname !== "/" && !url.pathname.startsWith("/api/") && !url.pathname.includes(".")) {
      const routeAssetUrl = new URL(url.toString());
      routeAssetUrl.pathname = url.pathname.replace(/\/+$/, "") + "/index.html";
      const routeResponse = await env.ASSETS.fetch(new Request(routeAssetUrl, request));
      if (routeResponse.ok) return htmlResponse(routeResponse);
    }

    if (url.pathname === "/api/flight-autocomplete") {
      if (request.method !== "GET") return json({ error: "Method not allowed" }, 405);
      const apiKey = env.Serp_API ?? env.SERPAPI_KEY;
      if (!apiKey) return json({ error: "Airport search is not configured yet." }, 503);
      const q = (url.searchParams.get("q") ?? "").trim();
      if (q.length < 2 || q.length > 100) return json({ suggestions: [] }, 200, true);
      const params = new URLSearchParams({
        engine: "google_flights_autocomplete",
        api_key: apiKey,
        q,
        gl: "us",
        hl: "en",
        exclude_regions: "true",
      });
      try {
        const response = await fetch("https://serpapi.com/search.json?" + params.toString(), {
          headers: { accept: "application/json" },
          signal: AbortSignal.timeout(8000),
        });
        const payload = await response.json() as {
          error?: string;
          suggestions?: Array<{
            position?: number;
            name?: string;
            type?: string;
            description?: string;
            airports?: Array<{ name?: string; id?: string; city?: string; city_id?: string }>;
          }>;
        };
        if (!response.ok || payload.error) return json({ error: payload.error ?? "Airport autocomplete failed." }, 502);
        const suggestions = (payload.suggestions ?? []).flatMap((suggestion) =>
          (suggestion.airports ?? []).map((airport) => ({
            type: "airport" as const,
            city: airport.city ?? suggestion.name ?? "",
            country: suggestion.description ?? "",
            iata: airport.id ?? "",
            name: airport.name ?? suggestion.name ?? "",
            label: airport.city && airport.name
              ? airport.city + " — " + airport.name + " (" + airport.id + ")"
              : (suggestion.name ?? airport.name ?? airport.id ?? ""),
          })),
        ).filter((airport) => /^[A-Z0-9]{3}$/.test(airport.iata));
        const seen = new Set<string>();
        const unique = suggestions.filter((airport) => {
          if (seen.has(airport.iata)) return false;
          seen.add(airport.iata);
          return true;
        }).slice(0, 20);
        return json({ suggestions: unique, source: "SerpApi Google Flights Autocomplete" }, 200, true);
      } catch (error) {
        return json({ error: error instanceof Error ? error.message : "Airport autocomplete failed." }, 502);
      }
    }

    if (url.pathname === "/api/flight-search") {
      if (request.method !== "GET") return json({ error: "Method not allowed" }, 405);

      const apiKey = env.Serp_API ?? env.SERPAPI_KEY;
      if (!apiKey) {
        return json({ error: "Flight search is not configured yet. Please try again shortly." }, 503);
      }

      const origin = (url.searchParams.get("origin") ?? "").toUpperCase();
      const destination = (url.searchParams.get("destination") ?? "").toUpperCase();
      const departureDate = url.searchParams.get("departureDate") ?? "";
      const returnDate = url.searchParams.get("returnDate") ?? "";
      const tripType = url.searchParams.get("tripType") ?? "One way";
      const travelers = Math.min(9, Math.max(1, Number(url.searchParams.get("travelers") ?? "1")));
      const cabin = url.searchParams.get("cabin") ?? "Economy";
      const departureToken = url.searchParams.get("departureToken") ?? "";

      if (departureToken.length > 0) {
        if (departureToken.length > 10000) return json({ error: "Invalid flight selection token." }, 400);
      } else {
        if (!/^[A-Z]{3}$/.test(origin) || !/^[A-Z]{3}$/.test(destination)) return json({ error: "Origin and destination must be IATA airport codes." }, 400);
        if (origin === destination) return json({ error: "Origin and destination cannot be the same airport." }, 400);
        if (!validDate(departureDate) || (tripType === "Round trip" && !validDate(returnDate))) return json({ error: "Use valid YYYY-MM-DD travel dates." }, 400);
        if (tripType === "Round trip" && returnDate < departureDate) return json({ error: "Return date cannot be before departure date." }, 400);
      }

      const travelClass = ({ Economy: "1", "Premium Economy": "2", Business: "3", First: "4" } as Record<string, string>)[cabin] ?? "1";
      const params = new URLSearchParams({
        engine: "google_flights",
        api_key: apiKey,
        gl: "us",
        hl: "en",
        currency: "USD",
        type: tripType === "Round trip" ? "1" : "2",
        travel_class: travelClass,
      });

      if (departureToken) {
        params.set("departure_token", departureToken);
      } else {
        params.set("departure_id", origin);
        params.set("arrival_id", destination);
        params.set("outbound_date", departureDate);
        if (tripType === "Round trip") params.set("return_date", returnDate);
        params.set("adults", String(travelers));
      }

      try {
        const response = await fetch("https://serpapi.com/search.json?" + params.toString(), {
          headers: { accept: "application/json" },
          signal: AbortSignal.timeout(15000),
        });
        const payload = await response.json() as {
          error?: string;
          best_flights?: SerpFlight[];
          other_flights?: SerpFlight[];
        };

        if (!response.ok || payload.error) {
          return json({ error: payload.error ?? "SerpApi flight search failed." }, response.status >= 400 ? 502 : 502);
        }

        const options = [...(payload.best_flights ?? []), ...(payload.other_flights ?? [])].slice(0, 20);
        const flights = options.map((option, index) => normalizeSerpFlight(option, index, cabin));
        return json({
          outbound: departureToken ? [] : flights,
          inbound: departureToken ? flights : [],
          source: "SerpApi Google Flights",
          live: true,
          travelers,
          cabin,
        }, 200, true);
      } catch (error) {
        return json({ error: error instanceof Error ? error.message : "Flight search failed." }, 502);
      }
    }

    if (url.pathname !== "/api/flight-schedules") return htmlResponse(await env.ASSETS.fetch(request));
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