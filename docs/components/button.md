# Button

Buttons let people take an action, confirm a choice, or move forward in a flow.
They're the primary way of triggering something to happen on screen.

> _Live, interactive example — see this component in Storybook._

## Anatomy

A button has two parts: a **container** (background, border, corner radius, focus
ring) and a **label** (one line of centered text). There's no icon slot and no size
property yet — every button renders at a fixed 48px height, with 24px horizontal
padding and an 8px corner radius.

## Types

`variant` sets visual weight, not just color.

- **Primary** — highest emphasis. Reserve for the one action that matters most in a
  given context: submitting a form, confirming a purchase, completing a step. Solid fill.
- **Secondary** — medium emphasis. For actions that matter but shouldn't outrank the
  primary one, like "Add another" next to "Save."
- **Outline** — lowest emphasis. For optional or reversible actions like "Cancel" or
  "Back," or when several actions sit side by side and none should dominate.

Rule of thumb: one Primary button per view. If two actions feel equally important, the
flow needs rethinking before the button hierarchy does.

## States

All three types share the same five states: Enabled, Hover, Selected, Focus, Disabled.

- **Hover / Selected** darken the fill (or border, for Outline) to confirm interactivity.
  Outline gives Hover and Selected two distinct border shades, so the states read differently
  instead of looking identical.
- **Focus** adds a two-layer ring — a white gap plus a colored outer ring — shared across all
  three types via one token pair, so focus looks the same regardless of button type.
- **Disabled** flattens background and text to neutral gray on every type, including
  Outline — background, border, and label all drop to their disabled tokens.

In code, Hover/Selected/Focus are driven by the `data-hovered` / `data-pressed` /
`data-focus-visible` attributes `react-aria-components`' `Button` exposes, and
Disabled by `data-disabled` (set via the `isDisabled` prop).

## Color reference

Resolved value **and the token assigned to it** for every type and state. Values come
from the built component tokens; the state→token mapping is what `Button.css` actually
references. Token names below drop the per-variant prefix shown above each table.

**Focus** has no fill token of its own — it keeps the Enabled background/content and
adds the shared ring (`--ds-semantic-focus-ring-ring-*` / `--ds-semantic-focus-ring-gap-*`).

**Primary** — prefix `--ds-component-button-primary-color-`.

| State    | Background                       | Content                       |
|----------|-----------------------------------|-------------------------------|
| Enabled  | `#9050E9` · `background-enabled`  | `#FFFFFF` · `content-enabled`  |
| Hover    | `#7526E3` · `background-hover`    | `#FFFFFF` · `content-hover`    |
| Selected | `#5A1BA9` · `background-selected` | `#FFFFFF` · `content-selected` |
| Focus    | `#9050E9` · `background-enabled`  | `#FFFFFF` · `content-enabled`  |
| Disabled | `#CFD5DA` · `background-disabled` | `#909AA1` · `content-disabled` |

**Secondary** — prefix `--ds-component-button-secondary-color-`.

| State    | Background                        | Content                        |
|----------|------------------------------------|--------------------------------|
| Enabled  | `#D83A00` · `background-enabled`   | `#FFFFFF` · `content-enabled`   |
| Hover    | `#AA3001` · `background-hover`     | `#FFFFFF` · `content-hover`     |
| Selected | `#7E2600` · `background-selected`  | `#FFFFFF` · `content-selected`  |
| Focus    | `#D83A00` · `background-enabled`   | `#FFFFFF` · `content-enabled`   |
| Disabled | `#CFD5DA` · `background-disabled`  | `#909AA1` · `content-disabled` |

**Outline** — prefix `--ds-component-button-outline-color-`. White background, visible border in every state.

| State    | Background                        | Content                        | Border                        |
|----------|------------------------------------|---------------------------------|--------------------------------|
| Enabled  | `#FFFFFF` · `background-enabled`   | `#484E53` · `content-enabled`   | `#909AA1` · `border-enabled`   |
| Hover    | `#F2F4F5` · `background-hover`     | `#484E53` · `content-hover`     | `#747D84` · `border-hover`     |
| Selected | `#E3E7E9` · `background-selected`  | `#484E53` · `content-selected`  | `#5D646A` · `border-selected`  |
| Focus    | `#FFFFFF` · `background-enabled`   | `#484E53` · `content-enabled`   | `#909AA1` · `border-enabled`   |
| Disabled | `#CFD5DA` · `background-disabled`  | `#909AA1` · `content-disabled` | `#B0B9BF` · `border-disabled`  |

