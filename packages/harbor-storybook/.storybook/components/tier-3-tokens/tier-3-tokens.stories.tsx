import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
// Requires `npm run build:tokens` to have run first — this file is gitignored build output.
import tokensJson from '../../../../harbor-tokens/light/build/json/tokens.json';
// The DTCG source (pre-resolution) — read to show what a token *aliases*, since the
// built tokens.json above only has the final resolved value.
import designTokens from '../../../../../design_tokens.json';

const meta: Meta = {
  title: 'Foundations/Design Tokens/Tier 3: Component Tokens',
};
export default meta;

// tokens.json also contains non-string tokens elsewhere in the tree, so it can't be
// cast directly to Record<string, string> — bridge through `unknown`.
const buttonTokens = tokensJson as unknown as Record<string, string>;

const valueFor = (cssVar: string): string => {
  const name = cssVar.slice(2); // strip leading --
  const value = buttonTokens[name];
  if (value === undefined) {
    throw new Error(`Missing token value for ${cssVar} in tokens.json`);
  }
  return value;
};

// ─── Alias resolution (design_tokens.json → --ds-{tier}-* reference name) ──────

type DtcgNode = { $value?: unknown; [key: string]: unknown };

const TIER_BY_COLLECTION: Record<string, string> = {
  'primitive-brand-a': 'primitive',
  'primitive-global': 'primitive',
  'semantic-modes': 'semantic',
  'component-modes': 'component',
};

// Maps every token's dot-path (e.g. "color.brand.lavender.600") to the tier its
// collection belongs to, so an alias reference string can become the right
// --ds-{tier}-* name. A path ending in "@" (the Figma exporter's remap for a base
// value that collides with its own nested states — see config.js) is also indexed
// under its bare parent path, matching how aliases actually reference it.
const buildTierIndex = (raw: Record<string, unknown>): Map<string, string> => {
  const index = new Map<string, string>();
  const walk = (node: unknown, path: string[], tier: string) => {
    if (node === null || typeof node !== 'object') return;
    const obj = node as DtcgNode;
    if ('$value' in obj) {
      index.set(path.join('.'), tier);
      if (path[path.length - 1] === '@') {
        index.set(path.slice(0, -1).join('.'), tier);
      }
      return;
    }
    for (const [key, val] of Object.entries(obj)) {
      if (key.startsWith('$')) continue;
      walk(val, [...path, key], tier);
    }
  };
  for (const [collection, subtree] of Object.entries(raw)) {
    if (collection === '$extensions') continue;
    const tier = TIER_BY_COLLECTION[collection];
    if (!tier) continue;
    walk(subtree, [], tier);
  }
  return index;
};

const tierIndex = buildTierIndex(designTokens as unknown as Record<string, unknown>);

// Walks `segments` from the design_tokens.json root; if the final node has no
// $value of its own but has an "@" child, descends into that instead (same remap).
const resolveDtcgNode = (segments: string[]): DtcgNode | undefined => {
  let node: unknown = designTokens;
  for (const seg of segments) {
    if (node == null || typeof node !== 'object') return undefined;
    node = (node as DtcgNode)[seg];
  }
  if (node && typeof node === 'object' && !('$value' in (node as DtcgNode)) && '@' in (node as DtcgNode)) {
    node = (node as DtcgNode)['@'];
  }
  return node as DtcgNode | undefined;
};

const aliasFor = (segments: string[]): string | null => {
  const raw = resolveDtcgNode(segments)?.$value;
  if (typeof raw !== 'string') return null;
  const match = raw.match(/^\{(.+)\}$/);
  if (!match) return null;
  const tier = tierIndex.get(match[1]);
  if (!tier) return null;
  return `--ds-${tier}-${match[1].replace(/\./g, '-')}`;
};

// Value column shows the alias in italic muted text if one resolves, otherwise
// falls back to the raw resolved value (kept as a defensive case — every token in
// these tables is expected to be an alias, never a literal).
const AliasOrValue = ({ alias, fallback }: { alias: string | null; fallback: string }) => (
  <span style={{ fontFamily: 'monospace', fontSize: 11, fontStyle: alias ? 'italic' as const : 'normal' as const, color: alias ? '#666' : '#111' }}>
    {alias ?? fallback}
  </span>
);

// ─── Shared helpers ───────────────────────────────────────────────────────────

const baseStyle = { fontFamily: 'system-ui, sans-serif', fontSize: 12, color: '#111' };

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div style={{ marginBottom: 40 }}>
    <h2 style={{ ...baseStyle, fontWeight: 600, fontSize: 11, textTransform: 'uppercase' as const, letterSpacing: '0.06em', color: '#666', margin: '0 0 14px' }}>
      {title}
    </h2>
    {children}
  </div>
);

