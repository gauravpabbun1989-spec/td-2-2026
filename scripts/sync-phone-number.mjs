#!/usr/bin/env node
/**
 * Audit or replace retired TicketDepart phone numbers.
 * Canonical values: config/phone-number.json
 */
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { resolve, extname } from "node:path";

const root = process.cwd();
const config = JSON.parse(
  readFileSync(resolve(root, "config/phone-number.json"), "utf8"),
);

if (!config.display || !config.tel || !Array.isArray(config.legacy)) {
  console.error("Invalid config/phone-number.json");
  process.exit(2);
}

const replaceMode = process.argv.includes("--replace");

const files = execFileSync("git", ["ls-files", "-z"], {
  encoding: "utf8",
}).split("\0").filter(Boolean);

const ignored = new Set([
  "config/phone-number.json",
  "src/frontend/src/lib/site.ts",
]);

const textExtensions = new Set([
  ".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs",
  ".json", ".html", ".md", ".txt", ".xml", ".yml",
  ".yaml", ".css", ".scss", ".svg",
]);

const patterns = config.legacy.map((old) => {
  const digits = old.replace(/\D/g, "");
  const national = digits.startsWith("1") ? digits.slice(1) : digits;
  const prefix = digits.startsWith("1")
    ? String.raw`(?:\+?1[\s().-]*)?`
    : "";
  const body = national.split("").join(String.raw`[\s().-]*`);

  return new RegExp(
    String.raw`(?<!\d)${prefix}${body}(?!\d)`,
    "g",
  );
});

let changed = 0;
const found = [];

for (const file of files) {
  if (ignored.has(file) || !textExtensions.has(extname(file))) continue;

  let content;
  try {
    const bytes = readFileSync(resolve(root, file));
    if (bytes.includes(0)) continue;
    content = bytes.toString("utf8");
  } catch {
    continue;
  }

  let next = content;

  for (const pattern of patterns) {
    const telPattern = new RegExp(
      String.raw`tel:\s*${pattern.source}`,
      "gi",
    );

    for (const match of content.matchAll(telPattern)) {
      found.push({ file, match: match[0] });
    }

    for (const match of content.matchAll(pattern)) {
      found.push({ file, match: match[0] });
    }

    if (replaceMode) {
      next = next.replace(telPattern, `tel:${config.tel}`);
      next = next.replace(pattern, config.display);
    }
  }

  if (replaceMode && next !== content) {
    writeFileSync(resolve(root, file), next);
    changed++;
  }
}

if (found.length) {
  console.log(replaceMode ? "Replaced legacy references:" : "Legacy references found:");
  for (const item of found) {
    console.log(`- ${item.file}: ${item.match}`);
  }
  if (replaceMode) {
    console.log(`Updated ${changed} tracked file(s).`);
  } else {
    process.exitCode = 1;
  }
} else {
  console.log(`No retired phone references found in ${files.length} tracked files.`);
}
