# TicketDepart flight database

This directory stores normalized scheduled-flight records used by the TicketDepart Search Orchestrator.

## Required record shape

Each entry in `flights.json` should contain:

- `airline`, `airlineCode`, `flightNumber`
- `departure.iata`, `departure.date`, `departure.time`
- `arrival.iata`, `arrival.date`, `arrival.time`
- optional `durationMinutes`, `stops`, `connections`, `aircraft`
- optional `cabin`, `baggage`, `operatingCarrier`, `marketingCarrier`
- `sourceUpdatedAt`

The database deliberately has **no fare field in the customer-facing contract**.

## Data provenance rule

Only import data when its source license/terms permit TicketDepart's commercial use and redistribution. Do not populate this file by scraping airline sites or bypassing access controls.

Airport reference data can use OurAirports because its airport data is released to the public domain. OpenFlights route data is useful for route/network reference, but OpenFlights states that commercial use of its database requires a separate license, so it is not used as the commercial flight-schedule source.

## Future ingestion

An ingestion script can transform an approved schedule dataset into this normalized JSON format. The source name, license, update timestamp, and transformation version should be recorded with each import.
