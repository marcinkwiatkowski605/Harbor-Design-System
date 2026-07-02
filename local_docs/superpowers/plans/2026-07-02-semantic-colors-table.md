# Semantic Colors Table Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert the semantic `Color` story in Storybook (Foundations → Design Tokens →
Tier 2: Semantic Tokens) from a swatch-grid layout into a table with columns Swatch / CSS
Variable / Value / Use Case, sourcing hex values from the token build JSON and adding a
one-line Use Case description for all 62 semantic color tokens.

**Architecture:** Single-file change to
`packages/harbor-storybook/.storybook/components/tier-2-tokens/tier-2-tokens.stories.tsx`.
Task 1 converts the `colorGroups` data from plain string contexts to `{ key, useCase }`
objects and wires in a JSON-backed hex lookup, while patching the *existing* grid renderer
just enough to keep compiling and rendering (no visual change yet). Task 2 replaces the
grid renderer with the new table renderer. Each task ends in a compiling, visually
verifiable state.

**Tech Stack:** React 18 + TypeScript (strict) + Storybook 8 (Vite builder). No test
runner is configured in `packages/harbor-storybook` (confirmed: no jest/vitest, no test
script, no existing `*.test.*`/`*.spec.*` files in the package) — this plan does not add
one, matching the existing convention of doc-only stories with no automated tests.
Verification is via `tsc --noEmit`, a standalone Node data-integrity check, and manual
visual review in the Storybook dev server.

---

## Task 1: Convert `colorGroups` to carry Use Case copy and a JSON-backed hex lookup

**Files:**
- Modify: `packages/harbor-storybook/.storybook/components/tier-2-tokens/tier-2-tokens.stories.tsx:1-90`
- Test: none (see Tech Stack note above) — verified via `tsc --noEmit` and a standalone Node script (Step 5)

- [ ] **Step 1: Add the JSON import**

At the top of the file, after the existing imports (currently lines 1-2), add:

```ts
import tokensJson from '../../../../harbor-tokens/light/build/json/tokens.json';
```

Path verified: the file lives at
`packages/harbor-storybook/.storybook/components/tier-2-tokens/`, four `../` reaches
`packages/`, then `harbor-tokens/light/build/json/tokens.json` resolves to
`packages/harbor-tokens/light/build/json/tokens.json`. This mirrors the existing relative
import in `packages/harbor-storybook/.storybook/preview.ts`
(`import '../../harbor-tokens/light/build/css/tokens.css'`), just two directories deeper.

- [ ] **Step 2: Replace the `ColorGroup` type and add the hex lookup helper**

Replace this line (currently line 30):

```ts
type ColorGroup = { role: string; contexts: string[] };
```

with:

```ts
type ColorContext = { key: string; useCase: string };
type ColorGroup = { role: string; contexts: ColorContext[] };

// tokens.json also contains non-color tokens with numeric values (e.g. font weights),
// so it can't be cast directly to Record<string, string> — bridge through `unknown`.
const semanticColorTokens = tokensJson as unknown as Record<string, string>;

const hexFor = (role: string, key: string): string => {
  const cssVarName = `ds-semantic-color-${role}-${key}`;
  const hex = semanticColorTokens[cssVarName];
  if (!hex) {
    throw new Error(`Missing token value for --${cssVarName} in tokens.json`);
  }
  return hex;
};
```

(`hexFor` is unused until Task 2 — that's fine, this repo's tsconfig does not set
`noUnusedLocals`.)

- [ ] **Step 3: Replace the `colorGroups` data with the full Use Case copy**

Replace the entire array (currently lines 32-57, from `const colorGroups: ColorGroup[] = [`
through the closing `];`) with:

