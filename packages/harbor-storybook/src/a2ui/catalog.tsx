// A2UI PoC — Harbor component catalog (Zod-schema'd wrappers).
//
// Wires real Harbor components (`Button`, `TextField`, `TextArea`, `Select`)
// plus two generic layout/content primitives (`Stack`, `Text`) into the
// `@a2ui/react` v0.9 component-implementation API. See src/a2ui/API-NOTES.md
// for the verified ground-truth signatures this file adapts to (installed
// @a2ui/react 0.10.0 / @a2ui/web_core 0.10.4, imported from their `/v0_9`
// subpaths).
import React from 'react';
import { z } from 'zod';
import { createComponentImplementation } from '@a2ui/react/v0_9';
import { Catalog, CommonSchemas } from '@a2ui/web_core/v0_9';
import { Button } from '../components/Button';
import { TextField } from '../components/TextField';
import { TextArea } from '../components/TextArea';
import { Select } from '../components/Select';
import { CATALOG_ID, TEXT_STYLES } from './schema';

// --- Stack: vertical layout container ---------------------------------------
// Per API-NOTES.md §1 ("How a container renders its children"), a container
// declares `children: CommonSchemas.ChildList` in its Zod schema (NOT an empty
// object — the plan's draft got this wrong). After binding, `props.children`
// is an array whose items are either a bare string id or the structural
// `{ id, basePath }` form; the basic catalog's own containers branch on
// `typeof item === 'object' && 'id' in item` to tell them apart, so we mirror
// that here rather than assuming one shape.
//
// Note: the generic binder's `ResolveA2uiProp<ChildList>` types this field as
// `any` (see generic-binder.d.ts — STRUCTURAL props resolve to `any`, since
// their shape depends on the runtime component tree, not the Zod schema
// alone), so we annotate the map callback's parameter explicitly to avoid an
// implicit-any error under this package's `strict` tsconfig.
type StackChildItem = string | { id: string; basePath?: string };
const StackApi = {
  name: 'Stack',
  schema: z.object({ children: CommonSchemas.ChildList }),
};
// Vertical gap uses the real `stack` spacing role (docs/foundations/dimensions.md) —
// `--ds-semantic-spacing-stack-lg` resolves to 1rem/16px, matching the value this used
// to hardcode, so the visual result is unchanged but now traces back to a named token.
const Stack = createComponentImplementation(StackApi, ({ props, buildChild }) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--ds-semantic-spacing-stack-lg)',
    }}
  >
    {(props.children as StackChildItem[]).map((item, index) => {
      if (item && typeof item === 'object' && 'id' in item) {
        return (
          <React.Fragment key={`${item.id}-${index}`}>
            {buildChild(item.id, item.basePath)}
          </React.Fragment>
        );
      }
      return <React.Fragment key={`${item}-${index}`}>{buildChild(item)}</React.Fragment>;
    })}
  </div>
));

// --- Text ---------------------------------------------------------------------
// `style` selects a real Harbor typography token group+tier (see TEXT_STYLES
// in schema.ts) so generated text can express hierarchy instead of rendering
// as an unstyled <span>. Every value is exactly one `{group}-{tier}` hyphen
// pair (verified: all 13 TEXT_STYLES entries contain a single "-"), so a
// plain two-part split is precise here — no need for a "first hyphen only"
// split even though `heading-2xl`-style tiers could in principle contain one.
function splitTextStyle(style: (typeof TEXT_STYLES)[number]): { group: string; tier: string } {
  const [group, tier] = style.split('-');
  return { group, tier };
}

const TextApi = {
  name: 'Text',
  schema: z.object({
    text: CommonSchemas.DynamicString,
    style: z.enum(TEXT_STYLES).optional(),
  }),
};
const Text = createComponentImplementation(TextApi, ({ props }) => {
  // Default to body-md: the same tier Harbor's own TextField/TextArea use for
  // body text, so unstyled generated text still looks intentional.
  const { group, tier } = splitTextStyle(props.style ?? 'body-md');
  const cssVar = (property: string) => `var(--ds-semantic-typography-${group}-${tier}-${property})`;
  return (
    <span
      style={{
        fontFamily: cssVar('font-family'),
        fontSize: cssVar('font-size'),
        fontWeight: cssVar('font-weight'),
        lineHeight: cssVar('line-height'),
        letterSpacing: cssVar('letter-spacing'),
      }}
    >
      {props.text}
    </span>
  );
});

