import { createActor } from "@/backend";
import { useActor } from "@caffeineai/core-infrastructure";
import { Section, SectionHeading } from "@/components/Section";
import { Seo } from "@/components/Seo";
import { SITE } from "@/lib/site";
import {
  ArrowRight,
  Check,
  ChevronDown,
  ChevronUp,
  LoaderCircle,
  Pencil,
  Phone,
  Search,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  fetchSchedules,
  formatDisplayTime,
  formatDuration,
  loadAirports,
  type FlightSchedule,
  type LocationChoice,
} from "./FlightSearchPage";

type SearchState = {
  from: string;
  to: string;
  departure: string;
  returnDate: string;
  tripType: "Round trip" | "One way";
  travelers: string;
  cabin: string;
};

const PAGE_PATH = "/flight-search-results";
const PAGE_TITLE = "Flight Search Results | TicketDepart";
const PAGE_DESCRIPTION =
  "Review flight schedule options and modify your itinerary before calling TicketDepart for reservation assistance.";

function readSearch(): SearchState | null {
  const params = new URLSearchParams(window.location.search);
  const from = (params.get("from") ?? "").trim().toUpperCase();
  const to = (params.get("to") ?? "").trim().toUpperCase();
  const departure = params.get("departure") ?? "";
  const returnDate = params.get("return") ?? "";
  const tripType = params.get("trip") === "One way" ? "One way" : "Round trip";
  const travelers = params.get("travelers") || "1";
  const cabin = params.get("cabin") || "Economy";
  if (!from || !to || !departure) return null;
  return { from, to, departure, returnDate, tripType, travelers, cabin };
}

function buildResultsUrl(search: SearchState): string {
  const params = new URLSearchParams({
    from: search.from.toUpperCase(),
    to: search.to.toUpperCase(),
    departure: search.departure,
    trip: search.tripType,
    travelers: search.travelers,
    cabin: search.cabin,
  });
  if (search.returnDate && search.tripType === "Round trip") params.set("return", search.returnDate);
  return `/flight-search-results?${params.toString()}`;
}

