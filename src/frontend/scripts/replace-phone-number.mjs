import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..", "..");
const configPath = path.join(repoRoot, "config", "phone-number.json");
const thisFile = fileURLToPath(import.meta.url);
const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
const replacements = config.legacy.flatMap((old) => {
  const compact = old.replace(/[^0-9]/g, "");
  return [
    [old, config.display],
    [compact, config.tel.replace(/^\+/, "")],
    [`tel:${old}`, `tel:${config.tel}`],
    [`tel:+${compact}`, `tel:${config.tel}`],
  ];
});
const excluded = new Set([
  ".git", "node_modules", "dist", "build", "coverage", ".next",
  ".turbo", "vendor", ".phone-number-backups", "ticket-depart2", "pnpm-lock.yaml", "package-lock.json", "yarn.lock",
]);
const textExtensions = new Set([
  ".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs", ".json", ".html",
  ".css", ".scss", ".md", ".txt", ".xml", ".yml", ".yaml", ".toml",
  ".env", ".svg", ".sql",
]);
let changedFiles = 0;
let replacementsCount = 0;

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (excluded.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full);
      continue;
    }
    if (!entry.isFile()) continue;
    const ext = path.extname(entry.name).toLowerCase();
    if (!textExtensions.has(ext) && ![".gitignore", ".npmrc", ".prettierignore"].includes(entry.name)) continue;
    if (full === configPath || full === thisFile) continue;
    let content;
    try { content = fs.readFileSync(full, "utf8"); } catch { continue; }
    if (content.includes("\0")) continue;
    let next = content;
    for (const [from, to] of replacements) {
      if (!from || from === to) continue;
      const escaped = from.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp(escaped, "g");
      const matches = next.match(regex);
      if (matches) {
        replacementsCount += matches.length;
        next = next.replace(regex, to);
      }
    }
    if (next !== content) {
      fs.writeFileSync(full, next);
      changedFiles++;
      console.log(path.relative(repoRoot, full));
    }
  }
}

walk(repoRoot);
console.log(`Phone-number sync complete: ${replacementsCount} replacement(s) across ${changedFiles} file(s). Current number: ${config.display}`);
