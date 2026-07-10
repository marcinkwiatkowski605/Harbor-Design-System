# Select

A select lets people choose one option from a list, without taking up the space
a fully expanded set of choices (like radio buttons) would need.

> **Note:** built the same way as TextField — on
> [`react-aria-components`](https://react-aria.adobe.com/)' `Select` primitive,
> using its explicit anatomy (`Label` + `Button` + `SelectValue` + `Popover` +
> `ListBox`/`ListBoxItem`) instead of the compact all-in-one API, for full control
> over styling each part. There's no Figma spec yet, so this exposes React Aria's
> single-selection surface rather than a Harbor-specific subset. Colors and sizes
> below are **placeholder values**, not final component tokens.

> _Live, interactive example — see this component in Storybook._

## Anatomy

Select composes six parts, each a separate `react-aria-components` primitive:

```tsx
<Select items={items}>
  <Label>{label}</Label>
  <Button>
    <SelectValue />
    <span aria-hidden="true" /> {/* chevron */}
  </Button>
  <Text slot="description">{description}</Text>
  <FieldError>{errorMessage}</FieldError>
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
  open/closed.
- **Popover + ListBox** — the list of options, only mounted in the DOM while open.
- **Description** / **Error message** — same helper-text/validation pattern as TextField.

## States

- **Enabled** — default resting state.
- **Hover** — trigger border darkens (`data-hovered` on the trigger button).
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

**Pending** — this branch uses placeholder hardcoded colors (see `Select.css`),
not component tokens. This section will be filled in with the real value/token
table once component tokens for Select are prepared and wired in.

## Specs

**Pending** — sizing (trigger height/padding, popover max height, option padding)
is currently hardcoded as placeholder values in `Select.css`. This section will
list the final value/token table once component tokens exist.

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
