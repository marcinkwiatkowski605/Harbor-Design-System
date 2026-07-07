# Design Tokens

Harbor's values — colors, spacing, type, radii, shadows — live as design tokens, not
hardcoded numbers. Every token belongs to one of three tiers, and each tier has a fixed
naming pattern. This page explains that pattern: what each tier is for and how its name
is built, so a new token can be named consistently instead of invented per component.

It does not list every token value — see **Tier 1: Primitive Tokens**, **Tier 2: Semantic
Tokens**, and **Tier 3: Component Tokens** in this same folder for the full tables.

## Why three tiers

- **Tier 1 (primitive)** defines the raw values available to the system — a color ramp
  step, a spacing number, a font size. No meaning attached yet.
- **Tier 2 (semantic)** maps a Tier 1 value to a role — "the brand background color,"
  independent of any single component.
- **Tier 3 (component)** targets one component's specific need, and only exists when that
  component's value genuinely diverges from its Tier 2 role.

A token should default to Tier 2. Reach for Tier 3 only when a component can't reuse a
semantic value as-is.

## Naming pattern per tier

| Tier | Pattern | Example |
|------|---------|---------|
| 1 | `--ds-primitive-{category}-{value}` | `--ds-primitive-color-brand-lavender-500` |
| 2 | `--ds-semantic-{category}-{property}-{variant}-{emphasis}-{state}` | `--ds-semantic-color-background-brand` |
| 3 | `--ds-component-{component}-{componentVariant}-{property}-{state}` | `--ds-component-button-primary-color-background-enabled` |

Every tier starts with the global prefix `--ds`, which exists to avoid collisions with
variables from outside the token system. Segments that don't apply to a given token are
skipped rather than left blank — a token with no variant, for example, goes straight from
property to state.

### Tier 1: Primitive

Categories currently built in Harbor: `color`, `typography`, `spacing`, `border`,
`shadow`. (The model also supports `animation`, `viewport`, and `z-index` categories —
Harbor hasn't populated those yet.)

A primitive name is just the category plus the value's position in its scale:
`--ds-primitive-color-brand-lavender-500`. It carries no information about where the
color is used — that's Tier 2's job.

### Tier 2: Semantic

Anatomy: `category` → `property` → `variant` → `emphasis` → `state`.

- **Category** — `color`, `typography`, `spacing`, `border`, `shadow`, or (in Harbor)
  `focus`.
- **Property** — the surface a color applies to: `background`, `content`, `border`.
- **Variant** — the role: `brand`, `accent`, `default`, `subtle` (its own muted default
  surface — distinct from the `emphasis` value below, see note), or a support color
  (`support-error`, `support-warning`, `support-success`, `support-info`).
- **Emphasis** — the tonal weight of that role's color: `strong` or `subtle`. Omitted
  means the role's own anchor tone — `--ds-semantic-color-background-brand` carries no
  emphasis suffix because it *is* the base tone. Emphasis is a static property of the
  swatch (which shade you picked), not an interaction, so it's a separate segment from
  state rather than a value living inside either one. Note the word overlap: the
  standalone `subtle` **variant** (a muted surface, its own role) and the `-subtle`
  **emphasis** suffix on `brand-subtle` / `support-error-subtle` (a lighter tint of
  another role) share a name but occupy different segments — don't conflate them.
- **State** — `hover`, `pressed`, `focus` (interaction only, and only on variants that
  are actually interactive); `default` state can be explicit or omitted. `disabled` is
  modeled as its own token (`--ds-semantic-color-background-disabled`) shared across
  every variant, rather than duplicated per variant — a disabled brand button and a
  disabled accent button read the same gray, so one token covers both instead of
  multiplying variant × state combinations.

If emphasis and state ever apply to the same token, emphasis comes first —
`{variant}-{emphasis}-{state}` — since it's the more static of the two choices. No
token in Harbor combines them today (support colors carry emphasis but no state;
brand/accent/default carry state but no emphasis), so this is a standing rule for
future tokens, not a rename of anything that exists now.

### Tier 3: Component

Anatomy: `component` → `componentVariant` → `property` → `state`.

- **Component** — the component name, dashed for multi-word (`text-input`).
- **Component variant** — only the values that component's API actually exposes
  (Button: `primary`, `secondary`, `outline`).
- **Property** — `color-background`, `color-content`, `color-border`, or any other CSS
  property the component needs to override (`padding-horizontal`, `border-radius`).
- **State** — `hover`, `pressed`, `disabled`. Only add a state that doesn't exist at
  Tier 2 when it needs its own color values. If a state renders identically to an existing
  one — Button's `focus`, for example, reuses the `enabled` fill and only adds the shared
  focus ring — handle it in CSS without a dedicated token. Only add a Tier 3 `disabled`
  value when a component's disabled look genuinely differs from the shared Tier 2 disabled
  token — most components should just reference the Tier 2 one.

## One value, three tiers

The same purple traces through all three tiers when a component uses it as-is:

| Tier | Token | Value |
|------|-------|-------|
| 1 — Primitive | `--ds-primitive-color-brand-lavender-500` | `#9B7FFF` |
| 2 — Semantic | `--ds-semantic-color-background-brand` | `#9B7FFF` |
| 3 — Component | `--ds-component-button-primary-color-background-enabled` | `#9B7FFF` |

Tier 3 only needed to exist here because Button's enabled state has its own token slot to
fill — its value still traces back to the same Tier 2 role.

## Choosing a tier for a new token

1. Does this value need to exist independent of any UI role (a raw color, a spacing
   number)? → Tier 1.
2. Does it express a role or intention shared across components (a background color for
   "brand," a state color for "error")? → Tier 2. Default here.
3. Does a specific component need a value that genuinely diverges from its Tier 2 role? →
   Tier 3, scoped to that component only.

Skipping a check and going straight to Tier 3 is the most common way naming drifts —
check Tier 2 first.