function ResultCard({
  result,
  selected,
  onSelect,
  showCallButton,
}: {
  result: FlightSchedule;
  selected: boolean;
  onSelect: () => void;
  showCallButton: boolean;
}) {
  const legs = result.legs?.length
    ? result.legs
    : [
        {
          airlineName: result.airlineName,
          airlineCode: result.airlineCode,
          logoUrl: result.logoUrl,
          from: result.departure.iata,
          to: result.arrival.iata,
          departureTime: result.departure.time,
          arrivalTime: result.arrival.time,
          arrivalDate: result.arrival.date,
          duration: result.duration,
        },
      ];

  return (
    <article className={`rounded-2xl border bg-card p-4 shadow-subtle transition sm:p-5 ${selected ? "border-primary ring-2 ring-primary/10" : "border-border"}`}>
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-16 items-center justify-center rounded-xl border border-border bg-background p-2">
            {result.logoUrl ? (
              <img src={result.logoUrl} alt="" className="max-h-7 max-w-14 object-contain" loading="lazy" />
            ) : (
              <span className="text-xs font-bold text-muted-foreground">{result.airlineCode ?? "AIR"}</span>
            )}
          </div>
          <div className="min-w-0">
            <p className="font-bold">{result.airlineName}</p>
            <p className="text-xs text-muted-foreground">
              {result.stops === 0 ? "Nonstop" : `${result.stops} stop${result.stops === 1 ? "" : "s"}`} · {result.duration ?? "Schedule"} · {result.cabin}
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-background/60 p-4">
          {legs.map((leg, index) => (
            <div key={`${result.id}-leg-${index}`} className={index > 0 ? "mt-4 border-t border-border pt-4" : ""}>
              {legs.length > 1 && <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Leg {index + 1}</p>}
              <div className="grid items-center gap-3 sm:grid-cols-[1fr_auto_1fr]">
                <div>
                  <p className="text-xl font-bold">{formatDisplayTime(leg.departureTime)}</p>
                  <p className="font-semibold">{leg.from}</p>
                </div>
                <div className="text-center text-xs text-muted-foreground">
                  <ArrowRight className="mx-auto size-5 text-accent" />
                  {leg.duration ?? "Schedule"}
                </div>
                <div className="sm:text-right">
                  <p className="text-xl font-bold">
                    {formatDisplayTime(leg.arrivalTime)}
                    {leg.arrivalDate && leg.arrivalDate !== result.departure.date ? " (+1 day)" : ""}
                  </p>
                  <p className="font-semibold">{leg.to}</p>
                </div>
              </div>
              <p className="mt-2 text-xs font-medium text-muted-foreground">{leg.airlineName}</p>
              {leg.layoverMinutes !== undefined && (
                <p className="mt-2 rounded-lg bg-muted px-3 py-2 text-xs font-semibold text-muted-foreground">
                  {formatDuration(leg.layoverMinutes)} layover
                </p>
              )}
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={onSelect}
          className={`inline-flex h-11 w-full items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold transition sm:w-auto sm:self-end ${selected ? "bg-primary text-primary-foreground" : "border border-primary text-primary hover:bg-primary/5"}`}
        >
          {selected ? <Check className="size-4" /> : null}
          {selected ? "Selected" : "Select itinerary"}
        </button>
        {showCallButton && (
          <a
            href={SITE.phoneHref}
            data-cta-location="results"
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-red-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 animate-pulse sm:w-auto sm:self-end"
            aria-label="Call to Book / Prices / Confirm for this selected flight"
          >
            <Phone className="size-4 animate-bounce text-white" /> Call to Book / Prices / Confirm
          </a>
        )}
      </div>
    </article>
  );
}

export function FlightSearchResultsPage() {
  const initialSearch = useMemo(() => readSearch(), []);
  const { actor, isFetching: isActorFetching } = useActor(createActor);
  const search = initialSearch;
  const [outbound, setOutbound] = useState<FlightSchedule[]>([]);
  const [inbound, setInbound] = useState<FlightSchedule[]>([]);
  const [selectedOutbound, setSelectedOutbound] = useState<FlightSchedule | null>(null);
  const [selectedReturn, setSelectedReturn] = useState<FlightSchedule | null>(null);
  const [selectedCallFlightId, setSelectedCallFlightId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [returnLoading, setReturnLoading] = useState(false);
  const [showModify, setShowModify] = useState(false);
  const [error, setError] = useState("");

  const [modifyFrom, setModifyFrom] = useState(initialSearch?.from ?? "");
  const [modifyTo, setModifyTo] = useState(initialSearch?.to ?? "");
  const [modifyDeparture, setModifyDeparture] = useState(initialSearch?.departure ?? "");
  const [modifyReturn, setModifyReturn] = useState(initialSearch?.returnDate ?? "");
  const [modifyTrip, setModifyTrip] = useState(initialSearch?.tripType ?? "Round trip");
  const [modifyTravelers, setModifyTravelers] = useState(initialSearch?.travelers ?? "1");
  const [modifyCabin, setModifyCabin] = useState(initialSearch?.cabin ?? "Economy");

  const runSearch = useCallback(async (nextSearch: SearchState) => {
    setLoading(true);
    setError("");
    setOutbound([]);
    setInbound([]);
    setSelectedOutbound(null);
    setSelectedReturn(null);
    setSelectedCallFlightId(null);
    try {
      if (nextSearch.from === nextSearch.to) throw new Error("Departure and destination cannot be the same airport.");
      if (nextSearch.tripType === "Round trip" && (!nextSearch.returnDate || nextSearch.returnDate < nextSearch.departure)) {
        throw new Error("Select a valid return date.");
      }

      const params = new URLSearchParams({
        origin: nextSearch.from,
        destination: nextSearch.to,
        departureDate: nextSearch.departure,
        tripType: nextSearch.tripType,
        travelers: nextSearch.travelers,
        cabin: nextSearch.cabin,
      });
      if (nextSearch.returnDate && nextSearch.tripType === "Round trip") params.set("returnDate", nextSearch.returnDate);

      const response = await fetch(`https://ticket-depart2.netlify.app/api/flight-search?${params.toString()}`, { headers: { accept: "application/json" } });
      const contentType = response.headers.get("content-type") ?? "";
      if (!contentType.includes("application/json")) {
        throw new Error("Live flight search service is unavailable. Please try again shortly.");
      }
      const payload = await response.json() as { outbound?: FlightSchedule[]; inbound?: FlightSchedule[]; error?: string };
      if (!response.ok) {
        throw new Error(payload.error ?? "Flight search failed.");
      }
      setOutbound(payload.outbound ?? []);
      setInbound(payload.inbound ?? []);
      if (!(payload.outbound ?? []).length) {
        setError("No live flight options were returned for this route and date. Try another date or modify your itinerary.");
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Flight search failed.");
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    if (!initialSearch) {
      setLoading(false);
      setError("This results page needs a valid flight search. Start a new search to continue.");
      return;
    }
    if (!isActorFetching) void runSearch(initialSearch);
  }, [isActorFetching, initialSearch, runSearch]);

  const updateSearch = () => {
    const next: SearchState = {
      from: modifyFrom.trim().toUpperCase(),
      to: modifyTo.trim().toUpperCase(),
      departure: modifyDeparture,
      returnDate: modifyTrip === "Round trip" ? modifyReturn : "",
      tripType: modifyTrip as SearchState["tripType"],
      travelers: modifyTravelers,
      cabin: modifyCabin,
    };
    if (!next.from || !next.to || !next.departure) {
      setError("Enter departure, destination, and departure date.");
      return;
    }
    if (next.tripType === "Round trip" && !next.returnDate) {
      setError("Select a return date for a round trip.");
      return;
    }
    window.location.assign(buildResultsUrl(next));
  };

  const itineraryReady = Boolean(selectedOutbound && (search?.tripType === "One way" || selectedReturn));
  const itinerarySummary = selectedOutbound
    ? search?.tripType === "Round trip" && selectedReturn
      ? `${selectedOutbound.departure.iata} → ${selectedOutbound.arrival.iata} · ${selectedOutbound.departure.time} | ${selectedReturn.departure.iata} → ${selectedReturn.arrival.iata} · ${selectedReturn.departure.time}`
      : `${selectedOutbound.departure.iata} → ${selectedOutbound.arrival.iata} · ${selectedOutbound.departure.time}`
    : "";

  if (!search) {
    return (
      <>
        <Seo title={PAGE_TITLE} description={PAGE_DESCRIPTION} path={PAGE_PATH} />
        <Section tone="muted">
          <div className="mx-auto max-w-4xl">
            <p className="label-board text-accent">Flight search</p>
            <h1 className="mt-3 text-balance text-3xl font-bold sm:text-4xl">
              Flight search results and itinerary planning
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-7 text-muted-foreground sm:text-lg">
              Start a new flight search to review available schedule options for your
              route and travel date. Enter your departure airport or city, destination,
              travel dates, trip type, number of travelers, and preferred cabin. You can
              then review the itinerary details and contact TicketDepart for reservation
              assistance.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {[
                ["Search your route", "Choose departure and destination airports or cities and enter your travel dates."],
                ["Review itinerary details", "Compare departure and arrival times, nonstop or connecting service, duration, and cabin information."],
                ["Get booking assistance", "When you have an itinerary in mind, call TicketDepart to discuss booking details and applicable terms."],
              ].map(([title, description]) => (
                <article key={title} className="rounded-2xl border border-border bg-card p-5 shadow-subtle">
                  <h2 className="font-display text-base font-semibold">{title}</h2>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
                </article>
              ))}
            </div>
            <div className="mt-8 rounded-2xl border border-border bg-card p-6 shadow-subtle">
              <h2 className="font-display text-xl font-semibold">What to have ready</h2>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                If you already know your airports, have the IATA codes or city names
                ready. For a round trip, have both departure and return dates available.
                If your plans are flexible, nearby airports or alternate dates may provide
                additional itinerary choices.
              </p>
              <ul className="mt-4 grid gap-2 text-sm text-foreground sm:grid-cols-2">
                <li>• Departure city or airport</li>
                <li>• Destination city or airport</li>
                <li>• Departure and return dates</li>
                <li>• Number of travelers</li>
                <li>• Preferred cabin</li>
                <li>• One-way or round-trip preference</li>
              </ul>
            </div>
            <a href="/flight-search" className="mt-8 inline-flex h-11 items-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground">
              <Search className="size-4" /> Start a new flight search
            </a>
          </div>
        </Section>
      </>
    );
  }

  return (
    <>
      <Seo title={PAGE_TITLE} description={PAGE_DESCRIPTION} path={PAGE_PATH} />
      <section className="border-b border-border bg-card">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="label-board text-accent">Flight search results</p>
              <h1 className="mt-1 text-2xl font-bold sm:text-3xl">
                {search.from} <span className="text-muted-foreground">→</span> {search.to}
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {search.departure}{search.tripType === "Round trip" && search.returnDate ? ` · Return ${search.returnDate}` : ""} · {search.travelers} traveler{search.travelers === "1" ? "" : "s"} · {search.cabin}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <a href="/flight-search" className="inline-flex h-10 items-center gap-2 rounded-full border border-border px-4 text-sm font-semibold hover:bg-muted">
                <Search className="size-4" /> New search
              </a>
              <button type="button" onClick={() => setShowModify((value) => !value)} className="inline-flex h-10 items-center gap-2 rounded-full border border-primary px-4 text-sm font-semibold text-primary hover:bg-primary/5">
                <Pencil className="size-4" /> Modify itinerary
                {showModify ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-accent/25 bg-accent/5 p-4 sm:p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-bold text-foreground">Need help choosing or confirming a flight?</p>
                <p className="mt-1 text-sm text-muted-foreground">Call TicketDepart for reservation assistance with this itinerary.</p>
              </div>
              <a href={SITE.phoneHref} data-cta-location="results_top" className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-full bg-accent px-5 text-sm font-bold text-accent-foreground shadow-subtle transition hover:bg-accent/90" aria-label="Call for flight reservation assistance">
                <Phone className="size-4" /> Call for Reservation Assistance
              </a>
            </div>
          </div>

          {showModify && (
            <div className="rounded-2xl border border-border bg-background p-4">
              <div className="mb-3 flex items-center justify-between">
                <p className="font-bold">Modify your itinerary</p>
                <p className="text-xs text-muted-foreground">Update any search option, then search again.</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <label className="text-xs font-semibold"><span>From (IATA)</span><input value={modifyFrom} onChange={(e) => setModifyFrom(e.target.value)} maxLength={3} className="mt-1 h-10 w-full rounded-xl border border-border bg-card px-3 uppercase" placeholder="JFK" /></label>
                <label className="text-xs font-semibold"><span>To (IATA)</span><input value={modifyTo} onChange={(e) => setModifyTo(e.target.value)} maxLength={3} className="mt-1 h-10 w-full rounded-xl border border-border bg-card px-3 uppercase" placeholder="LAX" /></label>
                <label className="text-xs font-semibold"><span>Departure</span><input type="date" value={modifyDeparture} onChange={(e) => setModifyDeparture(e.target.value)} className="mt-1 h-10 w-full rounded-xl border border-border bg-card px-3" /></label>
                <label className="text-xs font-semibold"><span>Return</span><input type="date" value={modifyReturn} min={modifyDeparture} disabled={modifyTrip === "One way"} onChange={(e) => setModifyReturn(e.target.value)} className="mt-1 h-10 w-full rounded-xl border border-border bg-card px-3 disabled:opacity-40" /></label>
                <label className="text-xs font-semibold"><span>Trip</span><select value={modifyTrip} onChange={(e) => { const next = e.target.value as SearchState["tripType"]; setModifyTrip(next); if (next === "One way") setModifyReturn(""); }} className="mt-1 h-10 w-full rounded-xl border border-border bg-card px-3"><option>Round trip</option><option>One way</option></select></label>
                <label className="text-xs font-semibold"><span>Travelers</span><select value={modifyTravelers} onChange={(e) => setModifyTravelers(e.target.value)} className="mt-1 h-10 w-full rounded-xl border border-border bg-card px-3">{Array.from({ length: 9 }, (_, i) => String(i + 1)).map((count) => <option key={count}>{count}</option>)}</select></label>
                <label className="text-xs font-semibold"><span>Cabin</span><select value={modifyCabin} onChange={(e) => setModifyCabin(e.target.value)} className="mt-1 h-10 w-full rounded-xl border border-border bg-card px-3"><option>Economy</option><option>Premium Economy</option><option>Business</option><option>First</option></select></label>
                <div className="flex items-end"><button type="button" onClick={updateSearch} className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground"><Search className="size-4" /> Update search</button></div>
              </div>
            </div>
          )}
        </div>
      </section>

      <Section tone="muted" ocid="flight_search_results.options" aria-labelledby="flight_results_heading">
        <SectionHeading
          id="flight_results_heading"
          eyebrow={loading ? "Searching schedules" : "Available flight options"}
          title={loading ? "Finding itinerary options…" : `${outbound.length} outbound option${outbound.length === 1 ? "" : "s"}${search.tripType === "Round trip" && inbound.length ? ` · ${inbound.length} return` : ""}`}
          description="Select your preferred itinerary. A reservation specialist will confirm current fare and booking details by phone."
        />

        {loading ? (
          <div className="mt-8 flex items-center justify-center rounded-2xl border border-border bg-card p-12 text-sm text-muted-foreground">
            <LoaderCircle className="mr-2 size-5 animate-spin" /> Loading flight schedules…
          </div>
        ) : error ? (
          <div className="mt-8 rounded-2xl border border-destructive/30 bg-card p-5 text-sm text-destructive">
            {error}
          </div>
        ) : (
          <>
            <div className="mt-8 grid gap-4">
              {outbound.map((result) => (
                <ResultCard
                  key={result.id}
                  result={result}
                  selected={selectedOutbound?.id === result.id}
                  showCallButton={selectedCallFlightId === result.id}
                  onSelect={async () => {
                    setSelectedOutbound(result);
                    setSelectedCallFlightId(result.id);
                    setSelectedReturn(null);
                    if (search.tripType !== "Round trip") return;
                    setReturnLoading(true);
                    setError("");
                    try {
                      if (!result.departureToken && actor) {
                        const fromChoice: LocationChoice = { type: "airport", city: "", country: "", iata: search.to, label: search.to };
                        const toChoice: LocationChoice = { type: "airport", city: "", country: "", iata: search.from, label: search.from };
                        const fallback = await fetchSchedules(
                          fromChoice,
                          toChoice,
                          search.returnDate,
                          "",
                          "One way",
                          search.cabin,
                          search.travelers,
                          actor,
                        );
                        setInbound(fallback.outbound);
                        if (!fallback.outbound.length) setError("No scheduled return options were returned for this date. Try another date.");
                        return;
                      }

                      const response = await fetch(`/api/flight-search?${new URLSearchParams({
                        origin: search.from,
                        destination: search.to,
                        departureDate: search.departure,
                        returnDate: search.returnDate,
                        tripType: search.tripType,
                        travelers: search.travelers,
                        cabin: search.cabin,
                        ...(result.departureToken ? { departureToken: result.departureToken } : {}),
                      }).toString()}`, { headers: { accept: "application/json" } });
                      const contentType = response.headers.get("content-type") ?? "";
                      if (!contentType.includes("application/json")) {
                        throw new Error("Live flight search service is unavailable. Please try again shortly.");
                      }
                      const payload = await response.json() as { inbound?: FlightSchedule[]; error?: string };
                      if (!response.ok) throw new Error(payload.error ?? "Return-flight search failed.");
                      setInbound(payload.inbound ?? []);
                      if (!(payload.inbound ?? []).length) setError("No return options were returned for this outbound flight. Try another outbound option.");
                    } catch (e) {
                      setError(e instanceof Error ? e.message : "Return-flight search failed.");
                    } finally {
                      setReturnLoading(false);
                    }
                  }}
                />
              ))}
            </div>

            {search.tripType === "Round trip" && inbound.length > 0 && (
              <div className="mt-10">
                <h2 className="mb-4 text-xl font-bold">{returnLoading ? "Finding return flights…" : "Choose your return flight"}</h2>
                <div className="grid gap-4">
                  {inbound.map((result) => (
                    <ResultCard
                      key={result.id}
                      result={result}
                      selected={selectedReturn?.id === result.id}
                      showCallButton={selectedCallFlightId === result.id}
                      onSelect={() => {
                        setSelectedReturn(result);
                        setSelectedCallFlightId(result.id);
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {itineraryReady && (
          <div className="mt-10 rounded-3xl border border-primary/20 bg-card p-5 shadow-elevated sm:p-7">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="label-board text-accent">Itinerary selected</p>
                <h2 className="mt-1 text-xl font-bold">{itinerarySummary}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{search.travelers} traveler{search.travelers === "1" ? "" : "s"} · {search.cabin}</p>
              </div>
              <a href={SITE.phoneHref} data-cta-location="results_summary" className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-red-600 px-6 font-semibold text-white shadow-sm transition hover:bg-red-700 animate-pulse">
                <Phone className="size-4 animate-bounce text-white" /> Call to Book / Prices / Confirm
              </a>
            </div>
          </div>
        )}
      </Section>

      <Section tone="muted">
        <p className="text-sm leading-relaxed text-muted-foreground">
          Schedule options are informational and subject to confirmation. A reservation specialist will confirm the itinerary, fare, availability, and booking details by phone before payment. {SITE.disclosure}
        </p>
      </Section>
    </>
  );
}
