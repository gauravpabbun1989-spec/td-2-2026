# Canonical TicketDepart phone number

**Current number everywhere:** `+1-877-788-8010`

**Canonical telephone link:** `tel:+18777888010`

**Single source of truth:** `config/phone-number.json`

All customer-facing pages, buttons, popups, headers, footers, structured data, static HTML, and generated assets must use this number. Do not leave previous business phone numbers in active source, configuration, or published build output.

## Updating the number in the future

1. Update `display` and `tel` in `config/phone-number.json`.
2. From `src/frontend`, run `pnpm phone:replace` to synchronize tracked text files in the checkout.
3. Review the diff and run the build, tests, and phone-number audit before deployment.
4. Confirm that the current number is consistent in source files and generated static output.

Git branches are separate snapshots. Merge or cherry-pick this change into other branches before treating them as synchronized. After any future number change, run the replacement and audit on each branch before it is merged or deployed.
