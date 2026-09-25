import { CallCta } from "@/components/CallCta";
import { Section, SectionHeading } from "@/components/Section";
import { Seo } from "@/components/Seo";
import { SITE } from "@/lib/site";
import { ArrowRight, Phone, Search } from "lucide-react";
import { useMemo, useState } from "react";

const AIRPORTS_URL =
  "https://raw.githubusercontent.com/jpatokal/openflights/master/data/airports.dat";
const AIRLINES_URL =
  "https://raw.githubusercontent.com/jpatokal/openflights/master/data/airlines.dat";
const ROUTES_URL =
  "https://raw.githubusercontent.com/jpatokal/openflights/master/data/routes.dat";

type Airport = { id: string; name: string; city: string; country: string; iata: string };
type LocationChoice = { type: "city" | "airport"; city: string; iata?: string; label: string };
type Airline = { id: string; name: string };
type Route = {
  airline: string;
  airlineId: string;
  source: string;
  destination: string;
  codeshare: string;
  stops: number;
  equipment: string;
};
type Result = Route & {
  airlineName: string;
  sourceAirport: Airport;
  destinationAirport: Airport;
};

const PAGE_PATH = "/flight-search";
const PAGE_TITLE = "Flight Search | Search Flights by City or Airport | TicketDepart";
const PAGE_DESCRIPTION =
  "Search flights by city or airport, choose dates, travelers, and cabin, then call TicketDepart to confirm booking details.";

function parseDat(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    if (char === '"') {
      if (quoted && text[i + 1] === '"') {
        field += '"';
        i += 1;
      } else {
        quoted = !quoted;
      }
    } else if (char === "," && !quoted) {
      row.push(field);
      field = "";
    } else if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && text[i + 1] === "\n") i += 1;
      row.push(field);
      if (row.some((value) => value.trim())) rows.push(row);
      row = [];
      field = "";
    } else {
      field += char;
    }
  }
  if (field || row.length) {
    row.push(field);
    if (row.some((value) => value.trim())) rows.push(row);
  }
  return rows;
}

async function loadData() {
  const responses = await Promise.all([
    fetch(AIRPORTS_URL),
    fetch(AIRLINES_URL),
    fetch(ROUTES_URL),
  ]);
  if (responses.some((response) => !response.ok)) {
    throw new Error("Free flight reference data could not be loaded.");
  }
  const [airportText, airlineText, routeText] = await Promise.all(
    responses.map((response) => response.text()),
  );

  const airports = parseDat(airportText)
    .map((r) => ({
      id: r[0] ?? "",
      name: r[1] ?? "",
      city: r[2] ?? "",
      country: r[3] ?? "",
      iata: r[4] === "\\N" ? "" : r[4] ?? "",
    }))
    .filter((a) => a.iata);

  const airlines = parseDat(airlineText)
    .map((r) => ({ id: r[0] ?? "", name: r[1] ?? "" }))
    .filter((a) => a.id && a.name);

  const routes = parseDat(routeText)
    .map((r) => ({
      airline: r[0] ?? "",
      airlineId: r[1] ?? "",
      source: r[2] ?? "",
      destination: r[4] ?? "",
      codeshare: r[6] === "\\N" ? "" : r[6] ?? "",
      stops: Number.parseInt(r[7] ?? "0", 10) || 0,
      equipment: r[8] === "\\N" ? "" : r[8] ?? "",
    }))
    .filter((r) => r.source && r.destination);

  return { airports, airlines, routes };
}

function matches(airports: Airport[], query: string): Airport[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return airports
    .filter((a) =>
      [a.iata, a.name, a.city, a.country].join(" ").toLowerCase().includes(q),
    )
    .slice(0, 10);
}

