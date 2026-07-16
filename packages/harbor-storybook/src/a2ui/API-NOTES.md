# @a2ui/react 0.10 API notes (spike)

Ground-truth reference for the A2UI proof-of-concept. Every signature below was
copied verbatim from the installed `.d.ts` files, not from the README. Later
code (catalog wrappers, the Playground story) should match these exactly.

## Package layout (differs from what the plan assumed)

- Installed versions: `@a2ui/react@0.10.0`, and it resolves `@a2ui/web_core@0.10.4`
  (bundled in `@a2ui/react/node_modules/@a2ui/web_core`). `harbor-storybook`'s own
  `node_modules/@a2ui/web_core` is also `0.10.4`.
- **There is NO `dist/` directory.** The plan's Step 1 command
  (`ls node_modules/@a2ui/react/dist | grep -i v0_9`) fails. Types live directly at
  the package root: `@a2ui/react/v0_9/index.d.ts` and
  `@a2ui/web_core/src/v0_9/index.d.ts`.
- **`@a2ui/react` is hoisted to the workspace-root `node_modules`**, not under
  `packages/harbor-storybook/node_modules`. (A stray `@a2ui/web_core@0.9.2` also
  sits at the root — a transitive leftover; not the copy react uses.)
- **The `/v0_9` subpath DOES exist** and is the current/recommended API. The bare
  `@a2ui/react` entry (`.`) re-exports the **legacy v0.8** API (different names:
  `A2UIProvider`, `A2UIRenderer`, `useA2UIComponent`, etc.). For this POC always
  import from the versioned subpaths:
  - `@a2ui/react/v0_9`  — React renderer (`A2uiSurface`, `createComponentImplementation`, `basicCatalog`, component impls)
  - `@a2ui/web_core/v0_9` — core (`MessageProcessor`, `Catalog`, `CommonSchemas`, schemas, `createFunctionImplementation`)
- The `@a2ui/react/v0_9` bundle imports `@a2ui/web_core/v0_9` **externally** (it does
  not inline `Catalog`/`MessageProcessor`/`SurfaceModel`), so `Catalog`/`SurfaceModel`
  values you build in Storybook are the same classes `A2uiSurface` expects — provided
  everything resolves to one physical web_core copy (see Concerns).
- The README's documented v0.9 API **matches** the installed 0.10 `/v0_9` `.d.ts`.
  The plan author's worry that names changed did not materialize; the names below are
  correct. The real surprises are the packaging points above and the exact shapes below.

---

## 1. `createComponentImplementation(api, RenderComponent)`

From `@a2ui/react/v0_9/index.d.ts`:

```ts
interface ReactComponentImplementation extends ComponentApi {
    /** The framework-specific rendering wrapper. */
    render: React.FC<{
        context: ComponentContext;
        buildChild: (id: string, basePath?: string) => React.ReactNode;
    }>;
}

type ReactA2uiComponentProps<T> = {
    props: T;
    buildChild: (id: string, basePath?: string) => React.ReactNode;
    context: ComponentContext;
};

declare function createComponentImplementation<Api extends ComponentApi>(
    api: Api,
    RenderComponent: React.FC<ReactA2uiComponentProps<ResolveA2uiProps<InferredComponentApiSchemaType<Api>>>>,
): ReactComponentImplementation;

// Advanced variant (no generic binder; you resolve values yourself):
declare function createBinderlessComponentImplementation(
    api: ComponentApi,
    RenderComponent: React.FC<{
        context: ComponentContext;
        buildChild: (id: string, basePath?: string) => React.ReactNode;
    }>,
): ReactComponentImplementation;
```

### `api` shape — `ComponentApi`

From `@a2ui/web_core/v0_9` `catalog/types.d.ts`:

```ts
interface ComponentApi<Schema extends z.ZodTypeAny = z.ZodTypeAny> {
    name: string;            // component name in the A2UI JSON, e.g. 'Button'
    readonly schema: Schema; // a ZOD schema (NOT JSON schema)
}
```

