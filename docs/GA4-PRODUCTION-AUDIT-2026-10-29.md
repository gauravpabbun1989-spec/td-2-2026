# TicketDepart GA4 and popup production audit

**Audit date:** 2026-10-29  
**Scope:** Production homepage inspection, repository source review, GA4 event reports, phone CTA event handler, shared call popup, and deployment configuration review. The main-site deployment is Cloudflare/Caffeine; Netlify deploy previews are explicitly out of scope for production validation.

## Findings

| ID | Severity | Finding | Evidence / status |
|---|---|---|---|
| TD-AN-01 | Critical | Live production HTML used the placeholder GA4 ID `G-XXXXXXXXXX`, not `G-4WC5K9Q31E`. | Live page inspection; needs production deploy correction and post-deploy verification. |
| TD-AN-02 | Critical | Live page asset structure did not match the current repository build (live references `/assets/app.js` and `/assets/htmx.min.js`; repository entry uses `/src/bootstrap.ts` and Vite-generated assets). | Indicates production is serving a different/older build or deployment target; root cause must be resolved in the actual Cloudflare/Caffeine pipeline. |
| TD-AN-03 | Critical | The first draft of the GA4 correction introduced an extra closing brace in the inline script. | Corrected on this branch. Inline HTML scripts are not necessarily parsed by the TypeScript build/typecheck, so HTML inline-script syntax needs explicit review. |
| TD-AN-04 | High | GA4 key-event reporting currently lists `phone_cta_impression` as a key event. | Connected GA4 report for 2026-10-01 through 2026-10-28: 701 key events / 254 users. This is an impression, not a lead, and inflates conversion reporting. The property key-event setting requires a GA4-admin change; source code alone cannot remove the property setting. |
| TD-AN-05 | High | Phone-click key-event volume is low and declined in the same period comparison. | 2026-10-01 through 2026-10-28: `phone_click` 10 key events / 4 users versus 24 / 10 in 2026-09-03 through 2026-09-30. This is not proof that all GA4 collection stopped. |
| TD-AN-06 | High | Organic landing-page activity is very low but not zero in GA4. | Connected GA4 report for 2026-10-01 through 2026-10-28 returned 2 organic sessions: homepage 1 and `/jetblue-airways` 1. |
| TD-AN-09 | Medium | GA4 reports are not completely empty, but production collection is not verified. | All-channel page report for 2026-10-01 through 2026-10-28 showed 165 homepage page views on `ticketdepart.com` and 87 homepage page views on `latin-maroon-0mq-draft.caffeine.xyz`. This suggests staging/test traffic is present in the same property and should be separated from production analysis. |
| TD-POP-01 | High | Popup opened after 5 seconds and later programmatically focused the call CTA after 9 seconds. | Corrected on this branch: opens after 100 ms and no longer steals focus or runs a delayed call prompt. |
| TD-POP-02 | High | Popup copy implied the visitor would get a booking confirmed. | Corrected on this branch to explain that a specialist can discuss route, dates, cabin, and fare conditions before the visitor decides. |
| TD-AN-07 | Medium | Live canonical host was reported as `https://www.ticketdepart.com/`, while repository canonical metadata uses `https://ticketdepart.com/`. | Confirm the intended canonical host and redirects when correcting production deployment. The repository tag gate allows both hosts, so this alone does not explain the placeholder ID. |
| TD-AN-08 | Medium | Production event delivery has not yet been proven with a fresh `page_view` and `phone_click`. | After deployment, validate the live network request/tag, Tag Assistant, GA4 Realtime/DebugView, and the event report. |

## Changes made on this branch

- Make the production GA4 loader/config block explicit for `G-4WC5K9Q31E`.
- Correct the extra brace in the inline script.
- Make the call popup open after 100 ms, preserve close-with-X behavior, and remove delayed programmatic focus.
- Remove popup language that promises a booking confirmation.
- Keep popup impressions out of conversion events; keep phone clicks as the intent signal.


- The connected GA4 measurement-health diagnostic endpoint returned `ga4_malformed_response`; stream-level settings could not be independently verified through that report.

## Post-deployment verification checklist

1. Confirm the live HTML is from the expected Cloudflare/Caffeine build and contains no placeholder `G-XXXXXXXXXX`.
2. Confirm the browser loads `https://www.googletagmanager.com/gtag/js?id=G-4WC5K9Q31E`.
3. Confirm `page_view` reaches GA4 Realtime and DebugView from a normal production visit.
4. Tap a visible `tel:+18889580280` CTA and confirm one `phone_click` event (not duplicate events).
5. Confirm popup display/dismissal does not block page interactions or steal focus.
6. In GA4 Admin, remove `phone_cta_impression` from key events and retain `phone_click` as the phone-intent conversion. A click does not prove a call connected.
7. Reconcile canonical host and redirects between live HTML, sitemap, and repository metadata.

## Limitation

The source and analytics reports can be inspected here, but no Cloudflare/Caffeine deployment-write connection is available in this workflow. Merging source changes does not by itself prove the main domain has been updated. Do not treat a Netlify preview as proof of production deployment.
