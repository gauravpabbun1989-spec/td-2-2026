import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const frontendRoot = path.resolve(scriptDir, "..");
const distDir = path.join(frontendRoot, "dist");
const viteCacheDir = path.join(frontendRoot, "node_modules", ".vite");

fs.rmSync(distDir, { recursive: true, force: true });
fs.rmSync(viteCacheDir, { recursive: true, force: true });
console.log("Cleaned frontend dist output and Vite cache.");