So `api = { name, schema }` where `schema` is a **Zod** object built from
`CommonSchemas`. The schema MUST include catalog common props, and MUST NOT include
`component` or `id` (those live in the message envelope).

### The render callback / children — the key answer

- The second arg is a React FC. Its single props object is
  `ReactA2uiComponentProps<...>` = `{ props, buildChild, context }` (destructure it,
  as the README does: `({ props, buildChild }) => ...`). `buildChild` is **not** a
  separate positional argument — it is a field on that props object.
- `props` is the fully resolved, strongly-typed props (see the Generic Binder section):
  `DynamicString` → `string`, `Action` → `() => void`, `ChildList` → structural list,
  plus injected `setXxx` setters, `isValid?`, `validationErrors?`.
- **`buildChild` signature: `(id: string, basePath?: string) => React.ReactNode`.**
  It takes a component **id** (string) and an optional data `basePath`, and returns a
  renderable React node for that child. Return type is `React.ReactNode`.

### How a container renders its children (the flagged unknown)

A container declares a child field in its Zod schema and iterates the resolved value,
calling `buildChild` per child. Two conventions used by the basic catalog:

- **Multiple children** — field `children: CommonSchemas.ChildList`. After binding,
  `props.children` is an array whose items are either a bare string id **or** an object
  `{ id, basePath }` (the structural form). The basic catalog's internal `ChildList`
  helper does, literally:
  ```tsx
  childList.map((item, i) => {
    if (item && typeof item === 'object' && 'id' in item) {
      const node = item;                       // { id, basePath }
      return <Fragment key={`${node.id}-${i}`}>{buildChild(node.id, node.basePath)}</Fragment>;
    }
    // else: item is a string id -> buildChild(item)
  })
  ```
  (`ChildList` = `string[]` OR `{ componentId: string; path: string }` template for
  data-driven lists.) `scrapeSchemaBehavior` marks `ChildList` as `STRUCTURAL`, and the
  binder "outputs lists of objects containing `{ id, basePath }`".
- **Single child** — field `child: CommonSchemas.ComponentId` (a plain string id, e.g.
  `Card`). The impl calls `buildChild(props.child)`.

So a Harbor `Stack`/`Row` wrapper should: declare `children: CommonSchemas.ChildList`
in its schema, then in render map over `props.children`, and for each item call
`buildChild(id, basePath)` (handling both the string and `{id, basePath}` forms), and
place the returned nodes inside the Harbor layout component.

---

## 2. `Catalog` constructor

From `@a2ui/web_core/v0_9` `catalog/types.d.ts`:

```ts
declare class Catalog<T extends ComponentApi> implements CatalogInterface<T> {
    readonly id: string;
    readonly components: ReadonlyMap<string, T>;
    readonly functions: ReadonlyMap<string, FunctionImplementation>;
    readonly themeSchema?: z.ZodObject<any>;
    readonly invoker: FunctionInvoker;
    constructor(
        id: string,
        components: T[],                       // ARRAY, not a map
        functions?: FunctionImplementation[],
        themeSchema?: z.ZodObject<any>,
    );
}
```

Argument order: **`(id, components[], functions?, themeSchema?)`**. `components` is a
plain array of component impls (each a `ReactComponentImplementation`, which extends
`ComponentApi`); the constructor builds the `ReadonlyMap` internally keyed by `name`.
`id` is a catalog URL string. The bundled `basicCatalog.id` is
`"https://a2ui.org/specification/v0_9/basic_catalog.json"`.

Custom functions use `createFunctionImplementation(api, execute)` where
`api = { name, returnType: 'string'|'number'|'boolean'|'array'|'object'|'any'|'void', schema: ZodTypeAny }`.

---

## 3. `MessageProcessor` + surface listeners

From `@a2ui/web_core/v0_9` `processing/message-processor.d.ts`:

