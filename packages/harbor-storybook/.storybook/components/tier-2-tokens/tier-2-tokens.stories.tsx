import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
// Requires `npm run build:tokens` to have run first — this file is gitignored build output.
import tokensJson from '../../../../harbor-tokens/light/build/json/tokens.json';

const meta: Meta = {
  title: 'Foundations/Design Tokens/Tier 2: Semantic Tokens',
};
export default meta;

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

const TokenLabel = ({ children }: { children: React.ReactNode }) => (
  <span style={{ fontFamily: 'monospace', fontSize: 9, color: '#bbb', display: 'block', lineHeight: 1.4 }}>
    {children}
  </span>
);

// ─── Color ───────────────────────────────────────────────────────────────────

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

const colorGroups: ColorGroup[] = [
  {
    role: 'background',
    contexts: [
      { key: 'default', useCase: 'Default background for pages, cards, and containers' },
      { key: 'default-hover', useCase: 'Hover color for `background-default`' },
      { key: 'default-pressed', useCase: 'Pressed color for `background-default`' },
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
      { key: 'default-hover', useCase: 'Hover color for `border-default`' },
      { key: 'default-pressed', useCase: 'Pressed color for `border-default`' },
      { key: 'disabled', useCase: 'Border for disabled controls' },
      { key: 'accent', useCase: 'Border for accent-emphasis elements' },
      { key: 'brand', useCase: 'Border for brand-emphasis or selected controls' },
      { key: 'support-error', useCase: 'Border communicating an error or destructive state' },
      { key: 'support-info', useCase: 'Border communicating informational content' },
      { key: 'support-success', useCase: 'Border communicating a success state' },
      { key: 'support-warning', useCase: 'Border communicating a warning' },
      { key: 'focus', useCase: 'Visible focus indicator' },
    ],
  },
  {
    role: 'content',
    contexts: [
      { key: 'default', useCase: 'Default text color for body copy and labels' },
      { key: 'default-hover', useCase: 'Hover color for `content-default`' },
      { key: 'disabled', useCase: 'Text color for disabled controls and copy' },
      { key: 'subtle', useCase: 'Secondary, low-emphasis text' },
      { key: 'inverse', useCase: 'Text on inverse (dark) backgrounds' },
      { key: 'accent', useCase: 'Text for accent-emphasis content' },
      { key: 'brand', useCase: 'Text for brand-emphasis or primary interactive content' },
      { key: 'support-error', useCase: 'Text communicating an error or destructive state' },
      { key: 'support-info', useCase: 'Text communicating informational content' },
      { key: 'support-success', useCase: 'Text communicating a success state' },
      { key: 'support-warning', useCase: 'Text communicating a warning' },
      { key: 'support-on-error-subtle', useCase: 'Text on `background-support-error-subtle` surfaces' },
      { key: 'support-on-info-subtle', useCase: 'Text on `background-support-info-subtle` surfaces' },
      { key: 'support-on-success-subtle', useCase: 'Text on `background-support-success-subtle` surfaces' },
      { key: 'support-on-warning-subtle', useCase: 'Text on `background-support-warning-subtle` surfaces' },
    ],
  },
];

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
          wordBreak: 'break-all' as const,
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

// Fixed per-column widths so every role's table (background/border/content) lines
// up identically, regardless of how long that table's own content happens to be.
const COLOR_TABLE_COLUMN_WIDTHS = ['96px', '420px', '90px', 'auto'];