// ─── Token table (Preview | Name | Value) ─────────────────────────────────────

const TokenPreview = ({ cssVar }: { cssVar: string }) => (
  <div style={{
    width: 48, height: 24, borderRadius: 4,
    background: `var(${cssVar})`,
    border: '1px solid rgba(0,0,0,.07)',
    boxShadow: 'inset 0 0 0 1px rgba(0,0,0,.04)',
  }} />
);

type TableToken = { name: string; cssVar: string; path: string[] };

const TokenTableRow = ({ cssVar, path, showPreview }: TableToken & { showPreview: boolean }) => {
  const value = valueFor(cssVar);
  const alias = aliasFor(path);
  return (
    <tr>
      <td style={{ padding: '8px 12px', verticalAlign: 'middle' }}>
        {showPreview && <TokenPreview cssVar={cssVar} />}
      </td>
      <td style={{ padding: '8px 12px', verticalAlign: 'middle' }}>
        <code style={{
          fontFamily: 'monospace',
          fontSize: 11,
          color: '#1a56db',
          background: '#eef4ff',
          padding: '2px 6px',
          borderRadius: 4,
          wordBreak: 'break-all' as const,
        }}>{cssVar}</code>
      </td>
      <td style={{ padding: '8px 12px', verticalAlign: 'middle' }}>
        <AliasOrValue alias={alias} fallback={value} />
      </td>
    </tr>
  );
};

const BUTTON_TABLE_COLUMN_WIDTHS = ['96px', '460px', 'auto'];

const TokenTable = ({ tokens, showPreview = true }: { tokens: TableToken[]; showPreview?: boolean }) => (
  <table style={{ width: '100%', tableLayout: 'fixed' as const, borderCollapse: 'collapse' as const, ...baseStyle }}>
    <colgroup>
      {BUTTON_TABLE_COLUMN_WIDTHS.map((width, i) => (
        <col key={i} style={{ width }} />
      ))}
    </colgroup>
    <thead>
      <tr>
        {['Preview', 'Name', 'Value'].map(heading => (
          <th
            key={heading}
            style={{
              textAlign: 'left',
              padding: '8px 12px',
              fontSize: 11,
              fontWeight: 600,
              textTransform: 'uppercase' as const,
              letterSpacing: '0.04em',
              color: '#666',
              borderBottom: '1px solid #eee',
            }}
          >
            {heading}
          </th>
        ))}
      </tr>
    </thead>
    <tbody>
      {tokens.map(t => (
        <TokenTableRow key={t.cssVar} {...t} showPreview={showPreview} />
      ))}
    </tbody>
  </table>
);

// ─── Button ──────────────────────────────────────────────────────────────────

type ButtonVariant = 'primary' | 'secondary' | 'outline';

const variants: ButtonVariant[] = ['primary', 'secondary', 'outline'];
const states = ['enabled', 'hover', 'selected', 'focus', 'disabled'] as const;
type ButtonState = typeof states[number];
// `focus` isn't a real token — it reuses `enabled`'s value (see ButtonPreview below),
// so the reference tables list only the states that resolve to distinct tokens.
const tokenTableStates = ['enabled', 'hover', 'selected', 'disabled'] as const;

const variantLabel: Record<ButtonVariant, string> = {
  primary: 'Primary',
  secondary: 'Secondary',
  outline: 'Outline',
};

const ButtonPreview = ({ variant, state }: { variant: ButtonVariant; state: ButtonState }) => {
  // Focus has no color tokens of its own — it reuses the enabled look for every
  // role and adds the shared focus ring on top. Mirrors Button.css.
  const colorState = state === 'focus' ? 'enabled' : state;
  // Shared focus ring, from the semantic focus-ring tokens — matches Button.css :focus-visible.
  // Both layers' spread is measured from the same edge (matches Figma), so the
  // visible ring is ring-spread minus gap-spread, not their sum.
  const focusRing =
    'var(--ds-semantic-focus-ring-gap-x) var(--ds-semantic-focus-ring-gap-y) var(--ds-semantic-focus-ring-gap-blur) ' +
    'var(--ds-semantic-focus-ring-gap-spread) var(--ds-semantic-focus-ring-gap-color), ' +
    'var(--ds-semantic-focus-ring-ring-x) var(--ds-semantic-focus-ring-ring-y) var(--ds-semantic-focus-ring-ring-blur) ' +
    'var(--ds-semantic-focus-ring-ring-spread) var(--ds-semantic-focus-ring-ring-color)';
  const bgVar = `var(--ds-component-button-${variant}-color-background-${colorState})`;
  const contentVar = `var(--ds-component-button-${variant}-color-content-${colorState})`;
  const borderVar = variant === 'outline'
    ? `var(--ds-component-button-${variant}-color-border-${colorState})`
    : 'transparent';

  return (
    // A real <button disabled> instead of a styled <div> — the native disabled
    // attribute is what lets axe apply WCAG 1.4.3's inactive-component contrast
    // exception (matches Button.tsx; a div merely styled to look disabled doesn't
    // get that exception and shows as a false-positive contrast violation).
    <button
      type="button"
      disabled={state === 'disabled'}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        blockSize: 'var(--ds-component-button-height)',
        paddingInline: 'var(--ds-component-button-padding)',
        background: bgVar,
        color: contentVar,
        border: `var(--ds-component-button-border-width) solid ${borderVar}`,
        borderRadius: 'var(--ds-component-button-border-radius)',
        boxShadow: state === 'focus' ? focusRing : undefined,
        fontSize: 14,
        fontFamily: 'system-ui, sans-serif',
        fontWeight: 500,
        cursor: state === 'disabled' ? 'not-allowed' : 'default',
        minWidth: 80,
        userSelect: 'none' as const,
      }}
    >
      Button
    </button>
  );
};

