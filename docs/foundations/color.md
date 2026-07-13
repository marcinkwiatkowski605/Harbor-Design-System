# Color

Every color in Harbor resolves to a token — see [Token architecture](./overview.md) for
how the tier system works. This page summarizes what exists at Tier 1 (primitive) and
Tier 2 (semantic). For exact per-token values and current counts, see **Foundations ›
Design Tokens › Tier 1 / Tier 2** in Storybook, or
`packages/harbor-tokens/light/build/json/tokens.json` directly — those stay
authoritative as the palette evolves, rather than duplicated here. Never hand-write a
hex value in component CSS — reference the token.

## Primitive palette

Raw color values, organized into ramps. No meaning attached to where they're used yet.

| Group | Steps |
|---|---|
| `brand-lavender` | 50–950 ramp |
| `brand-orange` | 50–950 ramp |
| `neutral` | 50–950 ramp, plus `black` and `white` |
| `utility-red` | 50–950 ramp |
| `utility-yellow` | 50–950 ramp |
| `utility-blue` | 50–950 ramp |
| `utility-green` | 50–950 ramp |
| `black-alpha` | a small number of opacity steps |

Naming: `--ds-primitive-color-{group}-{step}`, e.g. `--ds-primitive-color-brand-lavender-600`.

Brand and utility ramps were rebuilt with gamut-correct OKLCH chroma reduction (holds hue
while darkening) specifically so every step clears WCAG AA contrast against both black
and white text at the steps components actually use — see the Button color reference in
Storybook for a worked example.

## Semantic color roles

Tier 1 values mapped to an intended use, independent of any one component. Naming:
`--ds-semantic-color-{property}-{variant}-{state}` (see [Token architecture](./overview.md#tier-2-semantic)
for the full anatomy).

| Property | Covers |
|---|---|
| `background` | default/subtle/hover/pressed/disabled + `brand`, `accent`, `error`, `warning`, `info`, `success` variants (each with their own `hover`/`pressed`) |
| `border` | default/hover/pressed/disabled/`focus` + `brand`, `accent`, `error`, `warning`, `info`, `success` |
| `content` | default/secondary/disabled + `brand`, `accent`, `error`, `warning`, `info`, `success`, and their `on-*` counterparts (text/icon color drawn *on top of* that variant's background) |

A few naming notes worth remembering when picking a token:

- There's no `-enabled` or `-default` suffix — the bare variant name (`background-brand`)
  **is** the enabled state. Only interactive states (`hover`, `pressed`) get a suffix.
- `disabled` is one token per property (`background-disabled`, `content-disabled`),
  shared across every variant — not duplicated per variant.
- `content` is a single merged category for both text and icon color — there's no
  separate `icon-*` token family; a label and an icon in the same context use the same
  `content-*` token.
