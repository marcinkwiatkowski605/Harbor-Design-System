#!/usr/bin/env node
/*
 * build-llms-docs.mjs — make the design-system docs readable by LLMs.
 *
 * Storybook Docs pages are React-rendered, so an LLM (or crawler) that fetches the
 * built site gets a JS shell, not the content. This script derives plain Markdown
 * from the canonical MDX docs and emits:
 *
 *   docs/components/<slug>.md   one clean Markdown file per component
 *   docs/llms.txt               index following the llmstxt.org convention
 *   docs/llms-full.txt          components + foundations concatenated into one file
 *
 * The MDX under packages/harbor-storybook/src is the single source of truth for
 * components; these outputs are generated. Run `npm run build:llms` after editing any
 * .mdx. Foundations docs (docs/foundations/*.md) are hand-authored Markdown — this
 * script only reads them to build the index, it never writes or overwrites them.
 *
 * Usage: node scripts/build-llms-docs.mjs [--out <dir>]   (default: docs)
 */

import { readFileSync, writeFileSync, mkdirSync, readdirSync, statSync, rmSync, existsSync } from 'node:fs';
import { join, dirname, basename, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(__dirname, '..');

const SITE_TITLE = 'Harbor Design System';
const SITE_SUMMARY =
  'A token-driven design system. Components are documented from their Figma source; ' +
  'every color, size, and type value resolves to a design token.';

// Foundations are listed in this order; unknown files fall to the end, alphabetically.
const FOUNDATION_ORDER = ['overview', 'color', 'typography', 'dimensions'];

const argOut = (() => {
  const i = process.argv.indexOf('--out');
  return i !== -1 && process.argv[i + 1] ? process.argv[i + 1] : 'docs';
})();
const outDir = join(repoRoot, argOut);
const srcDir = join(repoRoot, 'packages/harbor-storybook/src');

/** Recursively collect every .mdx file under a directory. */
function findMdx(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...findMdx(full));
    else if (entry.endsWith('.mdx')) out.push(full);
  }
  return out;
}

/** Strip MDX-only syntax, leaving portable Markdown. */
function mdxToMarkdown(mdx) {
  const lines = mdx.split('\n');
  const kept = [];
  for (const line of lines) {
    const t = line.trim();
    if (/^import\s.+from\s.+;?$/.test(t)) continue; // import statements
    if (/^<Meta\b/.test(t)) continue; // <Meta of={...} />
    if (/^<Controls\s*\/?>$/.test(t)) continue; // props rendered by the API table below
    if (/^<Primary\s*\/?>$/.test(t)) {
      kept.push('> _Live, interactive example — see this component in Storybook._');
      continue;
    }
    kept.push(line);
  }
  // Collapse 3+ blank lines to one; trim leading/trailing blanks.
  return kept
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/^\n+/, '')
    .replace(/\n+$/, '') + '\n';
}

/** First `# ` heading → title. */
function extractTitle(md, fallback) {
  const m = md.match(/^#\s+(.+)$/m);
  return m ? m[1].trim() : fallback;
}

/** First real paragraph after the title → one-line description. */
function extractSummary(md) {
  const lines = md.split('\n');
  let seenTitle = false;
  for (const line of lines) {
    const t = line.trim();
    if (!seenTitle) {
      if (/^#\s+/.test(t)) seenTitle = true;
      continue;
    }
    if (t === '' || t.startsWith('>') || t.startsWith('#')) continue;
    // First sentence only, collapse whitespace.
    const firstSentence = t.replace(/\s+/g, ' ').match(/^(.+?[.!?])(\s|$)/);
    return firstSentence ? firstSentence[1] : t;
  }
  return '';
}

/** Remove HTML comments (author notes) and tidy blank lines — for hand-authored Markdown. */
function normalizeMarkdown(md) {
  return md
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/^\n+/, '')
    .replace(/\n+$/, '') + '\n';
}

/** Sort foundation files by FOUNDATION_ORDER, then alphabetically for the rest. */
function orderFoundations(files) {
  return files.sort((a, b) => {
    const sa = basename(a, '.md').toLowerCase();
    const sb = basename(b, '.md').toLowerCase();
    const ia = FOUNDATION_ORDER.indexOf(sa);
    const ib = FOUNDATION_ORDER.indexOf(sb);
    if (ia !== -1 && ib !== -1) return ia - ib;
    if (ia !== -1) return -1;
    if (ib !== -1) return 1;
    return sa.localeCompare(sb);
  });
}

const mdxFiles = findMdx(srcDir).sort();
if (mdxFiles.length === 0) {
  console.error(`No .mdx files found under ${relative(repoRoot, srcDir)}`);
  process.exit(1);
}

// Fresh components dir each run so deleted/renamed docs don't linger.
const componentsDir = join(outDir, 'components');
rmSync(componentsDir, { recursive: true, force: true });
mkdirSync(componentsDir, { recursive: true });

const entries = [];
for (const file of mdxFiles) {
  const raw = readFileSync(file, 'utf8');
  const md = mdxToMarkdown(raw);
  const slug = basename(file, '.mdx').toLowerCase();
  const title = extractTitle(md, basename(file, '.mdx'));
  const summary = extractSummary(md);
  const relPath = `components/${slug}.md`;
  writeFileSync(join(outDir, relPath), md);
  entries.push({ slug, title, summary, relPath, md });
}

// Foundations — hand-authored Markdown in docs/foundations/. Read-only: indexed here,
// never written, so an author's edits are never clobbered.
const foundationsDir = join(outDir, 'foundations');
const foundations = [];
if (existsSync(foundationsDir)) {
  const files = orderFoundations(
    readdirSync(foundationsDir)
      .filter((f) => f.endsWith('.md'))
      .map((f) => join(foundationsDir, f))
  );
  for (const file of files) {
    const md = normalizeMarkdown(readFileSync(file, 'utf8'));
    const slug = basename(file, '.md').toLowerCase();
    foundations.push({
      slug,
      title: extractTitle(md, slug),
      summary: extractSummary(md),
      relPath: `foundations/${slug}.md`,
      md,
    });
  }
}

const linkLine = (e) =>
  `- [${e.title}](./${e.relPath})${e.summary ? `: ${e.summary}` : ''}`;

// llms.txt — index (https://llmstxt.org). Foundations first (prerequisite knowledge).
const indexLines = [`# ${SITE_TITLE}`, '', `> ${SITE_SUMMARY}`, ''];
if (foundations.length) {
  indexLines.push('## Foundations', '', ...foundations.map(linkLine), '');
}
indexLines.push('## Components', '', ...entries.map(linkLine), '');
writeFileSync(join(outDir, 'llms.txt'), indexLines.join('\n'));

// llms-full.txt — everything inlined for one-shot context, foundations before components.
const fullParts = [
  `# ${SITE_TITLE} — full documentation`,
  '',
  `> ${SITE_SUMMARY}`,
  '',
  ...[...foundations, ...entries].map((e) => `---\n\n${e.md.trim()}\n`),
];
writeFileSync(join(outDir, 'llms-full.txt'), fullParts.join('\n') + '\n');

console.log(`Generated LLM docs in ${relative(repoRoot, outDir)}/`);
console.log(`  ${entries.length} component file(s): ${entries.map((e) => e.slug).join(', ')}`);
console.log(`  ${foundations.length} foundation file(s): ${foundations.map((e) => e.slug).join(', ') || '—'}`);
console.log('  llms.txt, llms-full.txt');
