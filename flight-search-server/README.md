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
