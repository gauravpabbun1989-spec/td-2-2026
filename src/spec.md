# TicketDepart

TicketDepart is an independent U.S. travel agency website focused on flight reservation assistance and callback-based trip requests.

## Core behavior

- Provide human-assisted domestic and international flight booking assistance.
- Provide assistance for changes, cancellations, seat selection, baggage, pets, passenger additions, and airport assistance.
- Provide a callback form that collects trip details and stores requests through the Motoko backend.
- Provide a site-wide call-to-action for flight assistance.
- Keep the displayed business phone number in the sticky call banner and structured contact metadata rather than repeating it throughout the page content.
- Clearly disclose that TicketDepart is independent and is not affiliated with, endorsed by, or sponsored by any airline.
- Disclose applicable service fees before payment authorization.
- Maintain accessible responsive layouts and SEO metadata for public routes.
- Preserve durable lead storage and the admin lead-review capability.

## Technical structure

- Frontend: React, TypeScript, Vite.
- Backend: Motoko.
- Frontend assets are built into `src/frontend/dist`.
- Backend artifacts are built into `src/backend/dist`.
- Caffeine project manifests are kept at the repository root and under both canister directories.
