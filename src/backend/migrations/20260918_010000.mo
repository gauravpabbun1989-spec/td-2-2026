import List "mo:core/List";
import Map "mo:core/Map";
import Principal "mo:core/Principal";

module {
  type UserRole = {
    #admin;
    #user;
    #guest;
  };

  type AccessControlState = {
    var adminAssigned : Bool;
    userRoles : Map.Map<Principal, UserRole>;
  };

  type OldTripRequest = {
    id : Nat;
    name : Text;
    phone : Text;
    email : Text;
    tripType : {
      #roundTrip;
      #oneWay;
      #multiCity;
      #businessClass;
      #firstClass;
      #groupTravel;
      #other;
    };
    origin : Text;
    destination : Text;
    travelDates : Text;
    travelers : Nat;
    details : ?Text;
    submittedAt : Nat;
  };

  type NewTripRequest = {
    id : Nat;
    name : Text;
    phone : Text;
    email : Text;
    tripType : {
      #roundTrip;
      #oneWay;
      #multiCity;
      #businessClass;
      #firstClass;
      #groupTravel;
      #other;
    };
    origin : Text;
    destination : Text;
    departureDate : ?Text;
    returnDate : ?Text;
    travelers : Nat;
    cabin : {
      #economy;
      #premiumEconomy;
      #business;
      #first;
      #noPreference;
    };
    details : ?Text;
    submittedAt : Nat;
  };

  type OldActor = {
    accessControlState : AccessControlState;
    leads : List.List<OldTripRequest>;
    leadState : { var nextLeadId : Nat };
  };

  type NewActor = {
    accessControlState : AccessControlState;
    leads : List.List<NewTripRequest>;
    leadState : { var nextLeadId : Nat };
  };

  public func migration(old : OldActor) : NewActor {
    {
      accessControlState = old.accessControlState;
      leads = old.leads.map(
        func(request) {
          {
            id = request.id;
            name = request.name;
            phone = request.phone;
            email = request.email;
            tripType = request.tripType;
            origin = request.origin;
            destination = request.destination;
            departureDate = ?request.travelDates;
            returnDate = null;
            travelers = request.travelers;
            cabin = #noPreference;
            details = request.details;
            submittedAt = request.submittedAt;
          };
        }
      );
      leadState = old.leadState;
    };
  };
};
