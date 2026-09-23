import Common "common";

module {
  public type LeadId = Common.LeadId;
  public type Timestamp = Common.Timestamp;

  /// Trip type selected by the visitor on the lead-capture form.
  public type TripType = {
    #roundTrip;
    #oneWay;
    #multiCity;
    #businessClass;
    #firstClass;
    #groupTravel;
    #other;
  };

  /// Cabin preference selected by the visitor on the lead-capture form.
  public type Cabin = {
    #economy;
    #premiumEconomy;
    #business;
    #first;
    #noPreference;
  };

  /// A trip request submitted through the contact page lead-capture form.
  public type TripRequest = {
    id : LeadId;
    name : Text;
    phone : Text;
    email : Text;
    tripType : TripType;
    origin : Text;
    destination : Text;
    departureDate : ?Text;
    returnDate : ?Text;
    travelers : Nat;
    cabin : Cabin;
    details : ?Text;
    submittedAt : Timestamp;
  };

  /// Fields accepted from the visitor when submitting a trip request.
  public type TripRequestInput = {
    name : Text;
    phone : Text;
    email : Text;
    tripType : TripType;
    origin : Text;
    destination : Text;
    departureDate : ?Text;
    returnDate : ?Text;
    travelers : Nat;
    cabin : Cabin;
    details : ?Text;
  };

  /// Caller-actionable failure returned when a trip request cannot be stored.
  public type SubmitError = {
    #invalidName;
    #invalidPhone;
    #invalidEmail;
    #invalidOrigin;
    #invalidDestination;
    #invalidDepartureDate;
    #invalidReturnDate;
    #invalidTravelers;
  };

  /// Outcome of the transactional notification email attempted after a lead is
  /// durably stored. `#sent` means the platform email extension accepted the
  /// message; `#failed` carries the extension's error text. A `#failed` value
  /// never means the lead was lost — the lead is already persisted.
  public type EmailStatus = {
    #sent;
    #failed : Text;
  };

  /// Successful submission result. The lead is durably stored before this value
  /// is returned; `email` reports whether the notification email was sent.
  public type SubmitSuccess = {
    lead : TripRequest;
    email : EmailStatus;
  };

  /// Result of a trip-request submission: `#ok` only after durable storage.
  public type SubmitResult = {
    #ok : SubmitSuccess;
    #err : SubmitError;
  };
};