function choices(airports: Airport[], query: string): LocationChoice[] {
  const matched = matches(airports, query);
  if (!query.trim()) return [];
  const cityMap = new Map<string, Airport>();
  matched.forEach((airport) => {
    const key = airport.city.toLowerCase() + "|" + airport.country.toLowerCase();
    if (!cityMap.has(key)) cityMap.set(key, airport);
  });
  const cityChoices: LocationChoice[] = Array.from(cityMap.values())
    .slice(0, 3)
    .map((airport) => ({
      type: "city" as const,
      city: airport.city,
      label: airport.city + ", " + airport.country + " — All airports",
    }));
  const airportChoices: LocationChoice[] = matched.slice(0, 7).map((airport) => ({
    type: "airport" as const,
    city: airport.city,
    iata: airport.iata,
    label: airport.city + " — " + airport.name + " (" + airport.iata + ")",
  }));
  return [...cityChoices, ...airportChoices];
}

export function FlightSearchPage() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [fromChoice, setFromChoice] = useState<LocationChoice | null>(null);
  const [toChoice, setToChoice] = useState<LocationChoice | null>(null);
  const [tripType, setTripType] = useState("Round trip");
  const [date, setDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [travelers, setTravelers] = useState("1");
  const [cabin, setCabin] = useState("Economy");
  const [data, setData] = useState<Awaited<ReturnType<typeof loadData>> | null>(null);
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const ensureData = async () => {
    if (data) return data;
    const loaded = await loadData();
    setData(loaded);
    return loaded;
  };

  const fromMatches = useMemo(() => choices(data?.airports ?? [], from), [data, from]);
  const toMatches = useMemo(() => choices(data?.airports ?? [], to), [data, to]);

  const search = async () => {
    setLoading(true);
    setError("");
    setResults([]);
    try {
      const loaded = await ensureData();
      if (!data) setData(loaded);
      if (!fromChoice || !toChoice) {
        throw new Error("Select a City or Airport from the suggestions for both departure and destination.");
      }
      const sourceAirports = loaded.airports.filter((airport) =>
        fromChoice.type === "airport"
          ? airport.iata === fromChoice.iata
          : airport.city.toLowerCase() === fromChoice.city.toLowerCase(),
      );
      const destinationAirports = loaded.airports.filter((airport) =>
        toChoice.type === "airport"
          ? airport.iata === toChoice.iata
          : airport.city.toLowerCase() === toChoice.city.toLowerCase(),
      );
      const sourceCodes = new Set(sourceAirports.map((airport) => airport.iata));
      const destinationCodes = new Set(destinationAirports.map((airport) => airport.iata));
      const airportByIata = new Map(loaded.airports.map((airport) => [airport.iata, airport]));
      const airlineNames = new Map(loaded.airlines.map((a) => [a.id, a.name]));
      setResults(
        loaded.routes
          .filter((r) => sourceCodes.has(r.source) && destinationCodes.has(r.destination))
          .map((r) => {
            const source = airportByIata.get(r.source);
            const destination = airportByIata.get(r.destination);
            return source && destination
              ? {
                  ...r,
                  airlineName: airlineNames.get(r.airlineId) ?? r.airline ?? "Airline not listed",
                  sourceAirport: source,
                  destinationAirport: destination,
                }
              : null;
          })
          .filter((result): result is Result => Boolean(result))
          .slice(0, 40),
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Search failed.");
    } finally {
      setLoading(false);
    }
  };

  const suggestionList = (
    values: LocationChoice[],
    setValue: (value: string) => void,
    setChoice: (choice: LocationChoice) => void,
  ) =>
    values.length > 0 ? (
      <div className="absolute z-20 mt-1 w-full overflow-hidden rounded-xl border border-border bg-card p-1 shadow-elevated">
        {values.map((choice, index) => (
          <button
            type="button"
            key={choice.type + "-" + choice.city + "-" + (choice.iata ?? index)}
            onClick={() => {
              setChoice(choice);
              setValue(choice.type === "city" ? choice.city + ", " + choice.label.split(", ")[1] : choice.city + " (" + choice.iata + ")");
            }}
            className="block w-full rounded-lg px-3 py-3 text-left text-sm hover:bg-muted"
          >
            <span className="mr-2 rounded-full border border-border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
              {choice.type === "city" ? "City" : "Airport"}
            </span>
            <strong>{choice.type === "city" ? choice.label : choice.city}</strong>
            {choice.type === "airport" && <span className="text-muted-foreground"> — {choice.label.split(" — ")[1]}</span>}
          </button>
        ))}
      </div>
    ) : null;

  return (
    <>
      <Seo title={PAGE_TITLE} description={PAGE_DESCRIPTION} path={PAGE_PATH} />
      <section
        className="relative overflow-visible bg-cover bg-center py-16 sm:py-24"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0, 28, 45, 0.42), rgba(0, 28, 45, 0.58)), url(https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2000&q=85)",
        }}
      >
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl text-center text-white">
            <p className="label-board text-white/90">Flight Search</p>
            <h1 className="mt-4 text-balance text-4xl font-bold leading-[1.08] sm:text-5xl lg:text-6xl">
              Search airports, airlines, and routes — then call for the fare
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-white/90 sm:text-lg">
              Search by city or airport, choose your travel dates and cabin, then call TicketDepart to confirm your booking.
            </p>
          </div>

        <div className="mt-10 rounded-2xl border border-white/30 bg-white/95 p-5 shadow-elevated backdrop-blur-sm sm:p-7">
          <div className="grid gap-5 md:grid-cols-2">
            <label className="relative">
              <span className="text-sm font-semibold">From city or airport</span>
              <input value={from} onFocus={() => { void ensureData(); }} onChange={(e) => { setFrom(e.target.value); setFromChoice(null); }}
                placeholder="Enter city, airport, or IATA code"
                className="mt-2 h-12 w-full rounded-xl border border-border bg-background px-4 outline-none focus-visible:ring-2 focus-visible:ring-ring" />
              {suggestionList(fromMatches, setFrom, setFromChoice)}
            </label>
            <label className="relative">
              <span className="text-sm font-semibold">To city or airport</span>
              <input value={to} onFocus={() => { void ensureData(); }} onChange={(e) => { setTo(e.target.value); setToChoice(null); }}
                placeholder="City or airport code"
                className="mt-2 h-12 w-full rounded-xl border border-border bg-background px-4 outline-none focus-visible:ring-2 focus-visible:ring-ring" />
              {suggestionList(toMatches, setTo, setToChoice)}
            </label>
            <label>
              <span className="text-sm font-semibold">Trip type</span>
              <select value={tripType} onChange={(e) => { setTripType(e.target.value); if (e.target.value === "One way") setReturnDate(""); }}
                className="mt-2 h-12 w-full rounded-xl border border-border bg-background px-4 outline-none focus-visible:ring-2 focus-visible:ring-ring">
                <option>Round trip</option>
                <option>One way</option>
              </select>
            </label>
            <label>
              <span className="text-sm font-semibold">Departure date</span>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
                className="mt-2 h-12 w-full rounded-xl border border-border bg-background px-4 outline-none focus-visible:ring-2 focus-visible:ring-ring" />
            </label>
            <label>
              <span className="text-sm font-semibold">Return date</span>
              <input type="date" value={returnDate} min={date || undefined} disabled={tripType === "One way"} onChange={(e) => setReturnDate(e.target.value)}
                className="mt-2 h-12 w-full rounded-xl border border-border bg-background px-4 outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50" />
            </label>
            <label>
              <span className="text-sm font-semibold">Travelers</span>
              <select value={travelers} onChange={(e) => setTravelers(e.target.value)}
                className="mt-2 h-12 w-full rounded-xl border border-border bg-background px-4 outline-none focus-visible:ring-2 focus-visible:ring-ring">
                {Array.from({ length: 9 }, (_, i) => String(i + 1)).map((count) => (
                  <option key={count} value={count}>{count} {count === "1" ? "traveler" : "travelers"}</option>
                ))}
              </select>
            </label>
            <label>
              <span className="text-sm font-semibold">Cabin</span>
              <select value={cabin} onChange={(e) => setCabin(e.target.value)}
                className="mt-2 h-12 w-full rounded-xl border border-border bg-background px-4 outline-none focus-visible:ring-2 focus-visible:ring-ring">
                <option>Economy</option>
                <option>Premium Economy</option>
                <option>Business</option>
                <option>First</option>
              </select>
            </label>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <button type="button" onClick={search} disabled={loading}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary px-6 font-semibold text-primary-foreground disabled:opacity-60">
              <Search aria-hidden="true" className="size-4" />
              {loading ? "Searching…" : "Search flights"}
            </button>
            <span className="text-sm text-muted-foreground">
              {tripType} · {date ? "Depart: " + date + " · " : ""}{returnDate ? "Return: " + returnDate + " · " : ""}{travelers} traveler{travelers === "1" ? "" : "s"} · {cabin}
            </span>
          </div>
          {error && <p role="alert" className="mt-4 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">{error}</p>}
        </div>
        </div>
      </section>

      <Section tone="muted" ocid="flight_search.results" aria-labelledby="flight_search_results_heading">
        <SectionHeading id="flight_search_results_heading" eyebrow="Route results"
          title={results.length ? results.length + " route option" + (results.length === 1 ? "" : "s") + " found" : "Route information"}
          description="Review available route options, then call TicketDepart to confirm the selected travel dates, schedule, fare, and booking conditions." />
        {results.length > 0 ? (
          <div className="mt-10 grid gap-4">
            {results.map((result, index) => (
              <article key={result.airlineId + "-" + result.source + "-" + result.destination + "-" + index}
                className="rounded-2xl border border-border bg-card p-5 shadow-subtle sm:p-6">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                      <span className="rounded-full bg-primary/5 px-3 py-1 font-semibold text-primary">{result.airlineName}</span>
                      <span>{result.stops === 0 ? "Direct route" : result.stops + " stop" + (result.stops === 1 ? "" : "s")}</span>
                      {result.codeshare && <span className="rounded-full border border-border px-3 py-1">Codeshare</span>}
                    </div>
                    <div className="mt-4 flex items-center gap-3">
                      <div><p className="text-xl font-bold">{result.sourceAirport.iata}</p><p className="text-sm text-muted-foreground">{result.sourceAirport.city}</p></div>
                      <ArrowRight aria-hidden="true" className="size-5 text-accent" />
                      <div><p className="text-xl font-bold">{result.destinationAirport.iata}</p><p className="text-sm text-muted-foreground">{result.destinationAirport.city}</p></div>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                      <span>Baggage: allowance varies by fare</span>
                      {result.equipment && <span>Reference equipment: {result.equipment}</span>}
                    </div>
                  </div>
                  <div className="flex w-full shrink-0 flex-col items-center lg:w-64">
                    <a href={SITE.phoneHref}
                      className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary px-5 font-semibold text-primary-foreground">
                      <Phone aria-hidden="true" className="size-4" /> Call for Best Fare
                    </a>
                    <p className="mt-2 text-center text-[11px] leading-4 text-muted-foreground">
                      *Complimentary extra add-ons may be available with select fares. Availability and eligibility vary.
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-10 rounded-2xl border border-border bg-card p-7 text-sm text-muted-foreground">
            Enter a departure and destination above to search flights.
          </div>
        )}
      </Section>

      <Section tone="paper" ocid="flight_search.cta">
        <div className="grid gap-8 rounded-3xl border border-border bg-card p-7 shadow-elevated sm:p-10 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="label-board text-accent">Ready to book?</p>
            <h2 className="mt-3 text-3xl font-bold">Call for the fare and availability</h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              A specialist can confirm the current schedule, fare, taxes, baggage allowance, and booking conditions for your selected trip.
            </p>
          </div>
          <CallCta size="lg" ocid="flight_search.call_button" />
        </div>
      </Section>

      <Section tone="muted" ocid="flight_search.disclosure">
        <p className="text-sm leading-relaxed text-muted-foreground">
          Search details are used to help identify your requested trip. Current fare, schedule, baggage, and availability details are confirmed before booking.{" "}{SITE.disclosure}
        </p>
      </Section>
    </>
  );
}
