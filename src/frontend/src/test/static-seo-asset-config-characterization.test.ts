import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const PUBLIC_DIR = resolve(process.cwd(), "public");
const CONFIG_PATH = resolve(PUBLIC_DIR, ".ic-assets.json5");

function readPublicFile(name: string): string {
  return readFileSync(resolve(PUBLIC_DIR, name), "utf8");
}

interface AssetRule {
  match?: string;
  headers?: Record<string, string>;
  enable_aliasing?: boolean;
}

/** Parse the JSON5 asset config without adding a dependency. */
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

const CONFIG_EXISTS = existsSync(CONFIG_PATH);
const RULES = CONFIG_EXISTS
  ? parseAssetConfig(readPublicFile(".ic-assets.json5"))
  : [];

function ruleFor(match: string): AssetRule | undefined {
  return RULES.find((rule) => rule.match === match);
}

const GOVERNED_FILES = ["sitemap.xml", "robots.txt"] as const;

describe("characterization: .ic-assets.json5 asset-serving behavior", () => {
  it("requires the Caffeine asset-canister config to be present", () => {
    expect(CONFIG_EXISTS).toBe(true);
  });

  it("retains exact rules for the governed static SEO files", () => {
    expect(RULES.map((rule) => rule.match)).toEqual([
      "sitemap.xml",
      "robots.txt",
      "index.html",
      "**/*",
    ]);
  });

  it("keeps sitemap Content-Type and alias behavior unchanged", () => {
    const rule = ruleFor("sitemap.xml");
    expect(rule?.headers?.["Content-Type"]).toBe(
      "application/xml; charset=utf-8",
    );
    expect(rule?.enable_aliasing).toBe(false);
  });

  it("keeps robots Content-Type and alias behavior unchanged", () => {
    const rule = ruleFor("robots.txt");
    expect(rule?.headers?.["Content-Type"]).toBe("text/plain");
    expect(rule?.enable_aliasing).toBe(false);
  });

  it("explicitly disables SPA aliasing on index.html", () => {
    expect(ruleFor("index.html")?.enable_aliasing).toBe(false);
  });

  it("disables SPA aliasing on all unmatched paths with the global rule", () => {
    expect(ruleFor("**/*")?.enable_aliasing).toBe(false);
  });

  it("keeps every exact-path rule pointing at a real public file", () => {
    for (const rule of RULES.filter((entry) => entry.match !== "**/*" && entry.match !== "index.html")) {
      expect(rule.match, "every exact rule must name a path").toBeTruthy();
      expect(() => readPublicFile(rule.match as string)).not.toThrow();
    }
  });

  it("does not declare unsupported exact-path rules", () => {
    const exactRules = RULES
      .filter((rule) => rule.match !== "**/*" && rule.match !== "index.html")
      .map((rule) => rule.match);
    expect(exactRules).toEqual([...GOVERNED_FILES]);
  });
});
