import List "mo:core/List";
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

  include ApiDocMixin();
};
