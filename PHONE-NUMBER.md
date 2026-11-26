# Canonical TicketDepart phone number

**Current number everywhere:** `+1-888-564-9049`

**Canonical telephone link:** `tel:+18885649049`

**Single source of truth:** `config/phone-number.json`

All customer-facing pages, buttons, popups, headers, footers, structured data, static HTML, and generated assets must use this number. Do not leave the retired public number in active source, configuration, or published build output.

## Updating the number in the future

1. Update `display` and `tel` in `config/phone-number.json`.
2. From `src/frontend`, run `pnpm phone:replace` to synchronize tracked text files in the checkout.
3. Review the diff and run the build, tests, and phone-number audit before deployment.
4. Confirm the current number is consistent in source files and generated static output.

The public toll-free number is the only customer-facing call destination. Telxio SIP registration credentials are provider-side authentication settings, not phone numbers or inbound routing destinations. Preserve those credentials unless Telxio supplies replacements.
