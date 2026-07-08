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

// An empty key represents the base/default value, which carries no name suffix
// (e.g. --ds-semantic-color-background, not --ds-semantic-color-background-default).
const cssVarFor = (role: string, key: string): string =>
  key ? `--ds-semantic-color-${role}-${key}` : `--ds-semantic-color-${role}`;

const hexFor = (role: string, key: string): string => {
  const cssVarName = cssVarFor(role, key).slice(2);
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
      { key: '', useCase: 'Default background for pages, cards, and containers' },
      { key: 'hover', useCase: 'Hover color for the default background' },
      { key: 'selected', useCase: 'Selected color for the default background' },
      { key: 'disabled', useCase: 'Background for disabled controls and containers' },
      { key: 'subtle', useCase: 'Recessed, low-emphasis background' },
      { key: 'accent', useCase: 'Background for accent-emphasis elements' },
      { key: 'accent-hover', useCase: 'Hover color for `background-accent`' },
      { key: 'accent-selected', useCase: 'Selected color for `background-accent`' },
      { key: 'brand', useCase: 'Background for primary, brand-emphasis controls' },
      { key: 'brand-hover', useCase: 'Hover color for `background-brand`' },
      { key: 'brand-selected', useCase: 'Selected color for `background-brand`' },
      { key: 'error', useCase: 'Background for error or destructive states' },
      { key: 'error-hover', useCase: 'Hover color for `background-error`' },
      { key: 'error-selected', useCase: 'Selected color for `background-error`' },
      { key: 'info', useCase: 'Background for informational content' },
      { key: 'info-hover', useCase: 'Hover color for `background-info`' },
      { key: 'info-selected', useCase: 'Selected color for `background-info`' },
      { key: 'success', useCase: 'Background for success states' },
      { key: 'success-hover', useCase: 'Hover color for `background-success`' },
      { key: 'success-selected', useCase: 'Selected color for `background-success`' },
      { key: 'warning', useCase: 'Background for warnings' },
      { key: 'warning-hover', useCase: 'Hover color for `background-warning`' },
      { key: 'warning-selected', useCase: 'Selected color for `background-warning`' },
    ],
  },
  {
    role: 'border',
    contexts: [
      { key: '', useCase: 'Default border for containers and controls' },
      { key: 'hover', useCase: 'Hover color for the default border' },
      { key: 'selected', useCase: 'Selected color for the default border' },
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
      { key: '', useCase: 'Default text color for body copy and labels' },
      { key: 'secondary', useCase: 'Secondary, low-emphasis text' },
      { key: 'disabled', useCase: 'Text color for disabled controls and copy' },
      { key: 'accent', useCase: 'Text for accent-emphasis content' },
      { key: 'brand', useCase: 'Text for brand-emphasis or primary interactive content' },
      { key: 'error', useCase: 'Text communicating an error or destructive state' },
      { key: 'info', useCase: 'Text communicating informational content' },
      { key: 'success', useCase: 'Text communicating a success state' },
      { key: 'warning', useCase: 'Text communicating a warning' },
      { key: 'on-brand', useCase: 'Text on `background-brand` surfaces' },
      { key: 'on-accent', useCase: 'Text on `background-accent` surfaces' },
      { key: 'on-error', useCase: 'Text on `background-error` surfaces' },
      { key: 'on-info', useCase: 'Text on `background-info` surfaces' },
      { key: 'on-success', useCase: 'Text on `background-success` surfaces' },
      { key: 'on-warning', useCase: 'Text on `background-warning` surfaces' },
      { key: 'on-disabled', useCase: 'Text on `background-disabled` surfaces' },
    ],
  },
];

const ColorTableRow = ({ role, context }: { role: string; context: ColorContext }) => {
  const cssVar = cssVarFor(role, context.key);
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
                background: 'var(--ds-primitive-color-brand-lavender-100)',
                border: '1px solid var(--ds-primitive-color-brand-lavender-300)',
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
                border: `solid var(--ds-primitive-color-brand-lavender-500)`,
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
              background: 'var(--ds-semantic-color-background)',
              border: '1px solid var(--ds-semantic-color-border)',
              borderRadius: 4,
              margin: '8px 16px 14px',
              boxShadow: [
                // gap layer: x y blur spread color
                'var(--ds-semantic-focus-ring-gap-x) var(--ds-semantic-focus-ring-gap-y) var(--ds-semantic-focus-ring-gap-blur) var(--ds-semantic-focus-ring-gap-spread) var(--ds-semantic-focus-ring-gap-color)',
                // ring layer: spread is measured from the same edge as the gap layer
                // (matches Figma), so the visible ring is ring-spread minus gap-spread.
                'var(--ds-semantic-focus-ring-ring-x) var(--ds-semantic-focus-ring-ring-y) var(--ds-semantic-focus-ring-ring-blur) var(--ds-semantic-focus-ring-ring-spread) var(--ds-semantic-focus-ring-ring-color)',
              ].join(', '),
            }} />
            <TokenLabel>focus gap · --ds-semantic-focus-ring-gap-*</TokenLabel>
            <TokenLabel>focus ring · --ds-semantic-focus-ring-ring-*</TokenLabel>
          </div>
        </div>
      </Section>
    </div>
  ),
};
