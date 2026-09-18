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
};
