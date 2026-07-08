import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
// Requires `npm run build:tokens` to have run first — this file is gitignored build output.
import tokensJson from '../../../../harbor-tokens/light/build/json/tokens.json';

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

const isHexColor = (value: string): boolean => /^#[0-9a-fA-F]{3,8}$/.test(value);

// ─── Shared helpers ───────────────────────────────────────────────────────────

const baseStyle = { fontFamily: 'system-ui, sans-serif', fontSize: 12, color: '#111' };

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div style={{ marginBottom: 40 }}>
    <h2 style={{ ...baseStyle, fontWeight: 600, fontSize: 11, textTransform: 'uppercase' as const, letterSpacing: '0.06em', color: '#888', margin: '0 0 14px' }}>
      {title}
    </h2>
    {children}
  </div>
);

// ─── Token table (Name | Value | Preview) ─────────────────────────────────────

const dimensionPreviews: { test: (cssVar: string) => boolean; render: (cssVar: string) => React.ReactNode }[] = [
  {
    test: (v) => v.endsWith('border-radius'),
    render: (cssVar) => (
      <div style={{ width: 40, height: 40, background: '#e6e2ff', border: '1px solid #b7a9ff', borderRadius: `var(${cssVar})` }} />
    ),
  },
  {
    test: (v) => v.endsWith('border-width'),
    render: (cssVar) => (
      <div style={{ width: 40, height: 40, borderStyle: 'solid', borderColor: '#834dff', borderWidth: `var(${cssVar})`, boxSizing: 'border-box' as const }} />
    ),
  },
  {
    test: (v) => v.endsWith('height'),
    render: (cssVar) => (
      <div style={{ width: 24, height: `var(${cssVar})`, background: '#834dff', borderRadius: 2 }} />
    ),
  },
  {
    test: (v) => v.endsWith('padding'),
    render: (cssVar) => (
      <div style={{ display: 'inline-flex', padding: `var(${cssVar})`, background: '#f3f2ff', border: '1px solid #d3cdff', borderRadius: 4 }}>
        <div style={{ width: 16, height: 16, background: '#834dff', borderRadius: 2 }} />
      </div>
    ),
  },
  {
    test: (v) => v.endsWith('spread'),
    render: (cssVar) => (
      <div style={{ width: 24, height: 24, background: '#fff', boxShadow: `0 0 0 var(${cssVar}) #909aa1` }} />
    ),
  },
  {
    test: (v) => v.endsWith('blur'),
    render: (cssVar) => (
      <div style={{ width: 24, height: 24, background: '#fff', boxShadow: `0 0 var(${cssVar}) 2px #909aa1` }} />
    ),
  },
];

const DimensionPreview = ({ cssVar, value }: { cssVar: string; value: string }) => {
  const match = dimensionPreviews.find(({ test }) => test(cssVar));
  return (
    <div style={{ width: 48, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {match ? match.render(cssVar) : <span style={{ fontFamily: 'monospace', fontSize: 10, color: '#888' }}>{value}</span>}
    </div>
  );
};

const TokenPreview = ({ cssVar, value }: { cssVar: string; value: string }) => (
  isHexColor(value)
    ? (
      <div style={{
        width: 48, height: 24, borderRadius: 4,
        background: `var(${cssVar})`,
        border: '1px solid rgba(0,0,0,.07)',
        boxShadow: 'inset 0 0 0 1px rgba(0,0,0,.04)',
      }} />
    )
    : <DimensionPreview cssVar={cssVar} value={value} />
);

type TableToken = { name: string; cssVar: string };

const TokenTableRow = ({ name, cssVar }: TableToken) => {
  const value = valueFor(cssVar);
  return (
    <tr>
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
      <td style={{ padding: '8px 12px', verticalAlign: 'middle', fontFamily: 'monospace', fontSize: 11, color: '#111' }}>
        {value}
      </td>
      <td style={{ padding: '8px 12px', verticalAlign: 'middle' }}>
        <TokenPreview cssVar={cssVar} value={value} />
      </td>
    </tr>
  );
};

const BUTTON_TABLE_COLUMN_WIDTHS = ['460px', '90px', 'auto'];

const TokenTable = ({ tokens }: { tokens: TableToken[] }) => (
  <table style={{ width: '100%', tableLayout: 'fixed' as const, borderCollapse: 'collapse' as const, ...baseStyle }}>
    <colgroup>
      {BUTTON_TABLE_COLUMN_WIDTHS.map((width, i) => (
        <col key={i} style={{ width }} />
      ))}
    </colgroup>
    <thead>
      <tr>
        {['Name', 'Value', 'Preview'].map(heading => (
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
      {tokens.map(t => (
        <TokenTableRow key={t.cssVar} {...t} />
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
    <div style={{
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
    }}>
      Button
    </div>
  );
};

export const Button: StoryObj = {
  render: () => (
    <div style={{ padding: 24, ...baseStyle }}>
      <Section title="Button variants × states">
        <table style={{ borderCollapse: 'collapse' as const, ...baseStyle }}>
          <thead>
            <tr>
              <th style={{ padding: '0 16px 12px 0', textAlign: 'left' as const, fontWeight: 600, fontSize: 10, color: '#888', textTransform: 'uppercase' as const }}>
                Variant
              </th>
              {states.map(s => (
                <th key={s} style={{ padding: '0 12px 12px', textAlign: 'center' as const, fontWeight: 600, fontSize: 10, color: '#888', textTransform: 'uppercase' as const }}>
                  {s}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {variants.map(variant => (
              <tr key={variant}>
                <td style={{ paddingRight: 16, paddingBottom: 12, fontFamily: 'monospace', fontSize: 10, color: '#aaa', verticalAlign: 'middle' as const }}>
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
        <TokenTable tokens={[
          { name: 'border-radius', cssVar: '--ds-component-button-border-radius' },
          { name: 'border-width', cssVar: '--ds-component-button-border-width' },
          { name: 'height', cssVar: '--ds-component-button-height' },
          { name: 'padding', cssVar: '--ds-component-button-padding' },
        ]} />
      </Section>

      <Section title="Focus ring (shared, semantic)">
        <TokenTable tokens={[
          { name: 'ring-color', cssVar: '--ds-semantic-focus-ring-ring-color' },
          { name: 'ring-spread', cssVar: '--ds-semantic-focus-ring-ring-spread' },
          { name: 'ring-blur', cssVar: '--ds-semantic-focus-ring-ring-blur' },
          { name: 'gap-color', cssVar: '--ds-semantic-focus-ring-gap-color' },
          { name: 'gap-spread', cssVar: '--ds-semantic-focus-ring-gap-spread' },
          { name: 'gap-blur', cssVar: '--ds-semantic-focus-ring-gap-blur' },
        ]} />
      </Section>

      {variants.map(variant => {
        const tokens: TableToken[] = tokenTableStates.flatMap(state =>
          (['background', 'content', ...(variant === 'outline' ? ['border'] : [])] as string[]).map(role => ({
            name: `${state} · ${role}`,
            cssVar: `--ds-component-button-${variant}-color-${role}-${state}`,
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
