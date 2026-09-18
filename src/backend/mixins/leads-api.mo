import Int "mo:core/Int";
import List "mo:core/List";
import Result "mo:core/Result";
import Time "mo:core/Time";
import LeadsLib "../lib/leads";
import Types "../types/leads";

mixin (
  leads : List.List<Types.TripRequest>,
  state : { var nextLeadId : Types.LeadId },
) {
  /// Stores a trip request submitted from the contact page lead-capture form.
  /// Returns the stored record on success, or a caller-actionable error.
  public shared func submitTripRequest(input : Types.TripRequestInput) : async Result.Result<Types.TripRequest, Types.SubmitError> {
    switch (LeadsLib.validate(input)) {
      case (#err(error)) { #err(error) };
      case (#ok(())) {
        let id = state.nextLeadId;
        state.nextLeadId := id + 1;
        let request = LeadsLib.newRequest(id, input, Time.now().toNat());
        #ok(LeadsLib.store(leads, request));
      };
    };
  };
};
