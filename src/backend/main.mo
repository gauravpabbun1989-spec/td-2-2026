import Blob "mo:base/Blob";
import Nat64 "mo:base/Nat64";
import Text "mo:base/Text";
import Call "mo:ic/Call";
import IC "mo:ic/IC";

actor {
  type TransformContext = {
    context : Blob;
    response : Call.HttpResponse;
  };

  func transformFlightApi({ context; response } : TransformContext) : Call.HttpResponse {
    {
      response with
      headers = [];
    };
  };

  func fetchFlightApi(path : Text) : async { status : Nat; body : Text } {
    let request : Call.HttpRequest = {
      url = "https://air-routes.com" # path;
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
    await fetchFlightApi("/api/route/" # Text.toUpper(origin) # "-" # Text.toUpper(destination));
  };

  public func searchFlightConnections(origin : Text, destination : Text) : async { status : Nat; body : Text } {
    await fetchFlightApi(
      "/api/connections?from=" # Text.toUpper(origin) #
      "&to=" # Text.toUpper(destination) # "&max_stops=2"
    );
  };

  include ApiDocMixin();
};