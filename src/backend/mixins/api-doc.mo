mixin () {
  /// Returns static Markdown documentation for the TicketDepart backend API.
  public query func getApiDoc() : async Text {
    let doc = "# TicketDepart Backend API\n\n" #
      "This canister stores trip-request leads submitted from the TicketDepart\n" #
      "contact page. TicketDepart is an independent travel agency; this API does not\n" #
      "represent any airline.\n\n" #
      "## Methods\n\n" #
      "### `submitTripRequest(input : TripRequestInput) : async Result<TripRequest, SubmitError>`\n\n" #
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
      "On success the call returns `#ok(TripRequest)` containing the stored record,\n" #
      "including the server-assigned `id` and `submittedAt` (nanoseconds since the\n" #
      "Unix epoch). On failure it returns `#err(SubmitError)` where `SubmitError` is\n" #
      "one of `#invalidName`, `#invalidPhone`, `#invalidEmail`, `#invalidOrigin`,\n" #
      "`#invalidDestination`, `#invalidDepartureDate`, `#invalidReturnDate`,\n" #
      "`#invalidTravelers`. The error\n" #
      "variant identifies the first failing field; the caller should surface a\n" #
      "field-specific message and let the visitor correct it and resubmit.\n\n" #
      "### `getApiDoc() : async Text`\n\n" #
      "Returns this document. It is a `query` call and reads no state.\n\n" #
      "## Authentication and authorization\n\n" #
      "`submitTripRequest` requires no sign-in and no role; anonymous callers are\n" #
      "accepted by design. The canister also includes the standard Caffeine\n" #
      "authorization mixin, which manages roles for the platform's own surfaces, but\n" #
      "the lead-capture endpoint does not consult it.\n\n" #
      "## Units and encodings\n\n" #
      "- `id` is a `Nat` assigned sequentially by the canister, starting at 0.\n" #
      "- `submittedAt` is a `Nat` in nanoseconds since the Unix epoch.\n" #
      "- `departureDate` and `returnDate` are `?Text`; `null` means the visitor\n" #
      "  left the field blank. `departureDate` is required, so a stored record\n" #
      "  never has a `null` departure date. `returnDate` is `null` for one-way\n" #
      "  trips.\n" #
      "- `details` is an optional `Text`; `null` means the visitor left it blank.\n" #
      "- `TripType`, `Cabin`, and `SubmitError` are Candid variants; the frontend\n" #
      "  receives them as tagged objects.\n\n" #
      "## Retry safety\n\n" #
      "`submitTripRequest` is **not idempotent**. Each successful call appends a new\n" #
      "lead and consumes a new `id`, so a retried submission creates a duplicate\n" #
      "record. The frontend should disable the submit control while a call is in\n" #
      "flight and only retry after a definite failure.\n\n" #
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
      "  option set.\n";
    doc;
  };
};
