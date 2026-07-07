# Harbor Design System

**[Live Storybook →](https://marcinkwiatkowski605.github.io/Harbor-Design-System/)**

Harbor Design System is a demonstration project that showcases my skills in
design-token architecture, tooling, and the design-to-code workflow.

The project includes:

- a Figma file that defines the design tokens and a set of components;
- an export of those tokens from Figma to a JSON file in DTCG (Design Token Community Group) format for Style Dictionary;
- a conversion of the Figma components into token-driven React components in Storybook;
- a Storybook that visualizes the tokens and documents the components;
- an adaptation of the component docs for large language models (LLMs), published as plain-text `llms.txt` files.

## Getting started

```bash
npm install            # Install all workspace dependencies
npm start              # Start Storybook at http://localhost:6006
npm run build:tokens   # Build design tokens (design_tokens.json → CSS / JSON / JS)
npm run build:storybook # Build the static Storybook site
npm run build:llms     # Regenerate docs/ from the component/foundations MDX
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
      components/        # React components + MDX docs — currently Button
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

Tokens live in Figma (file **HRDS**) and are exported to `design_tokens.json` in W3C
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

React components live in `packages/harbor-storybook/src/components/`. Each one is
token-driven (no hardcoded colors or sizes), ships a single Controls-driven story, and an
MDX docs page. Current: **Button**.

Each component's MDX docs page includes an accessibility section covering keyboard
behavior, screen reader announcements, and a WCAG 2.2 contrast/target-size audit against
its actual rendered token values — not just a compliance claim. Storybook's
`@storybook/addon-a11y` runs the same kind of check live, per control state, in every
story's Accessibility panel.

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

## License

[MIT](./LICENSE)
