import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

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

type ColorGroup = { role: string; contexts: string[] };

const colorGroups: ColorGroup[] = [
  {
    role: 'background',
    contexts: [
      'default','hover','pressed','disabled','subtle',
      'accent-default','accent-hover','accent-pressed','accent-subtle',
      'brand-default','brand-hover','brand-pressed','brand-subtle',
      'support-error-strong','support-error-subtle',
      'support-info-strong','support-info-subtle',
      'support-success-strong','support-success-subtle',
      'support-warning-strong','support-warning-subtle',
    ],
  },
  {
    role: 'border',
    contexts: ['default','hover','pressed','disabled','accent','brand','error','info','success','warning','focus'],
  },
  {
    role: 'content',
    contexts: ['default','hover','disabled','subtle','inverse','accent','brand','error','info','success','warning','on-error-subtle','on-info-subtle','on-success-subtle','on-warning-subtle'],
  },
  {
    role: 'icon',
    contexts: ['default','hover','disabled','subtle','inverse','accent','brand','error','info','success','warning','on-error','on-info','on-success','on-warning'],
  },
];

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

export const Color: StoryObj = {
  render: () => (
    <div style={{ padding: 24, ...baseStyle }}>
      {colorGroups.map(({ role, contexts }) => (
        <Section key={role} title={`Color · ${role}`}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: 8 }}>
            {contexts.map(ctx => {
              const cssVar = `--ds-semantic-color-${role}-${ctx}`;
              return (
                <ColorSwatch key={ctx} cssVar={cssVar} label={ctx} />
              );
            })}
          </div>
          <TokenLabel>--ds-semantic-color-{role}-*</TokenLabel>
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
