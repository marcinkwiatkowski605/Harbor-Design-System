# TextArea

A text area lets people enter multiple lines of plain text — a comment, a
description, free-form feedback.

> **Note:** built on
> [`react-aria-components`](https://react-aria.adobe.com/)' `TextArea`, which is
> a drop-in swap for `Input` inside the same `TextField` container — TextArea
> shares the exact same `Label`/description/error wiring as our TextField
> component, just renders a `<textarea>` instead of an `<input>`. Colors and
> sizes below are real component tokens, synced from Figma.

> _Live, interactive example — see this component in Storybook._

## Anatomy

Same four parts as TextField, with `TextArea` swapped in for `Input`:

```tsx
<TextField>
  <Label>{label}</Label>
  <TextArea />
  <Text slot="description"><InfoCircleFilledIcon />{description}</Text>
  <FieldError><AlertTriangleFilledIcon />{errorMessage}</FieldError>
</TextField>
```

The `rows` prop sets the visible height (native `<textarea rows>`); people can
resize it further by dragging the bottom-right corner (`resize: vertical`).
Description and error message render with a leading icon, matching Figma's
Helper-text/Error-text building blocks — same as TextField.

## States

Identical state set to TextField — Enabled, Hover, Focus, Disabled, Read-only,
Required, Invalid — driven by the same `data-hovered` / `data-focus-visible` /
`data-disabled` / `data-readonly` / `data-required` / `data-invalid` attributes.
See TextField's docs for the full breakdown; nothing about the state model
changes for multi-line input. Read-only is likewise visually identical to
Enabled — no dedicated Figma variant, behavior-only difference.

## Color reference

| Token | Value | Used for |
|---|---|---|
| `--ds-component-text-area-color-background-default` | `#FFFFFF` | Textarea background, enabled |
| `--ds-component-text-area-color-background-hover` | `#F2F4F5` | Textarea background, hovered |
| `--ds-component-text-area-color-background-disabled` | `#CFD5DA` | Textarea background, disabled |
| `--ds-component-text-area-color-border-default` | `#909AA1` | Textarea border, enabled |
| `--ds-component-text-area-color-border-hover` | `#747D84` | Textarea border, hovered |
| `--ds-component-text-area-color-border-disabled` | `#B0B9BF` | Textarea border, disabled |
| `--ds-component-text-area-color-border-error` | `#FC5855` | Textarea border, invalid |
| `--ds-component-text-area-color-border-error-hover` | `#D53C3D` | Textarea border, invalid + hovered |
| `--ds-component-text-area-color-content-filled` | `#484E53` | Typed value text |
| `--ds-component-text-area-color-content-placeholder` | `#B0B9BF` | Placeholder text |
| `--ds-component-text-area-color-content-disabled` | `#909AA1` | Typed value text, disabled |
| `--ds-component-field-label-color-content` | `#484E53` | Label text |
| `--ds-component-field-label-color-content-error` | `#D53C3D` | Required marker (`*`) |
| `--ds-component-helper-text-color-content` | `#484E53` | Description text and icon |
| `--ds-component-error-text-color-content` | `#D53C3D` | Error message text and icon |

## Specs

| Token | Value | Used for |
|---|---|---|
| `--ds-component-text-area-height` | `5rem` (80px) | Textarea minimum height |
| `--ds-component-text-area-padding-inline` | `1rem` (16px) | Textarea left/right padding |
| `--ds-component-text-area-padding-block` | `0.75rem` (12px) | Textarea top/bottom padding |
| `--ds-component-text-area-border-radius` | `0.25rem` (4px) | Textarea corner radius |
| `--ds-component-text-area-border-width` | `0.0625rem` (1px) | Textarea border thickness |
| `--ds-component-text-area-gap` | `0.5rem` (8px) | Vertical gap between label, textarea, and helper/error text |
| `--ds-component-helper-text-gap` / `--ds-component-error-text-gap` | `0.25rem` (4px) | Gap between icon and text in helper/error message |
| `--ds-component-helper-text-icon-size` / `--ds-component-error-text-icon-size` | `1rem` (16px) | Icon size in helper/error message |

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