export const Button: StoryObj = {
  render: () => (
    <div style={{ padding: 24, ...baseStyle }}>
      <Section title="Button variants × states">
        <table style={{ borderCollapse: 'collapse' as const, ...baseStyle }}>
          <thead>
            <tr>
              <th style={{ padding: '0 16px 12px 0', textAlign: 'left' as const, fontWeight: 600, fontSize: 11, color: '#666', textTransform: 'uppercase' as const }}>
                Variant
              </th>
              {states.map(s => (
                <th key={s} style={{ padding: '0 12px 12px', textAlign: 'center' as const, fontWeight: 600, fontSize: 11, color: '#666', textTransform: 'uppercase' as const }}>
                  {s}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {variants.map(variant => (
              <tr key={variant}>
                <td style={{ paddingRight: 16, paddingBottom: 12, fontFamily: 'monospace', fontSize: 11, color: '#666', verticalAlign: 'middle' as const }}>
                  {variantLabel[variant]}
                </td>
                {states.map(state => (
                  <td key={state} style={{ padding: '0 12px 12px', textAlign: 'center' as const, verticalAlign: 'middle' as const }}>
                    <ButtonPreview variant={variant} state={state} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </Section>

      <Section title="Shared button tokens">
        <TokenTable showPreview={false} tokens={[
          { name: 'border-radius', cssVar: '--ds-component-button-border-radius', path: ['component-modes', 'button', 'border', 'radius'] },
          { name: 'border-width', cssVar: '--ds-component-button-border-width', path: ['component-modes', 'button', 'border', 'width'] },
          { name: 'height', cssVar: '--ds-component-button-height', path: ['component-modes', 'button', 'height'] },
          { name: 'padding', cssVar: '--ds-component-button-padding', path: ['component-modes', 'button', 'padding'] },
        ]} />
      </Section>

      <Section title="Focus ring (shared, semantic)">
        <TokenTable showPreview={false} tokens={[
          { name: 'ring-color', cssVar: '--ds-semantic-focus-ring-ring-color', path: ['semantic-modes', 'focus-ring', 'ring', 'color'] },
          { name: 'ring-spread', cssVar: '--ds-semantic-focus-ring-ring-spread', path: ['semantic-modes', 'focus-ring', 'ring', 'spread'] },
          { name: 'ring-blur', cssVar: '--ds-semantic-focus-ring-ring-blur', path: ['semantic-modes', 'focus-ring', 'ring', 'blur'] },
          { name: 'gap-color', cssVar: '--ds-semantic-focus-ring-gap-color', path: ['semantic-modes', 'focus-ring', 'gap', 'color'] },
          { name: 'gap-spread', cssVar: '--ds-semantic-focus-ring-gap-spread', path: ['semantic-modes', 'focus-ring', 'gap', 'spread'] },
          { name: 'gap-blur', cssVar: '--ds-semantic-focus-ring-gap-blur', path: ['semantic-modes', 'focus-ring', 'gap', 'blur'] },
        ]} />
      </Section>

      {variants.map(variant => {
        const tokens: TableToken[] = tokenTableStates.flatMap(state =>
          (['background', 'content', ...(variant === 'outline' ? ['border'] : [])] as string[]).map(role => ({
            name: `${state} · ${role}`,
            cssVar: `--ds-component-button-${variant}-color-${role}-${state}`,
            path: ['component-modes', 'button', variant, 'color', role, state],
          }))
        );
        return (
          <Section key={variant} title={`${variantLabel[variant]} tokens`}>
            <TokenTable tokens={tokens} />
          </Section>
        );
      })}
    </div>
  ),
};