// --- Button (real Harbor component) --------------------------------------------
// Per API-NOTES.md §5 ("CommonSchemas"), `Action` is a `{ event } | { functionCall }`
// descriptor in the *schema*, but the binder resolves it into a plain `() => void`
// callback on `props` — confirmed by the End-to-end example, which passes
// `props.onClick` straight into a DOM `onClick` handler with no manual dispatch
// step. So there is no separate `context.dispatchAction`-style wiring needed here:
// the resolved `props.onPress` already IS the dispatch. (A zero-arg `() => void`
// is structurally assignable to Harbor Button's `onPress: (e: PressEvent) => void`,
// since TS allows a callback with fewer params than the expected signature.)
const ButtonApi = {
  name: 'Button',
  schema: z.object({
    label: CommonSchemas.DynamicString,
    variant: z.enum(['primary', 'secondary', 'outline']).optional(),
    onPress: CommonSchemas.Action.optional(),
  }),
};
const HarborButton = createComponentImplementation(ButtonApi, ({ props }) => (
  <Button variant={props.variant ?? 'primary'} onPress={props.onPress}>
    {props.label}
  </Button>
));

// --- TextField (real Harbor component) ------------------------------------------
const TextFieldApi = {
  name: 'TextField',
  schema: z.object({
    label: CommonSchemas.DynamicString.optional(),
    placeholder: CommonSchemas.DynamicString.optional(),
    description: CommonSchemas.DynamicString.optional(),
  }),
};
const HarborTextField = createComponentImplementation(TextFieldApi, ({ props }) => (
  <TextField label={props.label} placeholder={props.placeholder} description={props.description} />
));

// --- TextArea (real Harbor component) --------------------------------------------
// Same label/placeholder/description pattern as TextField, plus `rows` (a plain
// number, not a Dynamic* schema — it's a layout hint the model picks once per
// field, not something bound to the data model).
const TextAreaApi = {
  name: 'TextArea',
  schema: z.object({
    label: CommonSchemas.DynamicString.optional(),
    placeholder: CommonSchemas.DynamicString.optional(),
    description: CommonSchemas.DynamicString.optional(),
    rows: z.number().optional(),
  }),
};
const HarborTextArea = createComponentImplementation(TextAreaApi, ({ props }) => (
  <TextArea
    label={props.label}
    placeholder={props.placeholder}
    description={props.description}
    rows={props.rows}
  />
));

// --- Select (real Harbor component) ------------------------------------------
// `items` is literal option *content* (id+label pairs to render in the list),
// not references to other nodes in the component tree — unlike Stack's
// `children`, these ids are never looked up via `buildChild`. That means this
// is NOT a CommonSchemas.ChildList situation: ChildList resolves (STRUCTURAL)
// to `{ id, basePath }` pointers into the surface's own component tree, which
// is the wrong shape for "here are the options" data the model invents inline.
// None of CommonSchemas' Dynamic* helpers fit either (they're for a single
// bound value, not a list of structured records). A plain Zod array-of-objects
// is the closest match to what Select.tsx's `items: SelectOption[]` already
// expects, so declare it directly rather than force-fitting a CommonSchemas
// helper that doesn't model this shape.
const SelectApi = {
  name: 'Select',
  schema: z.object({
    label: CommonSchemas.DynamicString.optional(),
    placeholder: CommonSchemas.DynamicString.optional(),
    description: CommonSchemas.DynamicString.optional(),
    items: z.array(z.object({ id: z.string(), label: z.string() })).optional(),
  }),
};
// This is dev-only PoC tooling meant to surface generation problems, not hide
// them — a silently empty dropdown just makes a bad generation harder to spot
// (a developer has to open the popover and notice there's nothing in it). So a
// missing/empty `items` renders one visible, disabled placeholder option
// instead of an empty-but-functional-looking Select.
const MISSING_ITEMS_PLACEHOLDER = [{ id: '_missing', label: '⚠ No options generated', isDisabled: true }];
const HarborSelect = createComponentImplementation(SelectApi, ({ props }) => (
  <Select
    label={props.label}
    placeholder={props.placeholder}
    description={props.description}
    items={props.items?.length ? props.items : MISSING_ITEMS_PLACEHOLDER}
  />
));

// --- Assemble the catalog ---------------------------------------------------------
// Catalog(id, components[], functions?) — API-NOTES.md §2. No custom logic
// functions in this PoC, so the third arg is an empty array.
export const harborCatalog = new Catalog(
  CATALOG_ID,
  [Stack, Text, HarborButton, HarborTextField, HarborTextArea, HarborSelect],
  [],
);
