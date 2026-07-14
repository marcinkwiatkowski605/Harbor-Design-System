#!/usr/bin/env node
/*
 * audit-tokens.mjs — fail CI when component CSS has unmarked hardcoded values.
 *
 * Harbor's component CSS is meant to be 100% token-driven (var(--ds-*)). This
 * script recursively scans every .css file under
 * packages/harbor-storybook/src/components/ for hex colors,
 * rgb()/rgba()/hsl()/hsla() functions, and px/rem/em/pt lengths that
 * aren't routed through a token. Two trailing-comment markers silence a line:
 *   - `PLACEHOLDER` — no Figma token exists *yet*; this value is temporary
 *     and should eventually be replaced by one.
 *   - `NOT-A-TOKEN` — this value will never be a token (e.g. a demo-only
 *     canvas size), so it's a permanent, deliberate exception.
 *
 * Known limitation: a hardcoded fallback inside var(--x, 4px) is stripped
 * along with the whole var(...) call and won't be caught. No var() call in
 * this codebase uses a fallback value today.
 *
 * Usage: node scripts/audit-tokens.mjs [--dir <dir>]
 *   (default: packages/harbor-storybook/src/components)
 */

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(__dirname, '..');

const argDir = (() => {
  const i = process.argv.indexOf('--dir');
  return i !== -1 && process.argv[i + 1] ? process.argv[i + 1] : 'packages/harbor-storybook/src/components';
})();
const scanDir = join(repoRoot, argDir);

const VAR_CALL = /var\([^)]*\)/g;
const HEX_COLOR = /#[0-9a-fA-F]{3,8}\b/;
const COLOR_FUNCTION = /\b(rgb|rgba|hsl|hsla)\(/;
const LENGTH = /\b\d*\.?\d+(px|rem|em|pt)\b/;

/** Recursively collect every .css file under a directory. */
function findCss(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...findCss(full));
    else if (entry.endsWith('.css')) out.push(full);
  }
  return out;
}

/** Return a violation category for a line with var(...) calls already stripped, or null. */
function classify(strippedLine) {
  if (HEX_COLOR.test(strippedLine)) return 'color (hex)';
  if (COLOR_FUNCTION.test(strippedLine)) return 'color (function)';
  if (LENGTH.test(strippedLine)) return 'length';
  return null;
}

const files = findCss(scanDir).sort();
const violations = [];

for (const file of files) {
  const lines = readFileSync(file, 'utf8').split('\n');
  lines.forEach((line, index) => {
    const stripped = line.replace(VAR_CALL, '');
    if (stripped.includes('PLACEHOLDER') || stripped.includes('NOT-A-TOKEN')) return;
    const category = classify(stripped);
    if (category) {
      violations.push({ file: relative(repoRoot, file), line: index + 1, text: line.trim(), category });
    }
  });
}

if (violations.length === 0) {
  console.log(`✓ No unmarked hardcoded values found (${files.length} files scanned)`);
  process.exit(0);
}

const byFile = new Map();
for (const v of violations) {
  if (!byFile.has(v.file)) byFile.set(v.file, []);
  byFile.get(v.file).push(v);
}

for (const [file, fileViolations] of byFile) {
  console.error(`\n${file}`);
  for (const v of fileViolations) {
    console.error(`  ${v.line}: [${v.category}] ${v.text}`);
  }
}

console.error(`\n✗ ${violations.length} unmarked hardcoded value(s) found in ${byFile.size} file(s)`);
process.exit(1);
