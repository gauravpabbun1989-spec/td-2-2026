# TicketDepart Flight Search Server

This is the independent search layer for TicketDepart.

## Flow

Passenger search
-> TicketDepart flight-search server
-> search orchestrator
-> permitted source adapters
-> normalize/deduplicate
-> TicketDepart results

The customer-facing contract intentionally does not expose fare amounts.

## API

GET /health

POST /search

Example body:
{
  "from": "EWR",
  "to": "LAX",
  "departure": "2026-10-01",
  "returnDate": "2026-10-08",
  "travelers": 1,
  "cabin": "Economy"
}

The response contains normalized flight details, source status, and a timestamp. Fare amounts are not returned.

## Current state

The server is deliberately source-neutral. No airline website scraper is enabled by default. A live adapter can be added only after its source's access and display permissions have been verified.

The existing TicketDepart Air-Routes integration remains unchanged until a live source is ready.

## Build status

The server is intentionally separated into reference-data ingestion, schedule-data ingestion, source adapters, orchestration, and the HTTP API. The customer response contract never exposes fares.

### Data commands

- `npm run import:airports` downloads the current OurAirports public-domain airport reference data.
- `npm run validate:data` validates the normalized flight and airport databases.
- `npm test` runs the orchestrator tests.

The repository currently contains an empty schedule database. It must only be populated from a dataset whose license permits TicketDepart's intended commercial use and redistribution. Historical traffic statistics must not be presented as future scheduled flights.
