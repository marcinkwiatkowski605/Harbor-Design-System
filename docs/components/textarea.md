# TextArea

A text area lets people enter multiple lines of plain text — a comment, a
description, free-form feedback.

> **Experimental branch note:** built on
> [`react-aria-components`](https://react-aria.adobe.com/)' `TextArea`, which is
> a drop-in swap for `Input` inside the same `TextField` container — TextArea
> shares the exact same `Label`/description/error wiring as our TextField
> component, just renders a `<textarea>` instead of an `<input>`. Colors and
> sizes below are **placeholder values**, not final component tokens.

> _Live, interactive example — see this component in Storybook._

## Anatomy

Same four parts as TextField, with `TextArea` swapped in for `Input`:

```tsx
<TextField>
  <Label>{label}</Label>
  <TextArea />
  <Text slot="description">{description}</Text>
  <FieldError>{errorMessage}</FieldError>
</TextField>
```

The `rows` prop sets the visible height (native `<textarea rows>`); people can
resize it further by dragging the bottom-right corner (`resize: vertical`).

## States

Identical state set to TextField — Enabled, Hover, Focus, Disabled, Read-only,
Required, Invalid — driven by the same `data-hovered` / `data-focus-visible` /
`data-disabled` / `data-readonly` / `data-required` / `data-invalid` attributes.
See TextField's docs for the full breakdown; nothing about the state model
changes for multi-line input.

## Color reference

**Pending** — this branch uses placeholder hardcoded colors (see `TextArea.css`),
not component tokens. This section will be filled in with the real value/token
table once component tokens for TextArea are prepared and wired in.

## Specs

**Pending** — sizing (min height, padding, radius, border width) is currently
hardcoded as placeholder values in `TextArea.css`. This section will list the
final value/token table once component tokens exist.

## Usage guidelines

Use TextArea when people need more than a short phrase — comments, descriptions,
open-ended feedback. For a single line of text (names, emails, search), use
TextField instead; a resizable multi-line box for one word of input just wastes
space and invites people to type more than you need.

Set `rows` to roughly the amount of text you expect by default — too short and
people spend the whole time scrolling within a tiny box; too tall and a one-line
answer looks lost in empty space.

### Code example

```tsx
<TextArea
  label="Feedback"
  description="Let us know what worked and what didn't."
  errorMessage="Feedback must be at least 10 characters."
  rows={4}
  onChange={(value) => setFeedback(value)}
/>
```

## Component API

```tsx
import { TextArea } from './components/TextArea';
```

| Prop           | Type                                                | Default | Description |
|----------------|------------------------------------------------------|---------|-------------|
| `label`        | `React.ReactNode`                                    | —       | Field label, shown above the textarea. |
| `description`  | `React.ReactNode`                                    | —       | Helper text shown below the textarea while valid. |
| `errorMessage` | `string \| (validation: ValidationResult) => string`  | —       | Error message shown below the textarea when `isInvalid` is true. |
| `placeholder`  | `string`                                              | —       | Placeholder text shown when the textarea is empty. |
| `rows`         | `number`                                              | —       | Visible number of text lines (native `rows` attribute). |
| `value` / `defaultValue` | `string`                                    | —       | Controlled / uncontrolled textarea value. |
| `onChange`     | `(value: string) => void`                             | —       | Fires on every value change. |
| `isDisabled`   | `boolean`                                             | `false` | Removes the field from interaction and the tab order. |
| `isReadOnly`   | `boolean`                                             | `false` | Field is focusable but not editable. |
| `isRequired`   | `boolean`                                             | `false` | Adds a required marker and wires up validation. |
| `isInvalid`    | `boolean`                                             | `false` | Applies invalid styling and shows `errorMessage`. |
| `textAreaRef`  | `React.Ref<HTMLTextAreaElement>`                      | —       | A ref for the underlying `<textarea>` element. |
| `...rest`      | `react-aria-components`' `TextFieldProps`             | —       | All other React Aria TextField props (`name`, `validate`, `minLength`, `maxLength`, …) forward through. |

## Accessibility

Same primitives and ARIA wiring as TextField (`TextField`, `Label`, `Text`,
`FieldError`), with `TextArea` in place of `Input` — label, description, and
error message are always correctly associated with the textarea.

**Keyboard**

| Key | Action |
|-----|--------|
| Tab | Moves focus to the textarea. Skips it if `isDisabled`. |
| Shift+Tab | Moves focus away from the textarea. |
| Enter | Inserts a new line (does not submit a form, unlike TextField). |

**Focus indicator**

Same shared two-layer focus ring as Button, TextField, and Select.
