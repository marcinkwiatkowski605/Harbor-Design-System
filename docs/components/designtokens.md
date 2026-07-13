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
| 2 | `--ds-semantic-{category}-{property}-{variant}-{state}` | `--ds-semantic-color-background-brand` |
| 3 | `--ds-component-{component}-{componentVariant}-{property}-{state}` | `--ds-component-button-primary-color-background-enabled` |

Every tier starts with the global prefix `--ds`, which exists to avoid collisions with
variables from outside the token system. Segments that don't apply to a given token are
skipped rather than left blank — a token with no variant, for example, goes straight from
property to state.

### Tier 1: Primitive

Categories currently built in Harbor: `color`, `typography`, `dimension`, `border`,
`shadow`. (The model also supports `animation`, `viewport`, and `z-index` categories —
Harbor hasn't populated those yet.)

`dimension` is the shared raw-number ramp — Tier 2 gives it meaning through separate
semantic roles like `spacing` (gaps and padding) and `sizing` (icon and control
dimensions), each mapping the same primitive steps to a different purpose.

A primitive name is just the category plus the value's position in its scale:
`--ds-primitive-color-brand-lavender-500`. It carries no information about where the
color is used — that's Tier 2's job.

### Tier 2: Semantic

Anatomy: `category` → `property` → `variant` → `state`.

- **Category** — `color`, `typography`, `spacing`, `sizing`, `border`, `shadow`, or (in
  Harbor) `focus-ring`. `spacing` and `sizing` both alias the same Tier 1 `dimension`
  ramp under two different roles — `spacing` for gaps/padding, `sizing` for icon and
  control dimensions — see this same folder's **Tier 1: Primitive Tokens** and
  **Tier 2: Semantic Tokens** pages for the full value tables.
- **Property** — the surface a color applies to: `background`, `content`, `border`.
- **Variant** — the role: `brand`, `accent`, `error`, `warning`, `info`, `success`, or the
  default (unnamed) surface. `subtle` and `secondary` are their own muted/low-emphasis
  roles, not a tonal modifier of another variant.
- **State** — `hover`, `pressed` (interaction only, and only on variants that are
  actually interactive); the base state is omitted rather than named (there is no
  `-enabled` or `-default` suffix at Tier 2 — the bare variant name **is** that state).
  `disabled` is modeled as its own token (`--ds-semantic-color-background-disabled`)
  shared across every variant, rather than duplicated per variant — a disabled brand
  button and a disabled accent button read the same gray, so one token covers both
  instead of multiplying variant × state combinations.

Text (`content`) variants don't get interaction states — a label's color doesn't change
on hover, only its container does. Where a variant's color needs to sit both as text-on-its-own
and as text-drawn-on-top-of-that-variant's-background, the second case gets an `on-` prefix
(`content-brand` vs. `content-on-brand`) rather than a new segment.

`pressed` is the only interaction-state word at Tier 2 — it used to be called `selected`
(Button's mousedown state), but that collided with a different, unrelated meaning: at
Tier 3, form fields use `selected` for "a value has been chosen" (Select's
`content-selected`, as opposed to `content-placeholder`), which is a content state, not
an interaction state. Renaming Tier 2's interaction state to `pressed` keeps the two
meanings from sharing a word.

### Tier 3: Component

Anatomy: `component` → `componentVariant` → `property` → `state`.

- **Component** — the component name, dashed for multi-word (`text-input`).
- **Component variant** — only the values that component's API actually exposes
  (Button: `primary`, `secondary`, `outline`).
- **Property** — `color-background`, `color-content`, `color-border`, or any other CSS
  property the component needs to override (`padding`, `height`, `border-radius`).
- **State** — `enabled`, `hover`, `pressed`, `disabled`. Tier 3 states are named
  explicitly (including `enabled`) because a component variant's base value can collide
  with its own nested states in the token tree otherwise. Only add a state that doesn't
  exist at Tier 2 when it needs its own color values. If a state renders identically to
  an existing one — Button's `focus`, for example, reuses the `enabled` fill and only adds
  the shared focus ring — handle it in CSS without a dedicated token.

Form fields (TextField, TextArea, Select) extend this state vocabulary further, since
they have two independent axes that Button doesn't:

- **Validity** — `error` (plus the compound `error-hover` / `error-pressed`, since an
  invalid field can still be hovered or pressed). Modeled as a state, not a Tier 2-style
  variant, because a form field's only non-default color axis is whether it's valid —
  unlike Button, which has no such concept.
- **Content** — `filled` / `placeholder` (TextField, TextArea: does the field have a
  typed value, or is it showing placeholder text?) and `selected` / `placeholder`
  (Select: has an option been chosen, or is the trigger showing its placeholder?). These
  describe what the field currently displays, not a user interaction — they can combine
  with `disabled` but not with `hover`/`pressed`/`error`, which sit on a separate part of
  the component (the border/background) from the content color they don't affect.

## One value, three tiers

The same purple traces through all three tiers when a component uses it as-is:

| Tier | Token | Value |
|------|-------|-------|
| 1 — Primitive | `--ds-primitive-color-brand-lavender-600` | `#9050E9` |
| 2 — Semantic | `--ds-semantic-color-background-brand` | `#9050E9` |
| 3 — Component | `--ds-component-button-primary-color-background-enabled` | `#9050E9` |

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