```ts
const colorGroups: ColorGroup[] = [
  {
    role: 'background',
    contexts: [
      { key: 'default', useCase: 'Default background for pages, cards, and containers' },
      { key: 'hover', useCase: 'Hover color for `background-default`' },
      { key: 'pressed', useCase: 'Pressed color for `background-default`' },
      { key: 'disabled', useCase: 'Background for disabled controls and containers' },
      { key: 'subtle', useCase: 'Recessed, low-emphasis background' },
      { key: 'accent-default', useCase: 'Background for accent-emphasis elements' },
      { key: 'accent-hover', useCase: 'Hover color for `background-accent-default`' },
      { key: 'accent-pressed', useCase: 'Pressed color for `background-accent-default`' },
      { key: 'accent-subtle', useCase: 'Low-emphasis background for accent elements' },
      { key: 'brand-default', useCase: 'Background for primary, brand-emphasis controls' },
      { key: 'brand-hover', useCase: 'Hover color for `background-brand-default`' },
      { key: 'brand-pressed', useCase: 'Pressed color for `background-brand-default`' },
      { key: 'brand-subtle', useCase: 'Low-emphasis background for brand elements' },
      { key: 'support-error-strong', useCase: 'High-emphasis background for error or destructive states' },
      { key: 'support-error-subtle', useCase: 'Low-emphasis background for error or destructive states' },
      { key: 'support-info-strong', useCase: 'High-emphasis background for informational content' },
      { key: 'support-info-subtle', useCase: 'Low-emphasis background for informational content' },
      { key: 'support-success-strong', useCase: 'High-emphasis background for success states' },
      { key: 'support-success-subtle', useCase: 'Low-emphasis background for success states' },
      { key: 'support-warning-strong', useCase: 'High-emphasis background for warnings' },
      { key: 'support-warning-subtle', useCase: 'Low-emphasis background for warnings' },
    ],
  },
  {
    role: 'border',
    contexts: [
      { key: 'default', useCase: 'Default border for containers and controls' },
      { key: 'hover', useCase: 'Hover color for `border-default`' },
      { key: 'pressed', useCase: 'Pressed color for `border-default`' },
      { key: 'disabled', useCase: 'Border for disabled controls' },
      { key: 'accent', useCase: 'Border for accent-emphasis elements' },
      { key: 'brand', useCase: 'Border for brand-emphasis or selected controls' },
      { key: 'error', useCase: 'Border communicating an error or destructive state' },
      { key: 'info', useCase: 'Border communicating informational content' },
      { key: 'success', useCase: 'Border communicating a success state' },
      { key: 'warning', useCase: 'Border communicating a warning' },
      { key: 'focus', useCase: 'Visible focus indicator' },
    ],
  },
  {
    role: 'content',
    contexts: [
      { key: 'default', useCase: 'Default text color for body copy and labels' },
      { key: 'hover', useCase: 'Hover color for `content-default`' },
      { key: 'disabled', useCase: 'Text color for disabled controls and copy' },
      { key: 'subtle', useCase: 'Secondary, low-emphasis text' },
      { key: 'inverse', useCase: 'Text on inverse (dark) backgrounds' },
      { key: 'accent', useCase: 'Text for accent-emphasis content' },
      { key: 'brand', useCase: 'Text for brand-emphasis or primary interactive content' },
      { key: 'error', useCase: 'Text communicating an error or destructive state' },
      { key: 'info', useCase: 'Text communicating informational content' },
      { key: 'success', useCase: 'Text communicating a success state' },
      { key: 'warning', useCase: 'Text communicating a warning' },
      { key: 'on-error-subtle', useCase: 'Text on `background-support-error-subtle` surfaces' },
      { key: 'on-info-subtle', useCase: 'Text on `background-support-info-subtle` surfaces' },
      { key: 'on-success-subtle', useCase: 'Text on `background-support-success-subtle` surfaces' },
      { key: 'on-warning-subtle', useCase: 'Text on `background-support-warning-subtle` surfaces' },
    ],
  },
  {
    role: 'icon',
    contexts: [
      { key: 'default', useCase: 'Default icon color' },
      { key: 'hover', useCase: 'Hover color for `icon-default`' },
      { key: 'disabled', useCase: 'Icon color for disabled controls' },
      { key: 'subtle', useCase: 'Secondary, low-emphasis icon color' },
      { key: 'inverse', useCase: 'Icons on inverse (dark) backgrounds' },
      { key: 'accent', useCase: 'Icons for accent-emphasis elements' },
      { key: 'brand', useCase: 'Icons for brand-emphasis or primary interactive elements' },
      { key: 'error', useCase: 'Icon communicating an error or destructive state' },
      { key: 'info', useCase: 'Icon communicating informational content' },
      { key: 'success', useCase: 'Icon communicating a success state' },
      { key: 'warning', useCase: 'Icon communicating a warning' },
      { key: 'on-error', useCase: 'Icons on `background-support-error-subtle` surfaces' },
      { key: 'on-info', useCase: 'Icons on `background-support-info-subtle` surfaces' },
      { key: 'on-success', useCase: 'Icons on `background-support-success-subtle` surfaces' },
      { key: 'on-warning', useCase: 'Icons on `background-support-warning-subtle` surfaces' },
    ],
  },
];
```

- [ ] **Step 4: Patch the existing grid renderer to use `ctx.key`**

Inside the `Color` story's `render`, find (currently lines 78-82):

```tsx
            {contexts.map(ctx => {
              const cssVar = `--ds-semantic-color-${role}-${ctx}`;
              return (
                <ColorSwatch key={ctx} cssVar={cssVar} label={ctx} />
              );
            })}
```

Replace with:

```tsx
            {contexts.map(ctx => {
              const cssVar = `--ds-semantic-color-${role}-${ctx.key}`;
              return (
                <ColorSwatch key={ctx.key} cssVar={cssVar} label={ctx.key} />
              );
            })}
```

