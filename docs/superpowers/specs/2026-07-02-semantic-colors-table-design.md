# Semantic Colors Table — Design

Branch: `docs/semantic-colors-table`

## Goal

Replace the swatch-grid rendering of semantic color tokens in Storybook (Foundations →
Design Tokens → Tier 2: Semantic Tokens → `Color` story) with a table, in the format
requested by the user (inspired by a reference screenshot): **Swatch | CSS Variable |
Value | Use Case**. No "JS Variable" column. `Value` shows the resolved hex, not the raw
CSS `var()` reference. Every one of the 62 semantic color tokens gets a one-line Use Case
description.

## Scope

**In scope:**
- The `Color` export in `packages/harbor-storybook/.storybook/components/tier-2-tokens/tier-2-tokens.stories.tsx`.
- All 62 existing semantic color tokens across the 4 existing role groups: `background` (21),
  `border` (11), `content` (15), `icon` (15).
- A reusable in-file table-rendering component (`ColorTable`), replacing the current
  `ColorSwatch` grid component for this story only.
- Reading hex values from `packages/harbor-tokens/light/build/json/tokens.json` via a
  relative JSON import (new pattern for this repo, not yet used, but supported by
  `tsconfig.json`'s `resolveJsonModule: true` and Vite's native JSON support).

**Out of scope:**
- Tier 1 (primitive) and Tier 3 (component) token stories — untouched.
- Any token whose name isn't already in the `colorGroups` data (no new tokens invented —
  the screenshot's `accent-ai` / `accent-contrast` do not exist in this design system and
  are not being added).
- `docs/foundations/color.md` (separate, hand-authored foundations doc — not part of this
  change).
- Typography / Border & Shadow stories in the same file — untouched.

## Data flow

1. Import the token build output as JSON:
   ```ts
   import tokensJson from '../../../../harbor-tokens/light/build/json/tokens.json';
   ```
   (Path verified: file lives at
   `packages/harbor-storybook/.storybook/components/tier-2-tokens/tier-2-tokens.stories.tsx`;
   four `../` reaches `packages/`, matching the existing relative-import precedent in
   `packages/harbor-storybook/.storybook/preview.ts`, which does
   `import '../../harbor-tokens/light/build/css/tokens.css'` from one directory level up.)
2. Cast to `Record<string, string>` for dynamic key lookup (the generated JSON-module type
   is a large literal object; we index it as `` `ds-semantic-color-${role}-${key}` ``, a
   string built at runtime, so the literal type doesn't help and an explicit index type is
   needed).
