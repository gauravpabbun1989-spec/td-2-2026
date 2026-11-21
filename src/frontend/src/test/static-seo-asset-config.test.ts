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

function ruleFor(path: string): AssetRule | undefined {
  return RULES.find((rule) => rule.match === path);
}

describe(".ic-assets.json5 asset-serving rules", () => {
  it("exists as a required Caffeine frontend source asset", () => {
    expect(CONFIG_EXISTS).toBe(true);
  });

  it("contains exact SEO-file rules followed by a global aliasing rule", () => {
    expect(RULES.map((rule) => rule.match)).toEqual([
      "sitemap.xml",
      "robots.txt",
      "index.html",
      "**/*",
    ]);
  });

  it("serves sitemap.xml as application/xml; charset=utf-8", () => {
    const rule = ruleFor("sitemap.xml");
    expect(rule).toBeDefined();
    expect(rule?.headers?.["Content-Type"]).toBe(
      "application/xml; charset=utf-8",
    );
    expect(rule?.enable_aliasing).toBe(false);
  });

  it("serves robots.txt as text/plain", () => {
    const rule = ruleFor("robots.txt");
    expect(rule).toBeDefined();
    expect(rule?.headers?.["Content-Type"]).toBe("text/plain");
    expect(rule?.enable_aliasing).toBe(false);
  });

  it("explicitly disables SPA aliasing on index.html", () => {
    const indexRule = ruleFor("index.html");
    expect(indexRule).toBeDefined();
    expect(indexRule?.enable_aliasing).toBe(false);
  });

  it("disables SPA aliasing globally for unmatched paths", () => {
    const globalRule = ruleFor("**/*");
    expect(globalRule).toBeDefined();
    expect(globalRule?.enable_aliasing).toBe(false);
  });

  it("points every exact-path rule at a real file in public/", () => {
    for (const rule of RULES.filter((entry) => entry.match !== "**/*" && entry.match !== "index.html")) {
      expect(rule.match, "every exact rule must name a path").toBeTruthy();
      expect(() => readPublicFile(rule.match as string)).not.toThrow();
    }
  });
});
