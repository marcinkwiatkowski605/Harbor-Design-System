# Governance

This document describes how the Harbor Design System is maintained: who decides
what changes, where each artifact's source of truth lives, how a change becomes a
release, and which automated gates a change must pass. It reflects how the project
works today — not an aspirational team process.

**This document covers:** roles and decision-making, the source of truth for
tokens and docs, token architecture rules, change classification and versioning,
the quality gates in CI, component readiness, the documentation pipeline, the
contribution workflow, and distribution.

**This document does not cover:** how to *use* the components or tokens (see the
[README](./README.md) and the [Storybook site](https://marcinkwiatkowski605.github.io/Harbor-Design-System/)),
or the token values themselves (see `design_tokens.json` and the Storybook
Foundations pages).

**Assumed knowledge:** Git, npm workspaces, Conventional Commits, and basic
design-token concepts.

## Roles and decision-making

Harbor is a single-maintainer portfolio project — a case study that demonstrates
design-token architecture and the design-to-code workflow, not a product with
external consumers or a contributor community. Marcin Kwiatkowski owns the Figma
source, the codebase, and every release decision. The project has no committee, no
voting, and no RFC process, because one person maintains it.

Most day-to-day governance is therefore **encoded in automation rather than in
meetings**. The rules below — the token source-of-truth chain, the commit-message
version policy, and the CI audit — decide what a valid change looks like without
requiring a human gatekeeper. A contributor (including the maintainer) cannot merge
a change that a bot would reject, regardless of intent. The maintainer's judgment
governs everything the automation does not: design intent, token architecture, and
what ships next.

Contributor-facing conventions the maintainer follows are recorded in `CLAUDE.md`
and in `local_docs/` (both intentionally untracked). This file records the parts of
that process that affect a *consumer* of the published packages.

## Source of truth

Each artifact has exactly one source of truth. Editing anywhere else is either
overwritten by a build step or rejected in review.

| Artifact | Source of truth | Downstream (generated — do not edit) |
|---|---|---|
| Design tokens | Figma file **HRDS**, exported to `design_tokens.json` (W3C DTCG) | `packages/harbor-tokens/light/build/` (CSS / JSON / JS) |
| Component docs | `packages/harbor-storybook/src/**/*.mdx` | `docs/components/*.md`, `docs/llms.txt`, `docs/llms-full.txt` |
| Foundations docs | `docs/foundations/*.md` (hand-authored — a deliberate exception) | — |

Three rules follow from this table:

- **Never hand-edit `design_tokens.json`.** It is a W3C DTCG export of the Figma
  **HRDS** file. Change tokens in Figma, then re-export the file — do not edit the
  JSON directly.
- **Never invent a token name or value.** Read tokens from `design_tokens.json` or
  the build output. A component's state-to-token mapping is whatever its CSS
  actually references.
- **Never hand-edit generated docs.** Edit the MDX, then run `npm run build:llms`
  to regenerate `docs/`.

## Token architecture and naming

Tokens are organized into three tiers. A CSS variable's prefix marks its tier —
the Figma collection it comes from. Harbor ships a single light theme and does
**no theme switching**, so the prefix carries tier information rather than mode.

| Tier | Figma collection | CSS prefix | Example |
|---|---|---|---|
| Primitive | Primitive – Brand A / Global | `--ds-primitive-` | `--ds-primitive-color-neutral-white` |
| Semantic | Semantic (modes) | `--ds-semantic-` | `--ds-semantic-color-background-default` |
| Component | Component (modes) | `--ds-component-` | `--ds-component-button-primary-color-background-enabled` |

Component tokens alias semantic tokens, which alias primitives. Style Dictionary
(`packages/harbor-tokens/config.js`) resolves these aliases at build time.

## How changes are classified and versioned

`semantic-release` runs on every push to `main`. It reads the Conventional Commit
messages since the last release as plain text, computes the next version, updates
`CHANGELOG.md`, publishes `@harbords/tokens` to npm, and creates a GitHub Release.
No one bumps versions or edits the changelog by hand.

Because the commit *message* — not the diff — drives the release, classify every
change by asking: **does this alter what a consumer of the package receives**
(rendered CSS, exported token names or values, component props or behavior)?

| The change… | Commit type | Release |
|---|---|---|
| Renames or removes a published token or public component API | any type + `BREAKING CHANGE:` footer | major |
| Adds a capability (new component, variant, prop, or wires a placeholder to real tokens) | `feat:` | minor |
| Fixes incorrect behavior (wrong CSS state, broken validation, an a11y bug, a wrong token reference) | `fix:` | patch |
| Changes docs, tests, tooling, or internal structure only | `docs:` / `test:` / `chore:` / `refactor:` | none |

Two rules the automation enforces:

- **A one-line token rename is a breaking change,** even though the diff looks
  small. It changes the published `@harbords/tokens` contract.
- **Mark breaking changes with a `BREAKING CHANGE:` footer, never with a `!` in the
  header.** The Angular preset's header pattern does not match `feat!:`, so a bang
  drops the commit from the changelog's grouped sections. The footer bumps the
  major version independently of the header.

## Quality gates

Three automated checks defend the published artifacts. The first blocks merges;
the others report but do not yet block.

- **Token audit (blocking).** `npm run audit:tokens` runs on every pull request
  (`.github/workflows/lint.yml`). It fails the build on any hardcoded color or
  dimension in component CSS that is not a `PLACEHOLDER`-marked exception. This gate
  is what keeps components token-driven rather than drifting to literal values.
- **Storybook smoke test (non-blocking).** The deploy workflow renders every story
  through `@storybook/test-runner`. A failure surfaces in the run log but does not
  stop the GitHub Pages deploy — a deliberate choice while the suite earns trust.
- **Accessibility.** All four components build on
  [`react-aria-components`](https://react-aria.adobe.com/) for tested keyboard and
  screen-reader behavior. `@storybook/addon-a11y` runs a live per-state check in
  every story's Accessibility panel, and Button carries a documented WCAG 2.2
  contrast and target-size audit against its real rendered token values.

## Component readiness

A component is token-driven once real `--ds-component-*` tokens back every value that
carries a design decision. The maintainer wires a component to tokens only after its
Figma spec exists, so readiness tracks the Figma work rather than the React code.

- **Fully token-driven** — **Button**, **TextField**, and **TextArea**. Every color,
  dimension, and state maps to a `--ds-component-*` token. The only non-token values
  are `NOT-A-TOKEN`-marked demo canvas widths, which are not design decisions.
- **Partially token-driven** — **Select**. Its trigger and field are fully tokenized,
  but the dropdown surface (popover, list box, and options) still uses clearly marked
  `PLACEHOLDER` values, because Figma has no component tokens for that surface yet.

Button carries an additional layer the others do not: it is design-verified against
Figma and documented with a WCAG 2.2 contrast and target-size audit.

The shared focus ring (`--ds-semantic-focus-ring-*`) is token-driven on every
component, because it depends on no per-component token.

## Documentation pipeline

Component documentation is governed the same way as tokens: one source, generated
outputs. The MDX docs page for each component
(`packages/harbor-storybook/src/components/<Name>/<Name>.mdx`) is canonical.
`npm run build:llms` derives three LLM-readable outputs from every `.mdx` under
`src/`:

| Output | Purpose |
|---|---|
| `docs/llms.txt` | Component index, following the [llmstxt.org](https://llmstxt.org) convention |
| `docs/llms-full.txt` | Every doc concatenated for single-shot context |
| `docs/components/<name>.md` | One Markdown file per MDX page |

The deploy workflow runs the same command and copies the output into the published
Storybook, so every push to `main` refreshes these files. Storybook renders its
pages with JavaScript, so these static files exist to give crawlers and language
models the text the rendered pages hide.

## Contribution workflow

Changes reach `main` through a branch and a pull request, as PRs #1 and #2 show.

1. Branch from `main`.
2. Make the change at its source: for tokens, edit the Figma **HRDS** file and
   re-export `design_tokens.json`; for docs, edit the MDX.
3. Run the relevant commands locally before opening the PR:

   ```bash
   npm install             # Install workspace dependencies
   npm run build:tokens    # Rebuild CSS / JSON / JS from design_tokens.json
   npm start               # Preview Storybook at http://localhost:6006
   npm run build:llms      # Regenerate docs/ after editing any .mdx
   npm run audit:tokens    # Fail on any unmarked hardcoded value (the PR gate)
   ```

4. Write the commit message as a Conventional Commit, classified by the table above.
5. Open a pull request. The token audit runs automatically.
6. Merge to `main`. `semantic-release` and the deploy workflow handle versioning,
   publishing, and the site — no manual release steps.

## Release and distribution

Harbor publishes to three places, each fed automatically from `main`:

- **npm** — `@harbords/tokens`, the built design tokens, published by
  `semantic-release`.
- **GitHub Pages** — the Storybook site and the `llms.txt` files, published by the
  deploy workflow.
- **GitHub Releases** — a tagged release with generated notes for every version.

The Storybook workspace is private and is not published to npm; it is deployed only
as the documentation site.

## Non-goals and known limitations

Harbor is scoped as a demonstration of design-token architecture and the
design-to-code workflow. It deliberately does not do the following:

- **No theming or dark mode.** The system ships one light theme. The tier prefixes
  encode provenance, not switchable modes.
- **No multi-brand delivery.** The Figma file defines a Brand A primitive
  collection, but the build ships a single brand.
- **A small component set.** Four components exist — Button, TextField, TextArea,
  and Select. Button, TextField, and TextArea are fully token-driven; Select's
  dropdown surface still runs on placeholders until its Figma tokens land.
- **No blocking visual or interaction test suite.** The Storybook smoke test is
  non-blocking by design; there is no visual-regression gate.
- **A single-maintainer process.** There is no formal contributor onboarding, RFC
  process, or code-of-conduct enforcement, because the project has one maintainer.

## License

Harbor is released under the [MIT License](./LICENSE).
