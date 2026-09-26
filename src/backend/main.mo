import Blob "mo:core/Blob";
import List "mo:core/List";
import Nat64 "mo:core/Nat64";
import Text "mo:core/Text";
import Call "mo:ic/Call";
import IC "mo:ic/Types";
import AccessControl "mo:caffeineai-authorization/access-control";
import MixinAuthorization "mo:caffeineai-authorization/MixinAuthorization";
import Expose "mo:caffeineai-oql/Expose";
import Entity "mo:caffeineai-oql/Entity";
import ListEntity "mo:caffeineai-oql/ListEntity";
import RecordValue "mo:caffeineai-oql/RecordValue";
import NatValue "mo:caffeineai-oql/NatValue";
import TextValue "mo:caffeineai-oql/TextValue";
import OptTextValue "OptTextValue";
import TripTypeValue "TripTypeValue";
import CabinValue "CabinValue";
import LeadsApiMixin "mixins/leads-api";
import ApiDocMixin "mixins/api-doc";
import Types "types/leads";

actor {
  let accessControlState : AccessControl.AccessControlState;
  include MixinAuthorization(accessControlState, null);

  let leads : List.List<Types.TripRequest>;
  let leadState : { var nextLeadId : Types.LeadId };

  include LeadsApiMixin(leads, leadState, accessControlState);

  include Expose({
    entities = [
      leads.toEntity("tripRequest", "TripRequest", "id")
        .sample({
          id = 0;
          name = "";
          phone = "";
          email = "";
          tripType = #roundTrip;
          origin = "";
          destination = "";
          departureDate = null;
          returnDate = null;
          travelers = 1;
          cabin = #noPreference;
          details = null;
          submittedAt = 0;
        })
        .controllerOnly()
        .build(),
    ];
  });



  public query func transformFlightApi({
    context : Blob;
    response : IC.HttpRequestResult;
  }) : async IC.HttpRequestResult {
    { response with headers = [] };
  };

  private func flightApiUrl(path : Text) : Text {
    "https://air-routes.com" # path;
  };

  private func fetchFlightApi(path : Text) : async { status : Nat; body : Text } {
    let request : IC.HttpRequestArgs = {
      url = flightApiUrl(path);
      max_response_bytes = ?(100_000 : Nat64);
      headers = [
        { name = "User-Agent"; value = "TicketDepart-flight-search" },
      ];
      body = null;
      method = #get;
      transform = ?{
        function = transformFlightApi;
        context = Blob.fromArray([]);
      };
      is_replicated = null;
    };

    try {
      let response = await Call.httpRequest(request);
      let body = switch (Text.decodeUtf8(response.body)) {
        case (?text) { text };
        case (null) { "" };
      };
      { status = response.status; body };
    } catch (_error) {
      { status = 599; body = "" };
    };
  };

  public func searchFlightRoute(origin : Text, destination : Text) : async { status : Nat; body : Text } {
    fetchFlightApi("/api/route/" # Text.toUpper(origin) # "-" # Text.toUpper(destination));
  };

  public func searchFlightConnections(origin : Text, destination : Text) : async { status : Nat; body : Text } {
    fetchFlightApi(
      "/api/connections?from=" # Text.toUpper(origin) #
      "&to=" # Text.toUpper(destination) # "&max_stops=2"
    );
  };

  include ApiDocMixin();
};
