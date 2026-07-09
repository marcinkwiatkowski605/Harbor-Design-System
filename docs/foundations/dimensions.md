# Dimensions

See [Token architecture](./overview.md) for how the tier system works. This page
summarizes Harbor's spacing, border, and shadow tokens. For the full per-token value
table and current counts, see **Foundations › Design Tokens › Tier 1 / Tier 2** in
Storybook, or `packages/harbor-tokens/light/build/json/tokens.json` directly.

## Spacing

**Primitive scale, 4px base:** `4, 8, 12, 16, 24, 32, 40, 48, 64, 80, 96, 128` (px). Steps
go up by 4px to 16px, then 8px to 48px, then 16px from there — more precision where it's
actually needed, fewer meaningless in-between options past 48px. Naming:
`--ds-primitive-spacing-{value}`.

**Semantic spacing** has three roles (`inset`, `inline`, `stack`), each with the same
sizes (`xs`, `sm`, `md`, `lg`, `xl`) mapping to a primitive step:

| Size | `xs` | `sm` | `md` | `lg` | `xl` |
|---|---|---|---|---|---|
| Primitive | 4 | 8 | 12 | 16 | 24 |

- `inset` — padding inside a container.
- `inline` — horizontal gaps between elements sitting side by side.
- `stack` — vertical gaps between elements stacked on top of each other.

Naming: `--ds-semantic-spacing-{role}-{size}`, e.g. `--ds-semantic-spacing-inset-md`.

## Border

| Tier | Radius | Width |
|---|---|---|
| Primitive | `0, 2, 4, 8, 12, 16, 24, 32, 48, 9999` (px; `9999` = fully round) | `0, 1, 2, 4, 8` (px) |
| Semantic | `sharp, sm, md, lg` | `none, sm, md, lg` |

Semantic border tokens resolve to a primitive step the same way semantic color tokens
resolve to a primitive color — e.g. `--ds-semantic-border-radius-md` currently equals
`--ds-primitive-border-radius-8`.

## Shadow

| Tier | Covers |
|---|---|
| Primitive | Individual `blur`, `spread` (including a negative value), `x`-offset, and `y`-offset values |
| Semantic | `sm` and `md` — each a full `box-shadow` shorthand (offset + blur + spread + color) composed from the primitives above |

## Focus ring / gap

Semantic only — no primitive tier, since these values only make sense as a bundle.
Harbor's focus indicator is a shared, two-layer ring used identically by Button,
TextField, Select, and TextArea:

- **`gap`** (`x`, `y`, `blur`, `spread`, `color`) — the inner layer, a white halo that
  pushes the ring away from the element's own border.
- **`ring`** (`x`, `y`, `blur`, `spread`, `color`) — the outer, visible colored ring.

Both layers are plain `box-shadow` values stacked together (`gap` painted on top of
`ring`) — see [Token architecture](./overview.md) for why this needs two independently
tokenized layers instead of one.
