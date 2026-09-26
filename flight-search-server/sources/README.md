# Flight source adapters

Each adapter must expose an object with a name and async search(query) method and return normalized flight records.

Example record fields:
- airlineName
- airlineCode
- flightNumber
- direction
- departure { iata, date, time }
- arrival { iata, date, time }
- duration
- stops
- connectionAirports
- aircraft
- cabin
- baggage

## Source policy

Adapters must only use data sources whose automated access and commercial display are permitted.

Do not add CAPTCHA bypasses, anti-bot evasion, credential reuse, robots.txt circumvention, or scraping of a source whose terms prohibit automated extraction.

Fare data is intentionally excluded from the customer-facing contract. The server sets faresDisplayed=false and adapters should not return fare amounts to the frontend.
