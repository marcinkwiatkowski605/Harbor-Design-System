# Harbor Design System

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
npm install          # Install all workspace dependencies
npm start            # Start Storybook at http://localhost:6006
npm run build:tokens # Build design tokens (design_tokens.json → CSS / JSON / JS)
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
    src/components/      # React components + MDX docs — currently Button
scripts/
  build-llms-docs.mjs    # Derives the LLM docs from the component MDX
docs/                    # Generated LLM docs (llms.txt, llms-full.txt, components/*.md)
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
| `components/<name>.md` | One Markdown file per component |

The GitHub Pages workflow publishes these at the site root, so each file is reachable as
raw text:

- `https://marcinkwiatkowski605.github.io/Harbor-Design-System/llms.txt`
- `https://marcinkwiatkowski605.github.io/Harbor-Design-System/llms-full.txt`
- `https://marcinkwiatkowski605.github.io/Harbor-Design-System/components/button.md`

The MDX docs pages are the source of truth. `npm run build:llms` runs
`scripts/build-llms-docs.mjs`, which strips MDX-only syntax (`import` statements, `<Meta>`,
`<Controls>`, `<Primary>`) and writes the Markdown files plus `llms.txt` and `llms-full.txt`
into `docs/`. The deploy workflow (`.github/workflows/deploy.yml`) runs the same command and
copies the output into the published Storybook, so every push to `main` refreshes the files.
Adding a new component's `.mdx` adds it to all three outputs automatically.

```bash
npm run build:llms   # Regenerate docs/ after editing any component .mdx
```
