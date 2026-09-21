import Char "mo:core/Char";
import List "mo:core/List";
import Result "mo:core/Result";
import Text "mo:core/Text";
import Types "../types/leads";

module {
  /// Validates a submitted trip request and returns a caller-actionable error
  /// when a required field is missing or malformed.
  public func validate(input : Types.TripRequestInput) : Result.Result<(), Types.SubmitError> {
    if (input.name.trim(#predicate(Char.isWhitespace)).size() == 0) {
      return #err(#invalidName);
    };
    if (digitCount(input.phone) < 7) {
      return #err(#invalidPhone);
    };
    let email = input.email.trim(#predicate(Char.isWhitespace));
    if (not (email.contains(#text("@")) and email.contains(#text(".")))) {
      return #err(#invalidEmail);
    };
    if (input.origin.trim(#predicate(Char.isWhitespace)).size() == 0) {
      return #err(#invalidOrigin);
    };
    if (input.destination.trim(#predicate(Char.isWhitespace)).size() == 0) {
      return #err(#invalidDestination);
    };
    switch (input.departureDate) {
      case (?value) {
        if (value.trim(#predicate(Char.isWhitespace)).size() == 0) {
          return #err(#invalidDepartureDate);
        };
      };
      case null {
        return #err(#invalidDepartureDate);
      };
    };
    switch (input.returnDate) {
      case (?value) {
        let trimmed = value.trim(#predicate(Char.isWhitespace));
        if (trimmed.size() > 0 and not looksLikeDate(trimmed)) {
          return #err(#invalidReturnDate);
        };
      };
      case null {};
    };
    if (input.travelers < 1) {
      return #err(#invalidTravelers);
    };
    #ok(());
  };

  /// Builds a stored trip request from validated input, assigning the next id
  /// and the submission timestamp.
  public func newRequest(id : Types.LeadId, input : Types.TripRequestInput, submittedAt : Types.Timestamp) : Types.TripRequest {
    {
      id;
      name = input.name.trim(#predicate(Char.isWhitespace));
      phone = input.phone.trim(#predicate(Char.isWhitespace));
      email = input.email.trim(#predicate(Char.isWhitespace));
      tripType = input.tripType;
      origin = input.origin.trim(#predicate(Char.isWhitespace));
      destination = input.destination.trim(#predicate(Char.isWhitespace));
      departureDate = normalizeOptional(input.departureDate);
      returnDate = normalizeOptional(input.returnDate);
      travelers = input.travelers;
      cabin = input.cabin;
      details = normalizeOptional(input.details);
      submittedAt;
    };
  };

  /// Appends a trip request to the lead store and returns the stored record.
  public func store(leads : List.List<Types.TripRequest>, request : Types.TripRequest) : Types.TripRequest {
    leads.add(request);
    request;
  };

  /// Returns every stored lead, newest first (descending submission id).
  public func listNewestFirst(leads : List.List<Types.TripRequest>) : [Types.TripRequest] {
    let all = leads.toArray();
    all.sort(
      func(a, b) {
        if (a.id > b.id) { #less } else if (a.id < b.id) { #greater } else { #equal };
      }
    );
  };

  /// Renders the notification email subject for a stored lead.
  public func notificationSubject(request : Types.TripRequest) : Text {
    "New trip request #" # request.id.toText() # " — " # request.name;
  };

  /// Renders the notification email HTML body for a stored lead, including the
  /// submission id, timestamp, and every submitted trip request field.
  public func notificationBody(request : Types.TripRequest) : Text {
    "<h2>New trip request</h2>" #
    "<p><strong>Submission ID:</strong> " # request.id.toText() # "</p>" #
    "<p><strong>Submitted at (ns since Unix epoch):</strong> " # request.submittedAt.toText() # "</p>" #
    "<ul>" #
    "<li><strong>Name:</strong> " # escapeHtml(request.name) # "</li>" #
    "<li><strong>Phone:</strong> " # escapeHtml(request.phone) # "</li>" #
    "<li><strong>Email:</strong> " # escapeHtml(request.email) # "</li>" #
    "<li><strong>Trip type:</strong> " # tripTypeText(request.tripType) # "</li>" #
    "<li><strong>Origin:</strong> " # escapeHtml(request.origin) # "</li>" #
    "<li><strong>Destination:</strong> " # escapeHtml(request.destination) # "</li>" #
    "<li><strong>Departure date:</strong> " # optionalText(request.departureDate) # "</li>" #
    "<li><strong>Return date:</strong> " # optionalText(request.returnDate) # "</li>" #
    "<li><strong>Travelers:</strong> " # request.travelers.toText() # "</li>" #
    "<li><strong>Cabin:</strong> " # cabinText(request.cabin) # "</li>" #
    "<li><strong>Trip details:</strong> " # optionalText(request.details) # "</li>" #
    "</ul>";
  };

  func digitCount(value : Text) : Nat {
    var count = 0;
    for (char in value.toIter()) {
      if (char.isDigit()) {
        count += 1;
      };
    };
    count;
  };

  func looksLikeDate(value : Text) : Bool {
    var digits = 0;
    var separators = 0;
    for (char in value.toIter()) {
      if (char.isDigit()) {
        digits += 1;
      } else if (char == '-' or char == '/' or char == '.') {
        separators += 1;
      };
    };
    digits >= 4 and separators >= 1;
  };

  func normalizeOptional(value : ?Text) : ?Text {
    switch (value) {
      case (?text) {
        let trimmed = text.trim(#predicate(Char.isWhitespace));
        if (trimmed.size() == 0) { null } else { ?trimmed };
      };
      case null { null };
    };
  };

  func optionalText(value : ?Text) : Text {
    switch (value) {
      case (?text) { escapeHtml(text) };
      case null { "—" };
    };
  };

  func tripTypeText(value : Types.TripType) : Text {
    switch (value) {
      case (#roundTrip) { "Round trip" };
      case (#oneWay) { "One way" };
      case (#multiCity) { "Multi-city" };
      case (#businessClass) { "Business class" };
      case (#firstClass) { "First class" };
      case (#groupTravel) { "Group travel" };
      case (#other) { "Other" };
    };
  };

  func cabinText(value : Types.Cabin) : Text {
    switch (value) {
      case (#economy) { "Economy" };
      case (#premiumEconomy) { "Premium economy" };
      case (#business) { "Business" };
      case (#first) { "First" };
      case (#noPreference) { "No preference" };
    };
  };

  func escapeHtml(value : Text) : Text {
    value.replace(#text "&", "&amp;").replace(#text "<", "&lt;").replace(#text ">", "&gt;");
  };
};
