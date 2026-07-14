# Select

A select lets people choose one option from a list, without taking up the space
a fully expanded set of choices (like radio buttons) would need.

> **Note:** built the same way as TextField — on
> [`react-aria-components`](https://react-aria.adobe.com/)' `Select` primitive,
> using its explicit anatomy (`Label` + `Button` + `SelectValue` + `Popover` +
> `ListBox`/`ListBoxItem`) instead of the compact all-in-one API, for full control
> over styling each part, so this exposes React Aria's single-selection surface
> rather than a Harbor-specific subset. The trigger's colors and sizes are real
> component tokens, synced from Figma. The Popover/ListBox/option colors below
> the trigger are still **placeholder values** — Figma's token work so far only
> covers the trigger and the shared Field-label/Helper-text/Error-text blocks.

> _Live, interactive example — see this component in Storybook._

## Anatomy

Select composes six parts, each a separate `react-aria-components` primitive:

```tsx
<Select items={items}>
  <Label>{label}</Label>
  <Button>
    <SelectValue />
    <ChevronDownIcon aria-hidden="true" />
  </Button>
  <Text slot="description"><InfoCircleFilledIcon />{description}</Text>
  <FieldError><AlertTriangleFilledIcon />{errorMessage}</FieldError>
  <Popover>
    <ListBox items={items}>
      {(item) => <ListBoxItem id={item.id}>{item.label}</ListBoxItem>}
    </ListBox>
  </Popover>
</Select>
```

- **Label** — describes what's being chosen. Always visible, sits above the trigger.
- **Trigger (Button + SelectValue)** — a button showing the current selection (or
  `placeholder` when nothing is chosen yet) and a chevron that flips to indicate
  open/closed. The chevron's color stays constant regardless of whether a value is
  selected or the trigger shows a placeholder — it's an affordance icon, not content,
  so it only changes for `isDisabled`.
- **Popover + ListBox** — the list of options, only mounted in the DOM while open.
- **Description** / **Error message** — same helper-text/validation pattern as
  TextField, with the same leading icon on each.

## States

- **Enabled** — default resting state.
- **Hover** — trigger border darkens (`data-hovered` on the trigger button).
- **Pressed** — trigger background/border darken further while the mouse button is
  down (`data-pressed`). Unlike TextField/TextArea's `<Input>`, RAC's `<Button>`
  natively tracks a pressed state, so this one uses the real react-aria-components
  attribute rather than a plain CSS `:active`.
- **Open** — popover is visible, chevron flips (`data-open` on the Select container).
- **Focus** — same two-layer ring as Button/TextField, on the trigger
  (`data-focus-visible`).
- **Disabled** — `isDisabled`; trigger leaves the tab order (`data-disabled`).
- **Required** — `isRequired`; adds a marker after the label (`data-required`).
- **Invalid** — `isInvalid`; trigger border and error text turn to the error color
  (`data-invalid`).

Each option in the list has its own states, independent of the trigger:
**hovered**, **focused** (keyboard), **selected**, and **disabled** (per-option,
via that option's `isDisabled`) — see `data-hovered` / `data-focus-visible` /
`data-selected` / `data-disabled` on `ListBoxItem`.

## Color reference

Trigger, label, description, and error colors below are real component tokens.
Popover/ListBox/option colors aren't in this table yet — see the note at the top
of this page.

| Token | Value | Used for |
|---|---|---|
| `--ds-component-select-color-background-default` | `#FFFFFF` | Trigger background, enabled |
| `--ds-component-select-color-background-hover` | `#F2F4F5` | Trigger background, hovered |
| `--ds-component-select-color-background-pressed` | `#FFFFFF` | Trigger background, pressed |
| `--ds-component-select-color-background-disabled` | `#CFD5DA` | Trigger background, disabled |
| `--ds-component-select-color-border-default` | `#909AA1` | Trigger border, enabled |
| `--ds-component-select-color-border-hover` | `#747D84` | Trigger border, hovered |
| `--ds-component-select-color-border-pressed` | `#5D646A` | Trigger border, pressed |
| `--ds-component-select-color-border-disabled` | `#B0B9BF` | Trigger border, disabled |
| `--ds-component-select-color-border-error` | `#FC5855` | Trigger border, invalid |
| `--ds-component-select-color-border-error-hover` | `#D53C3D` | Trigger border, invalid + hovered |
| `--ds-component-select-color-border-error-pressed` | `#B02A2D` | Trigger border, invalid + pressed |
| `--ds-component-select-color-content-selected` | `#484E53` | Selected value text |
| `--ds-component-select-color-content-placeholder` | `#B0B9BF` | Placeholder text |
| `--ds-component-select-color-content-disabled` | `#909AA1` | Value text, disabled |
| `--ds-component-select-color-icon-enabled` | `#484E53` | Chevron, enabled (constant regardless of selected/placeholder) |
| `--ds-component-select-color-icon-disabled` | `#909AA1` | Chevron, disabled |
| `--ds-component-field-label-color-content` | `#484E53` | Label text |
| `--ds-component-field-label-color-content-error` | `#D53C3D` | Required marker (`*`) |
| `--ds-component-helper-text-color-content` | `#484E53` | Description text and icon |
| `--ds-component-error-text-color-content` | `#D53C3D` | Error message text and icon |

## Specs

Trigger, gap, and icon sizing below are real component tokens. Popover max-height
and option padding aren't in this table yet — no Figma tokens exist for those yet.

| Token | Value | Used for |
|---|---|---|
| `--ds-component-select-height` | `2.5rem` (40px) | Trigger height |
| `--ds-component-select-padding-inline-start` | `1rem` (16px) | Trigger left padding |
| `--ds-component-select-padding-inline-end` | `0.75rem` (12px) | Trigger right padding (tighter, next to the chevron) |
| `--ds-component-select-border-radius` | `0.25rem` (4px) | Trigger corner radius |
| `--ds-component-select-border-width` | `0.0625rem` (1px) | Trigger border thickness |
| `--ds-component-select-gap` | `0.5rem` (8px) | Vertical gap between label, trigger, and helper/error text |
| `--ds-component-select-gap-inline` | `0.5rem` (8px) | Gap between value text and chevron inside the trigger |
| `--ds-component-select-icon-size` | `1.5rem` (24px) | Chevron size |
| `--ds-component-helper-text-gap` / `--ds-component-error-text-gap` | `0.25rem` (4px) | Gap between icon and text in helper/error message |
| `--ds-component-helper-text-icon-size` / `--ds-component-error-text-icon-size` | `1rem` (16px) | Icon size in helper/error message |

## Usage guidelines

Use Select when there are more than ~5 options, or when showing every option at
once (radio buttons) would take up too much space. For 2–5 clearly-visible
options, prefer radio buttons — people can compare choices without an extra click.

Keep option labels short and parallel in structure (all nouns, or all
sentence-case phrases) so the list scans quickly once open.

### Code example

```tsx
<Select
  label="Country"
  description="We'll use this to set your default currency."
  errorMessage="Choose a country."
  placeholder="Select a country"
  items={[
    { id: 'pl', label: 'Poland' },
    { id: 'de', label: 'Germany' },
  ]}
  isRequired
  onSelectionChange={(key) => setCountry(key)}
/>
```

## Component API

```tsx
import { Select } from './components/Select';
```

| Prop           | Type                                                 | Default | Description |
|----------------|-------------------------------------------------------|---------|-------------|
| `label`        | `React.ReactNode`                                      | —       | Field label, shown above the trigger. |
| `description`  | `React.ReactNode`                                      | —       | Helper text shown below the trigger while valid. |
| `errorMessage` | `string \| (validation: ValidationResult) => string`   | —       | Error message shown below the trigger when `isInvalid` is true. |
| `items`        | `SelectOption[]` (`{ id, label, isDisabled? }`)        | —       | The list of selectable options. **Required.** |
| `placeholder`  | `string`                                               | —       | Text shown in the trigger when nothing is selected. |
| `selectedKey` / `defaultSelectedKey` | `Key \| null`                     | —       | Controlled / uncontrolled selected option id. |
| `onSelectionChange` | `(key: Key \| null) => void`                       | —       | Fires when the selection changes. |
| `isDisabled`   | `boolean`                                              | `false` | Removes the trigger from interaction and the tab order. |
| `isRequired`   | `boolean`                                              | `false` | Adds a required marker and wires up validation. |
| `isInvalid`    | `boolean`                                              | `false` | Applies invalid styling and shows `errorMessage`. |
| `...rest`      | `react-aria-components`' `SelectProps`                 | —       | All other React Aria Select props (`name`, `validate`, `isOpen`, `onOpenChange`, …) forward through. |

## Accessibility

Select is built on `react-aria-components`' `Select`, `Label`, `Button`,
`SelectValue`, `Popover`, `ListBox`/`ListBoxItem`, `Text`, and `FieldError`
primitives, which implement the ARIA [Listbox](https://www.w3.org/WAI/ARIA/apg/patterns/listbox/)
pattern for the popover and wire up all label/description/error associations
automatically.

**Keyboard**

| Key | Action |
|-----|--------|
| Tab | Moves focus to the trigger. Skips it if `isDisabled`. |
| Enter / Space / ↓ / ↑ | Opens the popover (when the trigger is focused). |
| ↓ / ↑ | Moves the active option once open. |
| Enter / Space | Selects the active option and closes the popover. |
| Escape | Closes the popover without changing the selection. |
| Type a letter | Jumps to the next option starting with that letter (typeahead). |

**Screen readers**

- The trigger announces the current value (or a "no selection" state) and that
  activating it opens a listbox.
- Each option announces its selected state as the list is navigated.
- When invalid, the error message is announced and `aria-invalid` is set on the
  trigger.

**Focus indicator**

Same shared two-layer focus ring as Button and TextField — restyle it, don't
suppress it. Focus stays on the trigger the entire time the popover is open;
it never moves into the popover itself (per the ARIA Listbox pattern), so the
ring doesn't need special handling for the open state.