```ts
type ActionListener = (action: A2uiClientAction) => void | Promise<void>;

declare class MessageProcessor<T extends ComponentApi> {
    readonly model: SurfaceGroupModel<T>;
    constructor(
        catalogs: Catalog<T>[],                // ARRAY of catalogs, not a single one
        actionHandler?: ActionListener,
    );
    getClientCapabilities(options?: CapabilitiesOptions): A2uiClientCapabilities;
    getClientDataModel(): A2uiClientDataModel | undefined;
    onSurfaceCreated(handler: (surface: SurfaceModel<T>) => void): Subscription;
    onSurfaceDeleted(handler: (id: string) => void): Subscription;
    processMessages(messages: A2uiMessage[] | A2uiMessageListWrapper): void;
    resolvePath(path: string, contextPath?: string): string;
}
```

- Constructor takes an **array** of catalogs: `new MessageProcessor([myCatalog])`.
- `processMessages` accepts **either** a raw `A2uiMessage[]` **or** a wrapper
  `{ messages: A2uiMessage[] }` (`A2uiMessageListWrapper`).
- `Subscription` (returned by the `onSurface*` methods) has `.unsubscribe()`.

Surface access via `model` (`SurfaceGroupModel`) from `state/surface-group-model.d.ts`:

```ts
declare class SurfaceGroupModel<T extends ComponentApi> {
    readonly onSurfaceCreated: EventSource<SurfaceModel<T>>;
    readonly onSurfaceDeleted: EventSource<string>;
    readonly onAction: EventSource<A2uiClientAction>;
    addSurface(surface: SurfaceModel<T>): void;
    deleteSurface(id: string): void;
    getSurface(id: string): SurfaceModel<T> | undefined;
    get surfacesMap(): ReadonlyMap<string, SurfaceModel<T>>;  // getter
    dispose(): void;
}
```

Canonical wiring (from README, confirmed against types):

```tsx
const p = new MessageProcessor([basicCatalog]);
p.processMessages(messages);
let surfaces = Array.from(p.model.surfacesMap.values());
const sub = p.onSurfaceCreated(() => { /* re-read p.model.surfacesMap */ });
// later: sub.unsubscribe();
```

---

## 4. `A2uiSurface` — required props

From `@a2ui/react/v0_9/index.d.ts`:

```ts
declare const A2uiSurface: React.FC<{
    surface: SurfaceModel<ReactComponentImplementation>;
}>;
```

- **Only one required prop: `surface`** — a `SurfaceModel` instance (get it from
  `processor.model.surfacesMap`). It does **not** take `catalog`, `processor`, or
  `surfaceId` props. Render one `<A2uiSurface surface={s} />` per surface, keyed by
  `s.id`.
- `SurfaceModel` (`state/surface-model.d.ts`) carries `id`, `catalog`, `theme`,
  `sendDataModel`, `dataModel`, `componentsModel`, `onAction: EventSource<A2uiClientAction>`,
  `onError`, `dispatchAction(...)`, `dispose()`.
- Also exported: `DeferredChild: React.FC<{ surface, id, basePath }>` (internal helper
  for rendering a child by id; usually you use `buildChild` inside a component instead).

---

## 5. `CommonSchemas`

From `@a2ui/web_core/v0_9` `schema/common-types.d.ts` — `CommonSchemas` is an object of
Zod schemas. **Available keys (exact):**

```
ComponentId, ChildList, DataBinding, DynamicValue, DynamicString, DynamicNumber,
DynamicBoolean, DynamicStringList, FunctionCall, CheckRule, Checkable, Action,
AccessibilityAttributes, AnyComponent
```

Note: there is a `DynamicStringList` and a `DynamicValue`; there is **no** standalone
`DynamicArray`/`DynamicObject`. Shapes that matter (resolved from Zod):

- `DynamicString` = `string | { path: string } | FunctionCall` (bound → `string`).
  Same union pattern for `DynamicNumber`, `DynamicBoolean`, `DynamicStringList`,
  `DynamicValue`.
- `DataBinding` = `{ path: string }`.
- `FunctionCall` = `{ call: string; args: Record<string, any>; returnType: '...' }`.
- `ComponentId` = `string`.
- `ChildList` = `string[]  |  { componentId: string; path: string }` (the object form is
  a template for generating children from a data list). Resolves (STRUCTURAL) to a list
  of `{ id, basePath }`.