## Specs

| Property        | Value | Token |
|-----------------|-------|-------|
| Height               | 48px | `--ds-component-button-height` |
| Padding (horizontal) | 24px | `--ds-component-button-padding` |
| Corner radius        | 8px  | `--ds-component-button-border-radius` |
| Border width         | 1px  | `--ds-component-button-border-width` |

**Typography** — semantic tier `label/lg`.

| Property       | Value      | Token |
|----------------|------------|-------|
| Font family    | Helvetica  | `--ds-semantic-typography-label-lg-font-family` |
| Font weight    | Bold (700) | `--ds-semantic-typography-label-lg-font-weight` |
| Font size      | 16px       | `--ds-semantic-typography-label-lg-font-size` |
| Line height    | 24px       | `--ds-semantic-typography-label-lg-line-height` |
| Letter spacing | 0          | `--ds-semantic-typography-label-lg-letter-spacing` |

## Usage guidelines

Choose type by hierarchy, not by which one looks better in the moment. One Primary
button per view — pair it with Outline or Secondary for the rest, not a second Primary.

**Do:** Save, Cancel — **Don't:** Save, Cancel

Keep labels short and verb-led — a busy reader should know what happens before they
finish reading the label.

**Do:** Save changes — **Don't:** Changes will be saved

Outline needs a visible border in every state, including Disabled — don't let it
disappear just because the background is already white. (Harbor's Outline always renders
a border by default; this matters if you're overriding its styles.)

### Code example

```tsx
// Primary action
<Button variant="primary" onClick={handleSubmit}>Save changes</Button>

// Secondary and outline side by side
<Button variant="secondary">Add another</Button>
<Button variant="outline">Cancel</Button>
```

## Component API

```tsx
import { Button } from './components/Button';
```

| Prop       | Type                                        | Default     | Description |
|------------|---------------------------------------------|-------------|-------------|
| `variant`  | `'primary' \| 'secondary' \| 'outline'`     | `'primary'` | Visual style. Maps to the Figma `Type` axis. |
| `disabled` | `boolean`                                   | `false`     | Mapped internally to `react-aria-components`' `isDisabled`. Removes the button from interaction and the tab order. |
| `children` | `React.ReactNode`                           | —           | Button label. One line of centered text. **Required.** |
| `...rest`  | `React.ButtonHTMLAttributes<HTMLButtonElement>` | —       | All native button attributes (`onClick`, `type`, `aria-*`, …) forward to the underlying `react-aria-components` `Button` — `onClick` works as an alias for its `onPress`. |

## Accessibility

Button is built on `react-aria-components`' `Button` primitive, which renders a
native `<button>` element under the hood and layers on Adobe's tested ARIA/keyboard
behavior — no custom ARIA role is needed.

**Keyboard**

| Key | Action |
|-----|--------|
| Tab | Moves focus to the button. Skips it if `disabled`. |
| Shift+Tab | Moves focus away from the button. |
| Enter / Space | Activates a focused button. |

`disabled` uses the native attribute, so the button drops out of the tab order entirely.
Disabled buttons stay in the layout so people know the action exists, just not right now.

**Screen readers**

- The label read aloud comes from `children` — pass descriptive text, not an icon alone.
- `disabled` uses the native attribute, so screen readers announce the button as
  unavailable.

**Color contrast**

Checked against WCAG 2.2: 4.5:1 for text, 3:1 for large text and non-text UI components
(borders, focus indicators). Most label and border combinations pass.

For current, live ratios on any state, check the **Accessibility** panel in the
**Default** story's Controls tab — it recomputes contrast from the actual rendered
colors, so it can't go stale the way a hand-written table can.

**Target size**

WCAG 2.2 adds Target Size (Minimum) (2.5.8, AA): interactive targets need to be at least
24×24 CSS pixels. Button's height is a fixed 48px (the `height` token) regardless of
variant or label length, well above the minimum. Width only grows with the label, so it
never drops below the horizontal padding (24px × 2) alone.

**Focus indicator**

The focus ring is mandatory and shared across all three types — restyle it, don't
suppress it. WCAG 2.2 adds Focus Not Obscured (Minimum) (2.4.11, AA): don't let a sticky
header, footer, or overlay cover a focused button's ring.
