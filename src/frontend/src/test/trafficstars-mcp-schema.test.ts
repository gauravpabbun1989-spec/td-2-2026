import { describe, expect, it } from "vitest";
import { z } from "zod";

import { campaignChangesSchema } from "../../trafficstars-manager/mcp/schemas";

describe("TrafficStars MCP campaign update schema", () => {
  it("publishes a constrained additionalProperties schema for portable MCP clients", () => {
    const jsonSchema = z.toJSONSchema(z.object({ changes: campaignChangesSchema }));
    const properties = jsonSchema.properties as
      | Record<string, unknown>
      | undefined;
    const changes = properties?.changes as
      | Record<string, unknown>
      | undefined;
    const additionalProperties = changes?.additionalProperties as
      | Record<string, unknown>
      | undefined;

    expect(additionalProperties).toBeDefined();
    expect(additionalProperties).not.toEqual({});
    expect(
      ["anyOf", "oneOf", "type"].some((key) => Object.hasOwn(additionalProperties ?? {}, key)),
    ).toBe(true);
  });

  it("accepts only values supported by the TrafficStars update API", () => {
    expect(
      campaignChangesSchema.safeParse({
        name: "TicketDepart economy test",
        max_daily: 100,
        enabled_subids: ["sub-1", "sub-2"],
        spots: [10, 20],
        disable_rtb: true,
      }).success,
    ).toBe(true);

    expect(campaignChangesSchema.safeParse({ name: null }).success).toBe(false);
    expect(campaignChangesSchema.safeParse({ countries: { include: ["US"] } }).success).toBe(false);
    expect(campaignChangesSchema.safeParse({ spots: [[1, 2]] }).success).toBe(false);
    expect(campaignChangesSchema.safeParse({}).success).toBe(false);
  });
});