- `Action` = **union**, NOT a plain string:
  `{ event: { name: string; context?: Record<string, DynamicValue> } }`
  `| { functionCall: FunctionCall }`. Resolves (via binder) to `() => void`.
- `Checkable` = `{ checks?: CheckRule[] }`; `CheckRule = { condition: DynamicBoolean; message: string }`.
  Add `checks: CommonSchemas.Checkable.shape.checks` to a component schema to get
  `props.isValid` / `props.validationErrors`.
- `AccessibilityAttributes` = `{ label?: DynamicString; description?: DynamicString }`.
- `AnyComponent` = `{ component: string; id?: string; weight?: number; ...passthrough }`
  (the per-component envelope inside `updateComponents.components`).

---

## 6. Message object shapes (server → client)

From `@a2ui/web_core/v0_9` `schema/server-to-client.d.ts`. **`version` is the literal
string `'v0.9'`** on every message (note: `'v0.9'`, with a dot — not `'v0_9'`).

```ts
// createSurface
{
  version: 'v0.9',
  createSurface: {
    surfaceId: string,
    catalogId: string,          // must equal your Catalog's `id` (e.g. basicCatalog.id)
    theme?: any,
    sendDataModel?: boolean,
  }
}

// updateComponents — defines/replaces the component tree
{
  version: 'v0.9',
  updateComponents: {
    surfaceId: string,
    components: Array<{          // AnyComponent (passthrough: extra props allowed)
      component: string,        // component type name, e.g. 'Column' | 'Text' | 'Button'
      id?: string,              // node id referenced by parents' children
      weight?: number,
      // ...any component-specific props: text, children, child, onClick, etc.
    }>,
  }
}

// updateDataModel — supplies data referenced by { path } bindings
{
  version: 'v0.9',
  updateDataModel: {
    surfaceId: string,
    path?: string,              // e.g. '/'
    value?: any,
  }
}

// deleteSurface
{
  version: 'v0.9',
  deleteSurface: { surfaceId: string }
}
```

Wrapper form accepted by `processMessages`: `{ messages: [ ...above ] }`
(`A2uiMessageListWrapper`). A raw array `A2uiMessage[]` is also accepted.

Field-name notes (easy to get wrong):
- It is `catalogId` (not `catalog`) in `createSurface`.
- Inside `components[]` the type field is `component` (not `type`/`componentType`), and
  each node carries its own `id`. `component` + `id` live in the envelope — do **not**
  also put them in the component's Zod schema.
- Children are referenced by id (`children: ['a','b']` or `child: 'a'`); components
  cannot be defined inline.

There is also a raw JSON-schema mirror exported as `Schemas.A2uiMessageSchemaRaw` from
`@a2ui/web_core/v0_9`, useful if you want to hand Claude a JSON schema for the payload.

---

## Concerns / things needing runtime verification

- **Dual web_core physical copies.** `@a2ui/react@0.10.0` resolves its own nested
  `@a2ui/web_core@0.10.4`, and `harbor-storybook` has a separate `@a2ui/web_core@0.10.4`.
  Same version, but two on-disk copies → potential dual-instance hazard if Storybook
  imports `Catalog`/`SurfaceModel` from a different physical copy than the one
  `A2uiSurface` was bundled against. `A2uiSurface` mostly duck-types on `surface`, so it
  will likely work, but confirm at runtime (Vite/Storybook dedupe may already collapse
  them). If problems appear, add a Vite `resolve.dedupe` / alias for `@a2ui/web_core`.
- **Bundle-derived details** (the `buildChild(node.id, node.basePath)` loop, the single
  `child` handling, `basicCatalog.id`) were read from the minified `v0_9/index.js`, not a
  `.d.ts`. They are consistent with the `BehaviorNode`/`ResolveA2uiProps` type docs, but
  the precise per-item runtime shape (`string` vs `{ id, basePath }`) should be confirmed
  by logging `props.children` once a container renders.
- **React 18 compat.** Types declare `React.FC`/`ReactNode`; nothing here requires React
  19. (0.10.1+ would; we are pinned to 0.10.0 on purpose.)
