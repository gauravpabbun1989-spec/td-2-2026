mixin () {
  /// Returns static Markdown documentation for the TicketDepart backend API.
  public query func getApiDoc() : async Text {
    let doc = "# TicketDepart Backend API\n\n" #
      "This canister stores trip-request leads submitted from the TicketDepart\n" #
      "contact page. TicketDepart is an independent travel agency; this API does not\n" #
      "represent any airline.\n\n" #
      "## Methods\n\n" #
      "### `submitTripRequest(input : TripRequestInput) : async SubmitResult`\n\n" #
      "Stores one trip-request lead. This is an **update** call (it writes state), so\n" #
      "it must be invoked as a non-query call. It is callable by any caller, including\n" #
      "anonymous visitors, because the contact form is public.\n\n" #
      "`TripRequestInput` fields:\n\n" #
      "| Field | Type | Notes |\n" #
      "| --- | --- | --- |\n" #
      "| `name` | `Text` | Required, non-blank after trimming. |\n" #
      "| `phone` | `Text` | Required, at least 7 digits after trimming. |\n" #
      "| `email` | `Text` | Required, must contain `@` and `.`. |\n" #
      "| `tripType` | `TripType` | One of `#roundTrip`, `#oneWay`, `#multiCity`, `#businessClass`, `#firstClass`, `#groupTravel`, `#other`. |\n" #
      "| `origin` | `Text` | Required, non-blank after trimming. |\n" #
      "| `destination` | `Text` | Required, non-blank after trimming. |\n" #
      "| `departureDate` | `?Text` | Required: `null` or blank returns `#invalidDepartureDate`. Free-form text; not date-validated. |\n" #
      "| `returnDate` | `?Text` | Optional; `null` or blank is accepted for one-way trips. When non-blank it must look like a date (at least 4 digits and one `-`, `/`, or `.` separator), otherwise `#invalidReturnDate`. |\n" #
      "| `travelers` | `Nat` | Required, must be at least 1. |\n" #
      "| `cabin` | `Cabin` | One of `#economy`, `#premiumEconomy`, `#business`, `#first`, `#noPreference`. Accepted as submitted; not validated. |\n" #
      "| `details` | `?Text` | Optional free-form trip details. |\n\n" #
      "On success the call returns `#ok(SubmitSuccess)` where `SubmitSuccess` is\n" #
      "`{ lead : TripRequest; email : EmailStatus }`. The `lead` is the stored record,\n" #
      "including the server-assigned `id` and `submittedAt` (nanoseconds since the\n" #
      "Unix epoch). The lead is written to stable storage **before** the notification\n" #
      "email is attempted, so `#ok` always means the lead is durably stored.\n\n" #
      "`EmailStatus` is `#sent` when the platform email extension accepted the\n" #
      "notification to `support@ticketdestinations.com`, or `#failed(Text)` carrying\n" #
      "the extension's error text. A `#failed` value never means the lead was lost —\n" #
      "the lead is already persisted and can be read through `listLeads`.\n\n" #
      "On failure it returns `#err(SubmitError)` where `SubmitError` is\n" #
      "one of `#invalidName`, `#invalidPhone`, `#invalidEmail`, `#invalidOrigin`,\n" #
      "`#invalidDestination`, `#invalidDepartureDate`, `#invalidReturnDate`,\n" #
      "`#invalidTravelers`. The error\n" #
      "variant identifies the first failing field; the caller should surface a\n" #
      "field-specific message and let the visitor correct it and resubmit.\n\n" #
      "### `listLeads() : async [TripRequest]`\n\n" #
      "Returns every stored lead, newest first (descending submission `id`). This is\n" #
      "an **admin-only** `query` call: it traps with\n" #
      "`Unauthorized: Only admins can view submitted leads` for any caller that does\n" #
      "not hold the `#admin` role, including anonymous visitors. Lead data is never\n" #
      "exposed on a public route or public method.\n\n" #
      "### `getApiDoc() : async Text`\n\n" #
      "Returns this document. It is a `query` call and reads no state.\n\n" #
      "### `schema() : async Text`\n\n" #
      "OQL schema discovery. Returns a JSON document describing the queryable\n" #
      "entities, their primary keys, fields, field roles, and declared value\n" #
      "domains. It is a `query` call. The `tripRequest` entity is\n" #
      "`controllerOnly`, so a caller that is not a canister controller receives a\n" #
      "schema with that entity (and any edge to it) hidden. This method is\n" #
      "provided by the OQL `Expose` mixin, not by this canister's own code.\n\n" #
      "### `execute(qJson : Text) : async Result`\n\n" #
      "OQL query execution. Takes one JSON-encoded query and returns matching\n" #
      "rows as a typed Candid result. It is a `query` call. Authorization is\n" #
      "per entity: `tripRequest` is `controllerOnly`, so only a canister\n" #
      "controller can read lead rows through it; every other caller is denied\n" #
      "and sees no rows. This method is provided by the OQL `Expose` mixin.\n\n" #
      "The `tripRequest` entity exposes these columns: `id` (primary key),\n" #
      "`name`, `phone`, `email`, `tripType`, `origin`, `destination`,\n" #
      "`departureDate`, `returnDate`, `travelers`, `cabin`, `details`, and\n" #
      "`submittedAt`. `tripType` and `cabin` are rendered as their variant tag\n" #
      "names (`roundTrip`, `oneWay`, `multiCity`, `businessClass`, `firstClass`,\n" #
      "`groupTravel`, `other`; `economy`, `premiumEconomy`, `business`, `first`,\n" #
      "`noPreference`). The optional text columns `departureDate`, `returnDate`,\n" #
      "and `details` are rendered as `Text`, using the empty string as the\n" #
      "sentinel for absence, so a blank value reads as `\"\"` rather than null.\n\n" #
      "## Authentication and authorization\n\n" #
      "`submitTripRequest` requires no sign-in and no role; anonymous callers are\n" #
      "accepted by design. `listLeads` requires the `#admin` role and is the only way\n" #
      "to read submitted leads. The OQL `execute` and `schema` methods are\n" #
      "`controllerOnly` for the `tripRequest` entity, so lead rows are readable\n" #
      "through OQL only by a canister controller. The canister includes the standard Caffeine\n" #
      "authorization mixin; the first authenticated caller to initialize access\n" #
      "control becomes admin, and the owner/travel desk can be granted the admin role\n" #
      "through that mechanism.\n\n" #
      "A direct API caller that has never signed in through the app's frontend is\n" #
      "unregistered and therefore not an admin, even if it belongs to the app owner;\n" #
      "a principal derived against a different origin is a different principal than\n" #
      "the one the frontend registered. The app's frontend pins an Internet Identity\n" #
      "derivation origin, published at `/.well-known/ii-derivation-origin` when\n" #
      "available; an agent already holding the user's Internet Identity authorization\n" #
      "derives the correct per-app principal against that origin (for example\n" #
      "`icp identity link web <name> --app <host>`). Such a delegation acts with the\n" #
      "user's full authority in this app until it expires.\n\n" #
      "## Units and encodings\n\n" #
      "- `id` is a `Nat` assigned sequentially by the canister, starting at 0.\n" #
      "- `submittedAt` is a `Nat` in nanoseconds since the Unix epoch.\n" #
      "- `departureDate` and `returnDate` are `?Text`; `null` means the visitor\n" #
      "  left the field blank. `departureDate` is required, so a stored record\n" #
      "  never has a `null` departure date. `returnDate` is `null` for one-way\n" #
      "  trips.\n" #
      "- `details` is an optional `Text`; `null` means the visitor left it blank.\n" #
      "- `TripType`, `Cabin`, and `SubmitError` are Candid variants; the frontend\n" #
      "  receives them as tagged objects.\n" #
      "- Through OQL, `tripType` and `cabin` are `Text` columns holding the\n" #
      "  variant tag name, and the optional text columns use `\"\"` for absence.\n\n" #
      "## Lifecycle and polling\n\n" #
      "`submitTripRequest` is a single update call that completes when it returns:\n" #
      "the lead is written to stable storage before the notification email is\n" #
      "attempted, and the returned `SubmitSuccess.email` reports the email outcome.\n" #
      "There is no job id, no background processing, and nothing to poll — the\n" #
      "call's return value is the final state. A caller that needs to confirm the\n" #
      "lead afterwards can call `listLeads` (admin) or query OQL (controller).\n\n" #
      "## Retry safety\n\n" #
      "`submitTripRequest` is **not idempotent**. Each successful call appends a new\n" #
      "lead and consumes a new `id`, so a retried submission creates a duplicate\n" #
      "record. The frontend should disable the submit control while a call is in\n" #
      "flight and only retry after a definite failure. A retry after an `#ok`\n" #
      "response also re-sends the notification email, so the travel desk can receive\n" #
      "a duplicate notification for a duplicate lead.\n\n" #
      "## Errors and limits\n\n" #
      "Validation failures are returned as `#err` values, not traps, so the caller can\n" #
      "branch on them. A trap indicates an unexpected internal failure. There is no\n" #
      "rate limit or per-caller quota on submissions.\n\n" #
      "## Non-obvious behavior\n\n" #
      "- Every `Text` field is trimmed of leading and trailing whitespace before it\n" #
      "  is stored, so the returned record can differ from the submitted input.\n" #
      "  Optional text fields (`returnDate`, `details`) that are blank after\n" #
      "  trimming are stored as `null`.\n" #
      "- `departureDate` is checked only for presence, not for date format, and a\n" #
      "  one-way trip still requires a departure date.\n" #
      "- `cabin` is stored exactly as submitted and is not validated against the\n" #
      "  option set.\n" #
      "- `listLeads` traps rather than returning an error for a non-admin caller,\n" #
      "  so a caller must hold `#admin` before calling it.\n" #
      "- OQL `execute` has no structured error envelope: a malformed query or an\n" #
      "  unknown entity traps. `schema()` is the source of truth for entity and\n" #
      "  field names, which are case-sensitive.\n" #
      "- OQL `execute` omitting `limit` returns every match; set `limit` explicitly\n" #
      "  and page with `offset` when reading many leads.\n" #
      "- The OQL registry is rebuilt on every upgrade, so `schema()` and `execute`\n" #
      "  reflect the current entity declarations after a deployment.\n";
    doc;
  };
};
