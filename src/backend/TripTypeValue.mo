import OQL "mo:caffeineai-oql";
import Types "types/leads";

module {
  /// Converts a TripType variant to its tag name so the column is queryable.
  public func _toRow(self : Types.TripType) : OQL.Value {
    #text(
      switch self {
        case (#roundTrip) { "roundTrip" };
        case (#oneWay) { "oneWay" };
        case (#multiCity) { "multiCity" };
        case (#businessClass) { "businessClass" };
        case (#firstClass) { "firstClass" };
        case (#groupTravel) { "groupTravel" };
        case (#other) { "other" };
      }
    );
  };
};
