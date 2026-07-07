// scripts/sync-tokens-version.mjs
// Invoked by semantic-release (@semantic-release/exec, prepare phase) as:
//   node scripts/sync-tokens-version.mjs <version>
// Keeps packages/harbor-tokens/package.json in lockstep with the root
// repo version computed by semantic-release, since this repo publishes
// one version number for the whole monorepo rather than per-package.
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const version = process.argv[2];
if (!version) {
  console.error("Usage: node scripts/sync-tokens-version.mjs <version>");
  process.exit(1);
}

const rootDir = path.dirname(fileURLToPath(import.meta.url));
const pkgPath = path.join(rootDir, "..", "packages", "harbor-tokens", "package.json");

const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
pkg.version = version;
writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");

console.log(`Updated ${pkgPath} to version ${version}`);