3. Swatch color chips still render via `var(--ds-semantic-color-*)` (live CSS, always
   matches what's actually shipped). The `Value` column text comes from the JSON lookup —
   single source of truth, no hand-typed hex, satisfies the existing instruction already
   left in `docs/foundations/color.md` ("Values from build/json/tokens.json — never
   hand-write hex values").
4. If a lookup misses (token renamed/removed upstream), throw at module-eval time rather
   than silently rendering a blank cell — a broken build is a better signal than a silently
   wrong doc.

## Component structure

Extend the existing `ColorGroup` type from `contexts: string[]` to carry a use-case string
per token:

```ts
type ColorContext = { key: string; useCase: string };
type ColorGroup = { role: string; contexts: ColorContext[] };
```

Replace `ColorSwatch` (grid cell) with `ColorTableRow` (table row: swatch chip + CSS
variable + hex value + use case), rendered inside a semantic `<table>` with `<th>` column
headers (per `tech-writing-accessibility.md`: "Table structure: always use column headers;
avoid tables for layout"). One `<table>` per role, under its existing `Section` heading —
this keeps the current page structure (4 sections: background / border / content / icon)
and only changes what's rendered inside each section.

## Visual style

Modeled on the reference screenshot, adapted to the DS's existing Storybook doc styling
(system-ui sans-serif, small font sizes, muted grays already used in this file):

- **Swatch**: small rounded color chip (~64×32px), 1px subtle border — same visual as
  today's `ColorSwatch`, just placed in a table cell instead of a grid cell.
- **CSS Variable**: monospace, on a light-blue pill background (`#eef4ff` bg / `#1a56db`
  text), matching the screenshot's blue code styling.
- **Value**: monospace hex string, plain text (no pill), e.g. `#FFFFFF`.
- **Use Case**: regular sentence-case text, no monospace.

## Use Case copy

Style: short phrases (not full sentences), inspired by the Carbon Design System's "Role"
column convention (carbondesignsystem.com/elements/color/tokens) — e.g. their
`$support-error` → "Error; Invalid state", `$background-hover` → "Hover color for
$background". Applied to Harbor's own token names (original wording, not copied):
state-variant tokens (hover/pressed) read "Hover/Pressed color for `<base-token>`";
status tokens read "<Text> communicating a(n) <state>"; "on-*" tokens read "<Text/Icons>
on `<surface-token>` surfaces".

### Background (21)

| Context | CSS Variable | Value | Use Case |
|---|---|---|---|
| default | `--ds-semantic-color-background-default` | `#FFFFFF` | Default background for pages, cards, and containers |
| hover | `--ds-semantic-color-background-hover` | `#F2F4F5` | Hover color for `background-default` |
| pressed | `--ds-semantic-color-background-pressed` | `#E3E7E9` | Pressed color for `background-default` |
| disabled | `--ds-semantic-color-background-disabled` | `#CFD5DA` | Background for disabled controls and containers |
| subtle | `--ds-semantic-color-background-subtle` | `#FAFAFA` | Recessed, low-emphasis background |
| accent-default | `--ds-semantic-color-background-accent-default` | `#F36700` | Background for accent-emphasis elements |
| accent-hover | `--ds-semantic-color-background-accent-hover` | `#C75300` | Hover color for `background-accent-default` |
| accent-pressed | `--ds-semantic-color-background-accent-pressed` | `#A14200` | Pressed color for `background-accent-default` |
| accent-subtle | `--ds-semantic-color-background-accent-subtle` | `#FFF0E9` | Low-emphasis background for accent elements |
| brand-default | `--ds-semantic-color-background-brand-default` | `#9B7FFF` | Background for primary, brand-emphasis controls |
| brand-hover | `--ds-semantic-color-background-brand-hover` | `#834DFF` | Hover color for `background-brand-default` |
| brand-pressed | `--ds-semantic-color-background-brand-pressed` | `#6C31DB` | Pressed color for `background-brand-default` |
| brand-subtle | `--ds-semantic-color-background-brand-subtle` | `#F3F2FF` | Low-emphasis background for brand elements |
| support-error-strong | `--ds-semantic-color-background-support-error-strong` | `#B02A2D` | High-emphasis background for error or destructive states |
| support-error-subtle | `--ds-semantic-color-background-support-error-subtle` | `#FFF8F8` | Low-emphasis background for error or destructive states |
| support-info-strong | `--ds-semantic-color-background-support-info-strong` | `#006C97` | High-emphasis background for informational content |
| support-info-subtle | `--ds-semantic-color-background-support-info-subtle` | `#F5FBFF` | Low-emphasis background for informational content |
| support-success-strong | `--ds-semantic-color-background-support-success-strong` | `#00791E` | High-emphasis background for success states |
| support-success-subtle | `--ds-semantic-color-background-support-success-subtle` | `#F6FCF6` | Low-emphasis background for success states |
| support-warning-strong | `--ds-semantic-color-background-support-warning-strong` | `#825B00` | High-emphasis background for warnings |
| support-warning-subtle | `--ds-semantic-color-background-support-warning-subtle` | `#FDFAF4` | Low-emphasis background for warnings |

### Border (11)

| Context | CSS Variable | Value | Use Case |
|---|---|---|---|
| default | `--ds-semantic-color-border-default` | `#B0B9BF` | Default border for containers and controls |
| hover | `--ds-semantic-color-border-hover` | `#909AA1` | Hover color for `border-default` |
| pressed | `--ds-semantic-color-border-pressed` | `#747D84` | Pressed color for `border-default` |
| disabled | `--ds-semantic-color-border-disabled` | `#CFD5DA` | Border for disabled controls |
| accent | `--ds-semantic-color-border-accent` | `#F36700` | Border for accent-emphasis elements |
| brand | `--ds-semantic-color-border-brand` | `#9B7FFF` | Border for brand-emphasis or selected controls |
| error | `--ds-semantic-color-border-error` | `#FC5855` | Border communicating an error or destructive state |
| info | `--ds-semantic-color-border-info` | `#00A5E4` | Border communicating informational content |
| success | `--ds-semantic-color-border-success` | `#26B63D` | Border communicating a success state |
| warning | `--ds-semantic-color-border-warning` | `#C58D00` | Border communicating a warning |
| focus | `--ds-semantic-color-border-focus` | `#00A5E4` | Visible focus indicator |

### Content (15)

| Context | CSS Variable | Value | Use Case |
|---|---|---|---|
| default | `--ds-semantic-color-content-default` | `#484E53` | Default text color for body copy and labels |
| hover | `--ds-semantic-color-content-hover` | `#1B1D1F` | Hover color for `content-default` |
| disabled | `--ds-semantic-color-content-disabled` | `#CFD5DA` | Text color for disabled controls and copy |
| subtle | `--ds-semantic-color-content-subtle` | `#747D84` | Secondary, low-emphasis text |
| inverse | `--ds-semantic-color-content-inverse` | `#FFFFFF` | Text on inverse (dark) backgrounds |
| accent | `--ds-semantic-color-content-accent` | `#C75300` | Text for accent-emphasis content |
| brand | `--ds-semantic-color-content-brand` | `#834DFF` | Text for brand-emphasis or primary interactive content |
| error | `--ds-semantic-color-content-error` | `#D53C3D` | Text communicating an error or destructive state |
| info | `--ds-semantic-color-content-info` | `#0086BA` | Text communicating informational content |
| success | `--ds-semantic-color-content-success` | `#009627` | Text communicating a success state |
| warning | `--ds-semantic-color-content-warning` | `#A17200` | Text communicating a warning |
| on-error-subtle | `--ds-semantic-color-content-on-error-subtle` | `#B02A2D` | Text on `background-support-error-subtle` surfaces |
| on-info-subtle | `--ds-semantic-color-content-on-info-subtle` | `#006C97` | Text on `background-support-info-subtle` surfaces |
| on-success-subtle | `--ds-semantic-color-content-on-success-subtle` | `#00791E` | Text on `background-support-success-subtle` surfaces |
| on-warning-subtle | `--ds-semantic-color-content-on-warning-subtle` | `#825B00` | Text on `background-support-warning-subtle` surfaces |

### Icon (15)

| Context | CSS Variable | Value | Use Case |
|---|---|---|---|
| default | `--ds-semantic-color-icon-default` | `#484E53` | Default icon color |
| hover | `--ds-semantic-color-icon-hover` | `#1B1D1F` | Hover color for `icon-default` |
| disabled | `--ds-semantic-color-icon-disabled` | `#CFD5DA` | Icon color for disabled controls |
| subtle | `--ds-semantic-color-icon-subtle` | `#747D84` | Secondary, low-emphasis icon color |
| inverse | `--ds-semantic-color-icon-inverse` | `#FFFFFF` | Icons on inverse (dark) backgrounds |
| accent | `--ds-semantic-color-icon-accent` | `#F36700` | Icons for accent-emphasis elements |
| brand | `--ds-semantic-color-icon-brand` | `#9B7FFF` | Icons for brand-emphasis or primary interactive elements |
| error | `--ds-semantic-color-icon-error` | `#D53C3D` | Icon communicating an error or destructive state |
| info | `--ds-semantic-color-icon-info` | `#0086BA` | Icon communicating informational content |
| success | `--ds-semantic-color-icon-success` | `#009627` | Icon communicating a success state |
| warning | `--ds-semantic-color-icon-warning` | `#A17200` | Icon communicating a warning |
| on-error | `--ds-semantic-color-icon-on-error` | `#B02A2D` | Icons on `background-support-error-subtle` surfaces |
| on-info | `--ds-semantic-color-icon-on-info` | `#006C97` | Icons on `background-support-info-subtle` surfaces |
| on-success | `--ds-semantic-color-icon-on-success` | `#00791E` | Icons on `background-support-success-subtle` surfaces |
| on-warning | `--ds-semantic-color-icon-on-warning` | `#825B00` | Icons on `background-support-warning-subtle` surfaces |

## Testing / verification

1. `npm run build:tokens` (if needed) to confirm `packages/harbor-tokens/light/build/json/tokens.json`
   is current before reading from it.
2. Type-check the storybook package (existing `tsc`/lint script) to confirm the JSON import
   and the new `ColorTable` component compile cleanly.
3. Start the Storybook dev server and open Foundations → Design Tokens → Tier 2: Semantic
   Tokens → `Color`. Verify, for all 4 sections:
   - Swatch color visually matches the `Value` hex shown next to it.
   - No `JS Variable` column present.
   - Every row has non-empty Use Case text.
   - Table has proper `<th>` column headers (accessibility).
4. Spot-check a handful of hex values in the rendered table against
   `packages/harbor-tokens/light/build/json/tokens.json` directly.

## Out of scope / explicitly not doing

- Not adding `accent-ai` / `accent-contrast` or any token not already in the design
  system — the reference screenshot was a format reference only, confirmed with the user.
- Not touching `docs/foundations/color.md`.
- Not changing the generated LLM docs pipeline (`docs/llms.txt`, `docs/components/*.md`) —
  this table lives in Storybook only, not the MDX-driven component docs pipeline.
