#!/usr/bin/env node
/**
 * Audit tracked project files for the retired TicketDepart phone number.
 *
 * Usage:
 *   node scripts/sync-phone-number.mjs          # report stale references; exit 1 if found
 *   node scripts/sync-phone-number.mjs --replace # replace stale references in tracked text files
 *
 * The current display number and tel: URI are read from SITE in
 * src/frontend/src/lib/site.ts, so that file remains the single source of truth.
 */
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
const configPath = resolve(root, "src/frontend/src/lib/site.ts");
const config = readFileSync(configPath, "utf8");
const display = config.match(/phoneDisplay:\s*"([^"]+)"/)?.[1];
const href = config.match(/phoneHref:\s*"([^"]+)"/)?.[1];

if (!display || !href) {
  console.error("Could not read phoneDisplay and phoneHref from SITE.");
  process.exit(2);
}

const oldVariants = [
  "+1-888-958-0280",
  "tel:+18889580280",
  "+1 888 958 0280",
  "1-888-958-0280",
  "18889580280",
];
const replacements = [
  [ /\+1-888-958-0280/g, display ],
  [ /tel:\+18889580280/g, href ],
  [ /\+1 888 958 0280/g, display ],
  [ /1-888-958-0280/g, display.replace(/^\+/, "") ],
  [ /18889580280/g, href.replace(/^tel:\+/, "") ],
];
const replaceMode = process.argv.includes("--replace");
const files = execFileSync("git", ["ls-files", "-z"], { encoding: "utf8" })
  .split("\0").filter(Boolean);
const ignored = new Set(["src/frontend/src/lib/site.ts"]);
const found = [];
let changed = 0;

for (const file of files) {
  if (ignored.has(file)) continue;
  let content;
  try {
    const bytes = readFileSync(resolve(root, file));
    if (bytes.includes(0)) continue;
    content = bytes.toString("utf8");
  } catch {
    continue;
  }
  let next = content;
  for (const [pattern, replacement] of replacements) {
    if (pattern.test(next)) {
      pattern.lastIndex = 0;
      found.push({ file, match: pattern.source });
      if (replaceMode) next = next.replace(pattern, replacement);
    }
    pattern.lastIndex = 0;
  }
  if (replaceMode && next !== content) {
    writeFileSync(resolve(root, file), next);
    changed++;
  }
}

if (found.length) {
  console.log((replaceMode ? "Updated" : "Found stale phone references") + ":");
  for (const item of found) console.log(`- ${item.file} (${item.match})`);
  if (replaceMode) console.log(`Updated ${changed} tracked file(s). Re-run without --replace to verify.`);
  else process.exitCode = 1;
} else {
  console.log(`No retired phone-number references found in ${files.length} tracked files.`);
}
