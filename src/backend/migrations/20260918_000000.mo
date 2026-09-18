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

  type TripRequest = {
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

  type OldActor = {};

  type NewActor = {
    accessControlState : AccessControlState;
    leads : List.List<TripRequest>;
    leadState : { var nextLeadId : Nat };
  };

  public func migration(_old : OldActor) : NewActor {
    {
      accessControlState = {
        var adminAssigned = false;
        userRoles = Map.empty();
      };
      leads = List.empty();
      leadState = { var nextLeadId = 0 };
    };
  };
};
