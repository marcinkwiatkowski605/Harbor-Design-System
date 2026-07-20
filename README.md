![Harbor Design System](./assets/cover.jpg)

# Harbor Design System

[![npm version](https://img.shields.io/npm/v/@harbords/tokens.svg)](https://www.npmjs.com/package/@harbords/tokens)
[![Deploy Storybook](https://github.com/marcinkwiatkowski605/Harbor-Design-System/actions/workflows/deploy.yml/badge.svg)](https://github.com/marcinkwiatkowski605/Harbor-Design-System/actions/workflows/deploy.yml)
[![Lint](https://github.com/marcinkwiatkowski605/Harbor-Design-System/actions/workflows/lint.yml/badge.svg)](https://github.com/marcinkwiatkowski605/Harbor-Design-System/actions/workflows/lint.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)

**[Live Storybook →](https://marcinkwiatkowski605.github.io/Harbor-Design-System/)**

Harbor Design System is a demonstration project that showcases my skills in
design-token architecture, tooling, and the design-to-code workflow.

The project includes:

- a Figma file that defines the design tokens and a set of components;
- an export of those tokens from Figma to a JSON file in DTCG (Design Token Community Group) format for Style Dictionary;
- React components in Storybook, built on accessible headless primitives
  ([`react-aria-components`](https://react-aria.adobe.com/));
- a Storybook that visualizes the tokens and documents the components;
- an adaptation of the component docs for large language models (LLMs), published as plain-text `llms.txt` files.

## Project status

**Button**, **TextField**, and **TextArea** are fully token-driven and accessible;
**Button** is additionally design-verified against Figma and documented with a WCAG 2.2
audit. **Select**'s field and trigger are token-driven, but its dropdown menu still runs
on clearly-marked placeholder values pending its Figma tokens; see
[Token coverage](#token-coverage) for what "placeholder" means in the CSS.

## Prerequisites

- Node.js 24+ (matches the version pinned in CI — see `.github/workflows/*.yml`)
- npm (ships with Node.js)

## Getting started

```bash
npm install             # Install all workspace dependencies
npm run build:tokens    # Build design tokens (design_tokens.json → CSS / JSON / JS) — run before start/build:storybook, which import the built CSS
npm start               # Start Storybook at http://localhost:6006
npm run build:storybook # Build the static Storybook site
npm run build:llms      # Regenerate docs/ from the component/foundations MDX
npm run audit:tokens    # Fail if component CSS has an unmarked hardcoded value
```

## Monorepo layout (npm workspaces)

```
design_tokens.json       # Token source — W3C DTCG export from the Figma "HRDS" file
packages/
  harbor-tokens/         # Style Dictionary token build
    config.js            # Reads design_tokens.json, emits tiered CSS vars / JSON / JS
    light/build/         # Generated output (gitignored) — run npm run build:tokens
  harbor-storybook/      # React + Storybook 8 (Vite)
    .storybook/
      components/        # Token visualization stories (Foundations)
      preview.ts         # Imports the built token CSS
    src/
      components/        # React components + MDX docs — Button, Select, TextField, TextArea
      foundations/        # Hand-written Storybook pages (e.g. Design Tokens architecture)
scripts/
  build-llms-docs.mjs      # Derives the LLM docs from the component/foundations MDX
  sync-tokens-version.mjs  # Keeps @harbords/tokens' version in lockstep with releases
docs/
  components/*.md         # Generated from every src/**/*.mdx (component AND src/foundations pages)
  foundations/*.md        # Hand-authored Markdown (color, typography, dimensions, overview) — separate from the above
  llms.txt, llms-full.txt # Generated index / single-file dump
```

## Design tokens

Tokens live in Figma (file [**HRDS**](https://www.figma.com/design/PiFuQxqvMoH12lGMX6nhER/HRDS?node-id=0-1&t=DsNC5NldMKx9iHIA-1)) and are exported to `design_tokens.json` in W3C
DTCG format. `npm run build:tokens` runs Style Dictionary (`harbor-tokens/config.js`),
which resolves aliases and emits CSS custom properties, flat JSON, and JS exports into
`packages/harbor-tokens/light/build/`.

There is **no theme switching** — a CSS variable's prefix marks its tier (the Figma
collection it comes from):

| Tier | Figma collection | CSS prefix | Example |
|---|---|---|---|
| Primitive | Primitive – Brand A / Global | `--ds-primitive-` | `--ds-primitive-color-neutral-white` |
| Semantic | Semantic (modes) | `--ds-semantic-` | `--ds-semantic-color-background-default` |
| Component | Component (modes) | `--ds-component-` | `--ds-component-button-primary-color-background-enabled` |

Storybook imports the built CSS in `.storybook/preview.ts`, so after `npm run build:tokens`
token changes from Figma appear immediately. Every token is visualized under
**Foundations › Design Tokens** in Storybook.

## Components

React components live in `packages/harbor-storybook/src/components/`. Each one ships a
single Controls-driven story and an MDX docs page. Current: **Button**, **Select**,
**TextField**, **TextArea**.

### Stack

All four are built on [`react-aria-components`](https://react-aria.adobe.com/) — Adobe's
headless, accessibility-tested behavior primitives — instead of hand-rolled focus/keyboard
handling.

### Token coverage

**Button**, **TextField**, and **TextArea** are fully token-driven (`--ds-component-*`);
their only non-token values are `NOT-A-TOKEN`-marked demo canvas widths. **Select**'s
field and trigger are token-driven, but its dropdown surface (popover, list box, options)
still uses clearly-marked `PLACEHOLDER` values (see `Select.css`), because Figma has no
tokens for that surface yet. The shared focus ring (`--ds-semantic-focus-ring-*`) is
token-driven everywhere, since it doesn't depend on any per-component token.

### CI audit

[`scripts/audit-tokens.mjs`](./scripts/audit-tokens.mjs) (`npm run audit:tokens`, gated on
every pull request by `.github/workflows/lint.yml`) fails the build on any hardcoded color
or dimension in component CSS that isn't a `PLACEHOLDER`-marked exception.

### Accessibility

Each component's MDX docs page covers keyboard behavior, screen reader announcements, and
(for Button) a WCAG 2.2 contrast/target-size audit against its actual rendered token
values. Storybook's `@storybook/addon-a11y` runs the same kind of check live, per control
state, in every story's Accessibility panel.

## Documentation for LLMs

Storybook renders its docs pages with JavaScript, so a language model or crawler that
fetches the published site receives a script shell instead of the text. To make the
component documentation readable, a build step derives plain Markdown from each MDX docs
page and publishes it as static files.

The build produces three outputs in `docs/`:

| File | Purpose |
|---|---|
| `llms.txt` | Index of components, following the [llmstxt.org](https://llmstxt.org) convention |
| `llms-full.txt` | Every component doc concatenated into one file for single-shot context |
| `components/<name>.md` | One Markdown file per MDX doc page (components and hand-written `src/foundations` pages alike) |

The GitHub Pages workflow publishes these at the site root, so each file is reachable as
raw text:

- `https://marcinkwiatkowski605.github.io/Harbor-Design-System/llms.txt`
- `https://marcinkwiatkowski605.github.io/Harbor-Design-System/llms-full.txt`
- `https://marcinkwiatkowski605.github.io/Harbor-Design-System/components/button.md`

The MDX docs pages are the source of truth. `npm run build:llms` runs
`scripts/build-llms-docs.mjs`, which converts every `.mdx` under `src/` to plain Markdown:
top-of-file `import`/`<Meta>`/`<Controls>` are dropped, `<Primary>` becomes a one-line
note pointing at Storybook, and local JSX helpers (component definitions, `<style>`
blocks, layout-only wrapper `<div>`s) are stripped as implementation detail rather than
leaking into the output. A component that renders JSX for a live visual comparison
(Button's Do/Don't examples) is converted to a plain `**Do:** ... — **Don't:** ...` line
instead of raw markup. Code fences are left untouched, so an `import` line inside a code
example survives even though a real MDX import statement above the fold does not.

The deploy workflow (`.github/workflows/deploy.yml`) runs the same command and copies the
output into the published Storybook, so every push to `main` refreshes the files. Adding a
new component's or foundation page's `.mdx` adds it to all three outputs automatically.

```bash
npm run build:llms   # Regenerate docs/ after editing any component .mdx
```

## Releasing

Releases are automated with [semantic-release](https://semantic-release.gitbook.io/semantic-release/):
every push to `main` analyzes commit messages since the last release (using
[Conventional Commits](https://www.conventionalcommits.org/) — `feat:`, `fix:`,
`feat!:`/`BREAKING CHANGE:`, etc.) to compute the next version, update
[`CHANGELOG.md`](./CHANGELOG.md), publish
[`@harbords/tokens`](https://www.npmjs.com/package/@harbords/tokens) to npm,
and create a [GitHub Release](https://github.com/marcinkwiatkowski605/Harbor-Design-System/releases).
No manual version bumps or changelog edits.

```bash
npm install @harbords/tokens   # Consume the published design tokens package
```

## Governance

How Harbor is maintained — roles, the source of truth for tokens and docs, change
classification and versioning, and the CI quality gates — is documented in
[GOVERNANCE.md](./GOVERNANCE.md).

## License

[MIT](./LICENSE)
