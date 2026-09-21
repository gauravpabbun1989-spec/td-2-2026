# TicketDepart Organic Call Growth Project

## Objective
Increase qualified organic traffic to https://ticketdepart.com and convert that traffic into real phone calls and booking enquiries.

**Operating target:** increase qualified organic visitors -> increase phone clicks -> increase real calls -> increase bookings.

**Paid acquisition:** $0 Google Ads spend.

## Measurement
- Google Search Console: impressions, clicks, queries, landing pages, indexing.
- GA4: sessions, active users, landing pages, `phone_click` key event, first-touch attribution.
- Callback backend: submitted trip requests.
- Actual connected-call data may be added later if needed, but it is not required to optimize website phone clicks.

## SEO principles
- Build useful pages around real booking intent.
- Strengthen internal linking and crawlability.
- Use accurate titles, descriptions, headings, breadcrumbs and relevant structured data.
- Avoid doorway pages, keyword stuffing, link spam, scraped content, fake reviews, fabricated airline affiliation, fake availability/prices, cloaking, and mass low-value AI pages.
- Every new page must have a distinct user purpose and useful information.

## Priority search-intent clusters
1. Book a flight by phone
2. Flight booking assistance
3. International flight booking
4. Last-minute / same-day flight booking
5. Multi-city flight booking
6. Group and family flight booking
7. Airline-specific booking assistance
8. Complex itinerary / open-jaw assistance
9. Traveler-specific needs where the business genuinely provides useful assistance
10. Destination/airport intent only where a page can provide substantial unique value

## Competitor research findings
Current search results show that phone-booking travel sites commonly emphasize:
- live human assistance
- 24/7 availability
- complex/multi-city/group itineraries
- international booking
- clear independent-agency disclosures
- callback/request forms
- airline and destination coverage

TicketDepart should compete on usefulness and clarity, not by copying competitor claims or publishing unsupported guarantees.

## BeyondSEO operating loop
Run BeyondSEO against the live site after meaningful releases:
1. crawl the site
2. inspect coverage and render errors
3. inspect titles/meta/headings/internal links
4. inspect sitemap discovery
5. review structured-data/readiness findings
6. fix high-impact issues
7. crawl again
8. record the result in the project log

Current known BeyondSEO baseline:
- Python 3.13.13
- HTTP crawling available
- Playwright/Chromium was not installed in the previous environment
- Previous crawl found 8 pages, 15 medium findings and limited rendered coverage
- The website has since grown, so a fresh crawl is required before treating that baseline as current.

## 30-day execution plan

### Phase 1 — Technical/indexing foundation
- Fresh BeyondSEO crawl
- Verify all live sitemap URLs
- Verify every intended route has crawlable HTML
- Fix render/crawl errors
- Verify canonical URLs
- Verify title/meta uniqueness
- Verify internal links to priority booking pages
- Verify phone CTA tracking

### Phase 2 — High-intent content expansion
Expand only where the page can provide meaningful, unique value. Candidate areas:
- flight booking assistance
- same-day/urgent booking
- international booking
- multi-city/open-jaw
- group/family
- airline-specific assistance
- complex itinerary help

### Phase 3 — Search demand capture
Use Search Console query/page data to identify:
- impressions with low CTR
- queries already producing impressions
- pages ranking outside the strongest positions
- pages producing phone clicks
- new query clusters worth expanding

Prioritize improvements from observed demand rather than publishing hundreds of speculative pages.

### Phase 4 — CRO
For pages receiving organic traffic:
- keep primary phone CTA prominent
- keep 24/7 availability clear
- provide callback as a secondary option
- explain what information callers should have ready
- make independent-agency status clear
- avoid unsupported price/availability claims

### Phase 5 — Authority and distribution
Pursue legitimate mentions and referral traffic through:
- useful travel resources
- relevant business/profile listings
- partnerships where genuine
- original travel guidance
- community/editorial exposure where appropriate

Do not buy ranking links or use automated link-building.

## Success checkpoints
- 50 GA4 phone-click sessions/events, then review landing-page and source attribution.
- Growing Search Console impressions across non-branded high-intent queries.
- Growing organic clicks to booking-intent pages.
- Growing phone-click conversion rate from organic landing sessions.
- Callback submissions and, when available, confirmed connected calls.

## Current implementation
Existing priority pages include:
- /flight-booking
- /flight-booking-assistance
- /same-day-flight-booking
- /book-a-flight-by-phone
- /how-to-book-a-flight-by-phone
- /international-flight-booking
- /last-minute-flight-booking
- /multi-city-flight-booking
- /group-flight-booking
- /delta-airlines
- /united-airlines
- /american-airlines

## Immediate next action
Run a fresh BeyondSEO crawl of the live site, then use the results together with Search Console and GA4 to choose the next high-impact technical/content changes.
