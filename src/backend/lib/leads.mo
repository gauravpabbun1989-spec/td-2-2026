import Char "mo:core/Char";
import List "mo:core/List";
import Result "mo:core/Result";
import Text "mo:core/Text";
import Types "../types/leads";

module {
  /// Validates a submitted trip request and returns a caller-actionable error
  /// when a required field is missing or malformed.
  public func validate(input : Types.TripRequestInput) : Result.Result<(), Types.SubmitError> {
    if (input.name.trim(#predicate (Char.isWhitespace)).size() == 0) {
      return #err(#invalidName);
    };
    if (countDigits(input.phone) < 7) {
      return #err(#invalidPhone);
    };
    let email = input.email.trim(#predicate (Char.isWhitespace));
    if (not (email.contains(#char '@') and email.contains(#char '.'))) {
      return #err(#invalidEmail);
    };
    if (input.origin.trim(#predicate (Char.isWhitespace)).size() == 0) {
      return #err(#invalidOrigin);
    };
    if (input.destination.trim(#predicate (Char.isWhitespace)).size() == 0) {
      return #err(#invalidDestination);
    };
    switch (input.departureDate) {
      case (?date) {
        if (date.trim(#predicate (Char.isWhitespace)).size() == 0) {
          return #err(#invalidDepartureDate);
        };
      };
      case null {
        return #err(#invalidDepartureDate);
      };
    };
    switch (input.returnDate) {
      case (?date) {
        if (date.trim(#predicate (Char.isWhitespace)).size() > 0 and not isDateLike(date)) {
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
      name = input.name.trim(#predicate (Char.isWhitespace));
      phone = input.phone.trim(#predicate (Char.isWhitespace));
      email = input.email.trim(#predicate (Char.isWhitespace));
      tripType = input.tripType;
      origin = input.origin.trim(#predicate (Char.isWhitespace));
      destination = input.destination.trim(#predicate (Char.isWhitespace));
      departureDate = trimOpt(input.departureDate);
      returnDate = trimOpt(input.returnDate);
      travelers = input.travelers;
      cabin = input.cabin;
      details = trimOpt(input.details);
      submittedAt;
    };
  };

  /// Appends a trip request to the lead store and returns the stored record.
  public func store(leads : List.List<Types.TripRequest>, request : Types.TripRequest) : Types.TripRequest {
    leads.add(request);
    request;
  };

  func countDigits(value : Text) : Nat {
    var count = 0;
    for (char in value.toIter()) {
      if (char.isDigit()) {
        count += 1;
      };
    };
    count;
  };

  func isDateLike(value : Text) : Bool {
    let trimmed = value.trim(#predicate (Char.isWhitespace));
    var digits = 0;
    var separators = 0;
    for (char in trimmed.toIter()) {
      if (char.isDigit()) {
        digits += 1;
      } else if (char == '-' or char == '/' or char == '.') {
        separators += 1;
      } else {
        return false;
      };
    };
    digits >= 4 and separators >= 1;
  };

  func trimOpt(value : ?Text) : ?Text {
    switch (value) {
      case (?text) {
        let trimmed = text.trim(#predicate (Char.isWhitespace));
        if (trimmed.size() == 0) { null } else { ?trimmed };
      };
      case null { null };
    };
  };
};