This is the only change needed to keep the (still-grid) UI compiling and rendering
correctly against the new data shape. The visual output is unchanged at this point — Task
2 replaces the grid with the table.

- [ ] **Step 5: Verify — type-check**

Run from the repo root:

```bash
npx tsc --noEmit -p packages/harbor-storybook/tsconfig.json
```

Expected: no output, exit code 0.

- [ ] **Step 6: Verify — data integrity check**

Run from the repo root:

```bash
node -e "
const tokens = require('./packages/harbor-tokens/light/build/json/tokens.json');
const groups = {
  background: ['default','hover','pressed','disabled','subtle','accent-default','accent-hover','accent-pressed','accent-subtle','brand-default','brand-hover','brand-pressed','brand-subtle','support-error-strong','support-error-subtle','support-info-strong','support-info-subtle','support-success-strong','support-success-subtle','support-warning-strong','support-warning-subtle'],
  border: ['default','hover','pressed','disabled','accent','brand','error','info','success','warning','focus'],
  content: ['default','hover','disabled','subtle','inverse','accent','brand','error','info','success','warning','on-error-subtle','on-info-subtle','on-success-subtle','on-warning-subtle'],
  icon: ['default','hover','disabled','subtle','inverse','accent','brand','error','info','success','warning','on-error','on-info','on-success','on-warning'],
};
let missing = [];
let count = 0;
for (const [role, keys] of Object.entries(groups)) {
  for (const key of keys) {
    count++;
    const cssKey = \`ds-semantic-color-\${role}-\${key}\`;
    if (!(cssKey in tokens)) missing.push(cssKey);
  }
}
console.log(count, 'tokens checked,', missing.length, 'missing');
if (missing.length) { console.log(missing); process.exit(1); }
"
```

Expected output: `62 tokens checked, 0 missing`

This confirms every `{ role, key }` pair added in Step 3 has a matching entry in
`tokens.json`, so `hexFor` (used starting in Task 2) will not throw at render time.

- [ ] **Step 7: Commit**

```bash
git add packages/harbor-storybook/.storybook/components/tier-2-tokens/tier-2-tokens.stories.tsx
git commit -m "$(cat <<'EOF'
docs(storybook): add Use Case copy and hex lookup to semantic color tokens

Convert colorGroups contexts from plain strings to { key, useCase }
objects and read hex values from the token build JSON, ahead of
replacing the swatch grid with a table.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

## Task 2: Replace the swatch grid with the Swatch / CSS Variable / Value / Use Case table

**Files:**
- Modify: `packages/harbor-storybook/.storybook/components/tier-2-tokens/tier-2-tokens.stories.tsx`
- Test: none (see Tech Stack note) — verified via `tsc --noEmit` and manual Storybook review (Steps 3-4)

- [ ] **Step 1: Replace `ColorSwatch` with `ColorTableRow` and `ColorTable`**

Replace the `ColorSwatch` component (added at the top of the Color section, currently
lines 59-70):

```tsx
const ColorSwatch = ({ cssVar, label }: { cssVar: string; label: string }) => (
  <div style={{ minWidth: 80 }}>
    <div style={{
      height: 40,
      background: `var(${cssVar})`,
      borderRadius: 4,
      border: '1px solid rgba(0,0,0,.07)',
      boxShadow: 'inset 0 0 0 1px rgba(0,0,0,.04)',
    }} />
    <TokenLabel>{label}</TokenLabel>
  </div>
);
```

with:

```tsx
const ColorTableRow = ({ role, context }: { role: string; context: ColorContext }) => {
  const cssVar = `--ds-semantic-color-${role}-${context.key}`;
  const hex = hexFor(role, context.key);
  return (
    <tr>
      <td style={{ padding: '8px 12px', verticalAlign: 'middle' }}>
        <div style={{
          width: 64,
          height: 32,
          borderRadius: 4,
          background: `var(${cssVar})`,
          border: '1px solid rgba(0,0,0,.07)',
          boxShadow: 'inset 0 0 0 1px rgba(0,0,0,.04)',
        }} />
      </td>
      <td style={{ padding: '8px 12px', verticalAlign: 'middle' }}>
        <code style={{
          fontFamily: 'monospace',
          fontSize: 11,
          color: '#1a56db',
          background: '#eef4ff',
          padding: '2px 6px',
          borderRadius: 4,
        }}>{cssVar}</code>
      </td>
      <td style={{ padding: '8px 12px', verticalAlign: 'middle', fontFamily: 'monospace', fontSize: 11, color: '#111' }}>
        {hex}
      </td>
      <td style={{ padding: '8px 12px', verticalAlign: 'middle', fontSize: 12, color: '#333' }}>
        {context.useCase}
      </td>
    </tr>
  );
};

