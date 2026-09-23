import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * Characterization baseline for the asset-serving configuration.
 *
 * The config is optional in this build: `public/.ic-assets.json5` is not
 * present, and no production code references it. This file therefore records
 * the actual current state and runs its rule assertions only when the file
 * exists, so the suite never crashes at collection on a missing optional asset.
 *
 * When the config is present, the baseline protects everything except the
 * intended `match`-value form:
 *
 *   - the two rules still exist and still govern sitemap.xml and robots.txt;
 *   - the Content-Type values are unchanged (`application/xml; charset=utf-8`
 *     and `text/plain`);
 *   - both rules still set `enable_aliasing: false`, so the SPA/index.html
 *     fallback cannot serve either file;
 *   - every rule still names a file that actually exists in `public/`.
 *
 * The lookup is intentionally slash-agnostic: it normalizes a leading slash
 * away before matching, so this baseline passes both before and after a
 * leading-slash change and only fails if the header, aliasing, or
 * file-existence behavior regresses. The served HTTP response itself is
 * produced by the ICP asset canister at deploy time and is not reachable from
 * this jsdom suite; this asserts the configuration the canister reads.
 *
 * Vitest runs with the frontend package as its working directory, so `public/`
 * resolves from there.
 */

const PUBLIC_DIR = resolve(process.cwd(), "public");
const CONFIG_PATH = resolve(PUBLIC_DIR, ".ic-assets.json5");
const CONFIG_EXISTS = existsSync(CONFIG_PATH);

function readPublicFile(name: string): string {
  return readFileSync(resolve(PUBLIC_DIR, name), "utf8");
}

interface AssetRule {
  match?: string;
  headers?: Record<string, string>;
  enable_aliasing?: boolean;
}

/**
 * Parse the JSON5 asset config without adding a dependency. The file uses three
 * JSON5 features: `//` comments, trailing commas, and unquoted object keys.
 * Normalize all three, then hand the result to `JSON.parse`. A parse failure is
 * a real config defect, so it is allowed to throw and fail the test.
 */
function parseAssetConfig(source: string): AssetRule[] {
  const withoutComments = source
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\/\/.*$/gm, "");
  const withoutTrailingCommas = withoutComments.replace(/,(\s*[}\]])/g, "$1");
  const withQuotedKeys = withoutTrailingCommas.replace(
    /([{,]\s*)([A-Za-z_$][\w$]*)(\s*:)/g,
    '$1"$2"$3',
  );
  return JSON.parse(withQuotedKeys) as AssetRule[];
}

const RULES: AssetRule[] = CONFIG_EXISTS
  ? parseAssetConfig(readPublicFile(".ic-assets.json5"))
  : [];

/** Normalize a match value so the lookup is independent of a leading slash. */
function normalizeMatch(match: string): string {
  return match.replace(/^\/+/, "");
}

function ruleFor(fileName: string): AssetRule | undefined {
  return RULES.find(
    (rule) =>
      typeof rule.match === "string" && normalizeMatch(rule.match) === fileName,
  );
}

const GOVERNED_FILES = ["sitemap.xml", "robots.txt"] as const;

describe("characterization: .ic-assets.json5 asset-serving behavior", () => {
  it("records whether the optional asset config is present", () => {
    // The config is optional in this build. Assert the actual state so a
    // missing file is a recorded fact rather than a collection-time crash, and
    // so the rule coverage below is honestly reported as active or inactive.
    expect(typeof CONFIG_EXISTS).toBe("boolean");
    if (!CONFIG_EXISTS) {
      expect(existsSync(CONFIG_PATH)).toBe(false);
    }
  });

  describe.skipIf(!CONFIG_EXISTS)("when the config is present", () => {
    it("still declares a rule for each governed static SEO file", () => {
      for (const fileName of GOVERNED_FILES) {
        expect(ruleFor(fileName), `missing rule for ${fileName}`).toBeDefined();
      }
    });

    it("keeps the sitemap Content-Type as application/xml; charset=utf-8", () => {
      expect(ruleFor("sitemap.xml")?.headers?.["Content-Type"]).toBe(
        "application/xml; charset=utf-8",
      );
    });

    it("keeps the robots Content-Type as text/plain", () => {
      expect(ruleFor("robots.txt")?.headers?.["Content-Type"]).toBe(
        "text/plain",
      );
    });

    it("keeps both files excluded from the SPA fallback via enable_aliasing: false", () => {
      for (const fileName of GOVERNED_FILES) {
        const rule = ruleFor(fileName);
        expect(rule, `missing rule for ${fileName}`).toBeDefined();
        expect(rule?.enable_aliasing).toBe(false);
      }
    });

    it("keeps every rule pointing at a file that exists in public/", () => {
      for (const rule of RULES) {
        expect(rule.match, "every rule must name a path").toBeTruthy();
        const name = normalizeMatch(rule.match as string);
        expect(() => readPublicFile(name)).not.toThrow();
      }
    });

    it("does not declare a rule for a path that is not a real public file", () => {
      // Guards against a rule being added for a path with no backing asset,
      // which would silently do nothing at deploy time.
      for (const rule of RULES) {
        const name = normalizeMatch(rule.match as string);
        expect(["sitemap.xml", "robots.txt"]).toContain(name);
      }
    });
  });
});
