import { z } from "zod";

/**
 * Matches the campaign update runtime validator:
 * - scalar strings, finite numbers, or booleans;
 * - flat arrays of strings or safe integers;
 * - no nulls, nested objects, nested arrays, or arbitrary JSON values.
 *
 * Explicit value types make MCP's generated additionalProperties schema
 * portable across clients that reject unconstrained {} schemas.
 */
export const campaignChangeValueSchema = z.union([
  z.string().max(2_000),
  z.number().finite(),
  z.boolean(),
  z.array(z.union([z.string().max(2_000), z.number().int().safe()])).max(1_000),
]);

export const campaignChangesSchema = z
  .record(z.string(), campaignChangeValueSchema)
  .refine(
    (value) => Object.keys(value).length >= 1 && Object.keys(value).length <= 30,
    "Provide 1 to 30 campaign fields.",
  );
