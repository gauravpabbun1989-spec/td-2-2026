import OQL "mo:caffeineai-oql";
import Types "types/leads";

module {
  /// Converts a Cabin variant to its tag name so the column is queryable.
  public func _toRow(self : Types.Cabin) : OQL.Value {
    #text(
      switch self {
        case (#economy) { "economy" };
        case (#premiumEconomy) { "premiumEconomy" };
        case (#business) { "business" };
        case (#first) { "first" };
        case (#noPreference) { "noPreference" };
      }
    );
  };
};
