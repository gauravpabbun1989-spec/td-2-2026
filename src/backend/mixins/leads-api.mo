import List "mo:core/List";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import AccessControl "mo:caffeineai-authorization/access-control";
import EmailClient "mo:caffeineai-email/emailClient";
import LeadsLib "../lib/leads";
import Types "../types/leads";

mixin (
  leads : List.List<Types.TripRequest>,
  state : { var nextLeadId : Types.LeadId },
  accessControlState : AccessControl.AccessControlState,
) {
  /// Stores a trip request submitted from the contact page lead-capture form.
  /// Returns `#ok` only after the lead is durably written to stable storage.
  /// The success payload reports whether the notification email was sent.
  public shared func submitTripRequest(input : Types.TripRequestInput) : async Types.SubmitResult {
    switch (LeadsLib.validate(input)) {
      case (#err(error)) { return #err(error) };
      case (#ok(())) {};
    };

    let id = state.nextLeadId;
    state.nextLeadId := id + 1;

    let request = LeadsLib.newRequest(id, input, Time.now().toNat());
    let stored = LeadsLib.store(leads, request);

    let email : Types.EmailStatus = switch (
      await EmailClient.sendServiceEmail(
        "no-reply",
        ["support@ticketdestinations.com"],
        LeadsLib.notificationSubject(stored),
        LeadsLib.notificationBody(stored),
      )
    ) {
      case (#ok) { #sent };
      case (#err(error)) { #failed(error) };
    };

    #ok({ lead = stored; email });
  };

  /// Admin-only: returns every stored lead, newest first.
  public query ({ caller }) func listLeads() : async [Types.TripRequest] {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can view submitted leads");
    };
    LeadsLib.listNewestFirst(leads);
  };
};
