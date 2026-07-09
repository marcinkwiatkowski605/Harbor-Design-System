# Typography

See [Token architecture](./overview.md) for how the tier system works. This page
summarizes Harbor's type styles. For the full per-token value table and current counts,
see **Foundations › Design Tokens › Tier 1 / Tier 2** in Storybook, or
`packages/harbor-tokens/light/build/json/tokens.json` directly.

## Semantic type styles

Each semantic style is a **bundle** of CSS properties, not a single value:
`font-family`, `font-size`, `font-style`, `font-weight`, `letter-spacing`, `line-height`,
`text-transform`. Naming: `--ds-semantic-typography-{style}-{property}`, e.g.
`--ds-semantic-typography-label-lg-font-weight`.

| Style | Used for (typical) |
|---|---|
| `display-default` | Hero/marketing-scale text — the single largest style |
| `heading-2xl` / `xl` / `lg` / `md` / `sm` / `xs` | Page and section headings, largest to smallest |
| `body-lg` / `md` / `sm` | Paragraph and UI copy |
| `label-lg` / `md` / `sm` | Form labels, button labels, and other short UI text (Button uses `label-lg`) |

Example — every property `label-lg` bundles:

| Property | Value |
|---|---|
| `font-family` | Helvetica |
| `font-size` | 1rem (16px) |
| `font-weight` | 700 |
| `line-height` | 1.5 |
| `letter-spacing` | 0rem |
| `font-style` | normal |
| `text-transform` | — |

## Primitive typography

The raw building blocks each semantic style resolves to: font family names, the numeric
font-size scale, font weights, the line-height scale, and letter-spacing steps. These
aren't meant to be referenced directly by components — use a semantic style instead, so
that "Button's label" stays traceable to a named role rather than a bare pixel value.