const ColorTable = ({ role, contexts }: { role: string; contexts: ColorContext[] }) => (
  <table style={{ width: '100%', borderCollapse: 'collapse' as const, ...baseStyle }}>
    <thead>
      <tr>
        {['Swatch', 'CSS Variable', 'Value', 'Use Case'].map(heading => (
          <th
            key={heading}
            style={{
              textAlign: 'left',
              padding: '8px 12px',
              fontSize: 11,
              fontWeight: 600,
              textTransform: 'uppercase' as const,
              letterSpacing: '0.04em',
              color: '#888',
              borderBottom: '1px solid #eee',
            }}
          >
            {heading}
          </th>
        ))}
      </tr>
    </thead>
    <tbody>
      {contexts.map(context => (
        <ColorTableRow key={context.key} role={role} context={context} />
      ))}
    </tbody>
  </table>
);
```

(`TokenLabel` stays — it's still used by the Typography and Border & Shadow sections
later in the same file. Only `ColorSwatch`, which is now dead code, is removed.)

- [ ] **Step 2: Replace the `Color` story's render**

Replace the `Color` export (currently the block starting `export const Color: StoryObj = {`
through its closing `};`, right after the component you just added):

```tsx
export const Color: StoryObj = {
  render: () => (
    <div style={{ padding: 24, ...baseStyle }}>
      {colorGroups.map(({ role, contexts }) => (
        <Section key={role} title={`Color · ${role}`}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: 8 }}>
            {contexts.map(ctx => {
              const cssVar = `--ds-semantic-color-${role}-${ctx.key}`;
              return (
                <ColorSwatch key={ctx.key} cssVar={cssVar} label={ctx.key} />
              );
            })}
          </div>
          <TokenLabel>--ds-semantic-color-{role}-*</TokenLabel>
        </Section>
      ))}
    </div>
  ),
};
```

with:

```tsx
export const Color: StoryObj = {
  render: () => (
    <div style={{ padding: 24, ...baseStyle }}>
      {colorGroups.map(({ role, contexts }) => (
        <Section key={role} title={`Color · ${role}`}>
          <ColorTable role={role} contexts={contexts} />
        </Section>
      ))}
    </div>
  ),
};
```

- [ ] **Step 3: Verify — type-check**

Run from the repo root:

```bash
npx tsc --noEmit -p packages/harbor-storybook/tsconfig.json
```

Expected: no output, exit code 0.

- [ ] **Step 4: Verify — visual review in Storybook**

Run from the repo root:

```bash
npm run start
```

This runs `storybook dev -p 6006` (per `packages/harbor-storybook/package.json`). Open
`http://localhost:6006`, navigate to **Foundations → Design Tokens → Tier 2: Semantic
Tokens → Color**, and confirm for all four sections (`background`, `border`, `content`,
`icon`):

- Table has exactly 4 columns: Swatch, CSS Variable, Value, Use Case (no "JS Variable").
- Every row's Swatch color visually matches the hex string shown in Value for that row.
- Every row has non-empty Use Case text.
- Column headers render as actual `<th>` cells (inspect via DevTools if needed — confirms
  the accessibility requirement from the design spec).
- Row counts: 21 (background), 11 (border), 15 (content), 15 (icon).

Stop the dev server (Ctrl+C) once verified.

- [ ] **Step 5: Commit**

```bash
git add packages/harbor-storybook/.storybook/components/tier-2-tokens/tier-2-tokens.stories.tsx
git commit -m "$(cat <<'EOF'
docs(storybook): render semantic color tokens as a table

Replace the swatch grid in Tier 2 > Color with a Swatch / CSS
Variable / Value / Use Case table, matching the requested reference
format and dropping the JS Variable column (no JS dot-path token
export exists in this design system).

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

## Spec coverage check

- Table format (Swatch/CSS Variable/Value/Use Case, no JS Variable): Task 2, Steps 1-2. ✅
- Hex values sourced from `tokens.json`, not hand-written: Task 1, Steps 1-2 (`hexFor`); Task 2 Step 1 (`ColorTableRow` calls it). ✅
- All 62 tokens covered with Use Case copy: Task 1, Step 3 (21+11+15+15 = 62). ✅
- Swatch still reflects live CSS custom property: Task 2, Step 1 (`background: var(${cssVar})`). ✅
- Accessible table markup (`<th>` headers): Task 2, Step 1 (`<thead>`/`<th>`). ✅
- No new tokens invented (no `accent-ai`/`accent-contrast`): not present anywhere in this plan — confirmed by omission. ✅
- Verification plan (tsc, integrity check, visual review): Task 1 Steps 5-6, Task 2 Steps 3-4. ✅