const ColorTable = ({ role, contexts }: { role: string; contexts: ColorContext[] }) => (
  <table style={{ width: '100%', tableLayout: 'fixed' as const, borderCollapse: 'collapse' as const, ...baseStyle }}>
    <colgroup>
      {COLOR_TABLE_COLUMN_WIDTHS.map((width, i) => (
        <col key={i} style={{ width }} />
      ))}
    </colgroup>
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

// ─── Typography ───────────────────────────────────────────────────────────────

type TypographyStyle = { key: string; label: string };

const typographyStyles: TypographyStyle[] = [
  { key: 'display-default', label: 'Display' },
  { key: 'heading-2xl', label: 'Heading 2XL' },
  { key: 'heading-xl', label: 'Heading XL' },
  { key: 'heading-lg', label: 'Heading LG' },
  { key: 'heading-md', label: 'Heading MD' },
  { key: 'heading-sm', label: 'Heading SM' },
  { key: 'heading-xs', label: 'Heading XS' },
  { key: 'body-lg', label: 'Body LG' },
  { key: 'body-md', label: 'Body MD' },
  { key: 'body-sm', label: 'Body SM' },
  { key: 'label-lg', label: 'Label LG' },
  { key: 'label-md', label: 'Label MD' },
  { key: 'label-sm', label: 'Label SM' },
];

export const Typography: StoryObj = {
  render: () => (
    <div style={{ padding: 24, ...baseStyle }}>
      <Section title="Type Scale">
        {typographyStyles.map(({ key, label }) => {
          const prefix = `--ds-semantic-typography-${key}`;
          return (
            <div key={key} style={{ display: 'flex', alignItems: 'baseline', gap: 20, marginBottom: 14, paddingBottom: 14, borderBottom: '1px solid #f5f5f5' }}>
              <span style={{ width: 96, fontFamily: 'monospace', fontSize: 9, color: '#bbb', flexShrink: 0, alignSelf: 'center' }}>
                {label}
              </span>
              <span style={{
                fontFamily: `var(${prefix}-font-family)`,
                fontSize: `var(${prefix}-font-size)`,
                fontWeight: `var(${prefix}-font-weight)` as any,
                fontStyle: `var(${prefix}-font-style)` as any,
                letterSpacing: `var(${prefix}-letter-spacing)`,
                lineHeight: `var(${prefix}-line-height)`,
                textTransform: `var(${prefix}-text-transform)` as any,
                color: '#111',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
              }}>
                Harbor Design System
              </span>
              <span style={{ fontFamily: 'monospace', fontSize: 9, color: '#ccc', marginLeft: 'auto', flexShrink: 0 }}>
                {prefix}-*
              </span>
            </div>
          );
        })}
      </Section>
    </div>
  ),
};

// ─── Border & Shadow ─────────────────────────────────────────────────────────

const borderRadiusSizes = ['sharp', 'sm', 'md', 'lg'];
const borderWidthSizes = ['none', 'sm', 'md', 'lg'];

export const BorderAndShadow: StoryObj = {
  name: 'Border & Shadow',
  render: () => (
    <div style={{ padding: 24, ...baseStyle }}>
      <Section title="Border Radius">
        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          {borderRadiusSizes.map(size => (
            <div key={size} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' as const }}>
              <div style={{
                width: 72, height: 72,
                background: 'var(--ds-primitive-color-brand-pale-plum-100)',
                border: '1px solid var(--ds-primitive-color-brand-pale-plum-300)',
                borderRadius: `var(--ds-semantic-border-radius-${size})`,
                marginBottom: 6,
              }} />
              <TokenLabel>{size}</TokenLabel>
              <TokenLabel>--ds-semantic-border-radius-{size}</TokenLabel>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Border Width">
        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          {borderWidthSizes.map(size => (
            <div key={size} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' as const }}>
              <div style={{
                width: 72, height: 72,
                background: 'var(--ds-primitive-color-neutral-50)',
                border: `solid var(--ds-primitive-color-brand-pale-plum-500)`,
                borderWidth: `var(--ds-semantic-border-width-${size})`,
                borderRadius: 4,
                boxSizing: 'border-box' as const,
                marginBottom: 6,
              }} />
              <TokenLabel>{size}</TokenLabel>
              <TokenLabel>--ds-semantic-border-width-{size}</TokenLabel>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Shadow">
        <div style={{ display: 'flex', gap: 40, flexWrap: 'wrap' }}>
          {(['sm', 'md'] as const).map(size => (
            <div key={size} style={{ textAlign: 'center' as const }}>
              <div style={{
                width: 96, height: 80,
                background: '#fff',
                borderRadius: 8,
                boxShadow: `var(--ds-semantic-shadow-${size})`,
                border: '1px solid rgba(0,0,0,.04)',
                margin: '8px 16px',
              }} />
              <TokenLabel>{size}</TokenLabel>
              <TokenLabel>--ds-semantic-shadow-{size}</TokenLabel>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Focus Ring">
        <div style={{ display: 'flex', gap: 24 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' as const }}>
            <div style={{
              width: 120, height: 40,
              background: 'var(--ds-semantic-color-background-default)',
              border: '1px solid var(--ds-semantic-color-border-default)',
              borderRadius: 4,
              margin: '8px 16px 14px',
              boxShadow: [
                // gap layer: x y blur spread color
                'var(--ds-semantic-focus-gap-x) var(--ds-semantic-focus-gap-y) var(--ds-semantic-focus-gap-blur) var(--ds-semantic-focus-gap-spread) var(--ds-semantic-focus-gap-color)',
                // ring layer offset by the gap spread so both rings are visible
                'var(--ds-semantic-focus-ring-x) var(--ds-semantic-focus-ring-y) var(--ds-semantic-focus-ring-blur) calc(var(--ds-semantic-focus-gap-spread) + var(--ds-semantic-focus-ring-spread)) var(--ds-semantic-focus-ring-color)',
              ].join(', '),
            }} />
            <TokenLabel>focus gap · --ds-semantic-focus-gap-*</TokenLabel>
            <TokenLabel>focus ring · --ds-semantic-focus-ring-*</TokenLabel>
          </div>
        </div>
      </Section>
    </div>
  ),
};
