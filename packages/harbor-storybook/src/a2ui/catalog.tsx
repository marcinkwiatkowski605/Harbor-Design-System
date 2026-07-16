// A2UI PoC — Harbor component catalog (Zod-schema'd wrappers).
//
// Wires real Harbor components (`Button`, `TextField`) plus two generic
// layout/content primitives (`Stack`, `Text`) into the `@a2ui/react` v0.9
// component-implementation API. See src/a2ui/API-NOTES.md for the verified
// ground-truth signatures this file adapts to (installed @a2ui/react 0.10.0 /
// @a2ui/web_core 0.10.4, imported from their `/v0_9` subpaths).
import React from 'react';
import { z } from 'zod';
import { createComponentImplementation } from '@a2ui/react/v0_9';
import { Catalog, CommonSchemas } from '@a2ui/web_core/v0_9';
import { Button } from '../components/Button';
import { TextField } from '../components/TextField';
import { CATALOG_ID } from './schema';

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
const Stack = createComponentImplementation(StackApi, ({ props, buildChild }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
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
const TextApi = {
  name: 'Text',
  schema: z.object({ text: CommonSchemas.DynamicString }),
};
const Text = createComponentImplementation(TextApi, ({ props }) => <span>{props.text}</span>);

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

// --- Assemble the catalog ---------------------------------------------------------
// Catalog(id, components[], functions?) — API-NOTES.md §2. No custom logic
// functions in this PoC, so the third arg is an empty array.
export const harborCatalog = new Catalog(
  CATALOG_ID,
  [Stack, Text, HarborButton, HarborTextField],
  [],
);
