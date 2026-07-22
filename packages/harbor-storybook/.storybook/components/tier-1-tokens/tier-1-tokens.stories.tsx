import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta = {
  title: 'Foundations/Design Tokens/Tier 1: Primitive Tokens',
};
export default meta;

// ─── Shared layout helpers ────────────────────────────────────────────────────

const tokens = { fontFamily: 'system-ui, sans-serif', fontSize: 12, color: '#111' };

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div style={{ marginBottom: 40 }}>
    <h2 style={{ ...tokens, fontWeight: 600, fontSize: 11, textTransform: 'uppercase' as const, letterSpacing: '0.06em', color: '#666', margin: '0 0 14px' }}>
      {title}
    </h2>
    {children}
  </div>
);

const Label = ({ children }: { children: React.ReactNode }) => (
  <span style={{ fontFamily: 'monospace', fontSize: 11, color: '#666', display: 'block', marginTop: 4, lineHeight: 1.3 }}>
    {children}
  </span>
);

// ─── Colors ──────────────────────────────────────────────────────────────────

const palettes = [
  { name: 'Lavender', base: '--ds-primitive-color-brand-lavender', steps: ['50','100','200','300','400','500','600','700','800','900','950'] },
  { name: 'Orange', base: '--ds-primitive-color-brand-orange', steps: ['50','100','200','300','400','500','600','700','800','900','950'] },
  { name: 'Neutral', base: '--ds-primitive-color-neutral', steps: ['50','100','200','300','400','500','600','700','800','900','950','black','white'] },
  { name: 'Utility Blue', base: '--ds-primitive-color-utility-blue', steps: ['50','100','200','300','400','500','600','700','800','900','950'] },
  { name: 'Utility Green', base: '--ds-primitive-color-utility-green', steps: ['50','100','200','300','400','500','600','700','800','900','950'] },
  { name: 'Utility Red', base: '--ds-primitive-color-utility-red', steps: ['50','100','200','300','400','500','600','700','800','900','950'] },
  { name: 'Utility Yellow', base: '--ds-primitive-color-utility-yellow', steps: ['50','100','200','300','400','500','600','700','800','900','950'] },
  { name: 'Black Alpha', base: '--ds-primitive-color-black-alpha', steps: ['25','90'] },
];

export const Colors: StoryObj = {
  render: () => (
    <div style={{ padding: 24, ...tokens }}>
      {palettes.map(({ name, base, steps }) => (
        <Section key={name} title={name}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {steps.map(step => {
              const cssVar = `${base}-${step}`;
              return (
                <div key={step} style={{ width: 72 }}>
                  <div style={{
                    width: 72, height: 56,
                    background: `var(${cssVar})`,
                    borderRadius: 4,
                    border: '1px solid rgba(0,0,0,.08)',
                  }} />
                  <Label>{step}</Label>
                </div>
              );
            })}
          </div>
          <Label>{base}-*</Label>
        </Section>
      ))}
    </div>
  ),
};

// ─── Typography ───────────────────────────────────────────────────────────────

const fontSizeSteps = ['12','14','16','18','20','24','28','32','40','48','56','64','96'];
const letterSpacingSteps = [
  { key: 'minus-2', label: '-2' },
  { key: 'minus-1-half', label: '-1.5' },
  { key: 'minus-1', label: '-1' },
  { key: 'minus-half', label: '-0.5' },
  { key: '0', label: '0' },
  { key: 'half', label: '+0.5' },
  { key: '2', label: '+2' },
];
const lineHeightSteps = ['16','20','24','28','32','36','40','48','56','64','72','110'];
const fontStyleSteps = ['normal', 'italic'];
const textDecorationSteps = ['none', 'underline'];
const textTransformSteps = ['none', 'uppercase'];

export const Typography: StoryObj = {
  render: () => (
    <div style={{ padding: 24, ...tokens }}>
      <Section title="Font Family">
        <div style={{ fontSize: 24, fontFamily: 'var(--ds-primitive-typography-font-family-sans, sans-serif)', marginBottom: 4 }}>
          Harbor Design System Aa Bb Cc
        </div>
        <Label>--ds-primitive-typography-font-family-sans</Label>
      </Section>

      <Section title="Font Size Scale">
        {fontSizeSteps.map(step => (
          <div key={step} style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginBottom: 10, paddingBottom: 10, borderBottom: '1px solid #f0f0f0' }}>
            <span style={{ fontFamily: 'monospace', fontSize: 11, color: '#666', width: 30, flexShrink: 0 }}>{step}</span>
            <span style={{ fontSize: `var(--ds-primitive-typography-font-size-${step})`, lineHeight: 1.1, color: '#111', whiteSpace: 'nowrap', overflow: 'hidden' }}>
              Harbor
            </span>
            <span style={{ fontFamily: 'monospace', fontSize: 11, color: '#666', marginLeft: 'auto', flexShrink: 0 }}>
              --ds-primitive-typography-font-size-{step}
            </span>
          </div>
        ))}
      </Section>

      <Section title="Font Weight">
        {(['regular', 'bold'] as const).map(w => (
          <div key={w} style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginBottom: 12 }}>
            <span style={{ fontFamily: 'monospace', fontSize: 11, color: '#666', width: 50, flexShrink: 0 }}>{w}</span>
            <span style={{ fontSize: 24, fontWeight: w === 'bold' ? 700 : 400, color: '#111' }}>
              Harbor Design System
            </span>
            <Label>--ds-primitive-typography-font-weight-{w}</Label>
          </div>
        ))}
      </Section>

      <Section title="Letter Spacing">
        {letterSpacingSteps.map(({ key, label }) => (
          <div key={key} style={{ marginBottom: 10, paddingBottom: 10, borderBottom: '1px solid #f0f0f0' }}>
            <span style={{ fontSize: 20, letterSpacing: `var(--ds-primitive-typography-letter-spacing-${key})`, color: '#111', display: 'block' }}>
              Harbor Design System
            </span>
            <Label>--ds-primitive-typography-letter-spacing-{key} ({label}%)</Label>
          </div>
        ))}
      </Section>

      <Section title="Line Height">
        {lineHeightSteps.map(step => (
          <div key={step} style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 8 }}>
            <span style={{ fontFamily: 'monospace', fontSize: 11, color: '#666', width: 30, flexShrink: 0, paddingTop: 4 }}>{step}</span>
            <div style={{
              background: 'var(--ds-primitive-color-brand-lavender-100)',
              borderLeft: '2px solid var(--ds-primitive-color-brand-lavender-400)',
              paddingLeft: 8,
            }}>
              <span style={{ fontSize: 16, lineHeight: `var(--ds-primitive-typography-line-height-${step})`, color: '#111', display: 'block' }}>
                Harbor Design System<br />two lines of text
              </span>
            </div>
            <span style={{ fontFamily: 'monospace', fontSize: 11, color: '#666', marginLeft: 'auto', flexShrink: 0 }}>
              --ds-primitive-typography-line-height-{step}
            </span>
          </div>
        ))}
      </Section>

      <Section title="Font Style">
        {fontStyleSteps.map(s => (
          <div key={s} style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginBottom: 12 }}>
            <span style={{ fontFamily: 'monospace', fontSize: 11, color: '#666', width: 70, flexShrink: 0 }}>{s}</span>
            <span style={{ fontSize: 24, fontStyle: `var(--ds-primitive-typography-font-style-${s})`, color: '#111' }}>
              Harbor Design System
            </span>
            <Label>--ds-primitive-typography-font-style-{s}</Label>
          </div>
        ))}
      </Section>

      <Section title="Text Decoration">
        {textDecorationSteps.map(s => (
          <div key={s} style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginBottom: 12 }}>
            <span style={{ fontFamily: 'monospace', fontSize: 11, color: '#666', width: 70, flexShrink: 0 }}>{s}</span>
            <span style={{ fontSize: 24, textDecoration: `var(--ds-primitive-typography-text-decoration-${s})`, color: '#111' }}>
              Harbor Design System
            </span>
            <Label>--ds-primitive-typography-text-decoration-{s}</Label>
          </div>
        ))}
      </Section>

      <Section title="Text Transform">
        {textTransformSteps.map(s => (
          <div key={s} style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginBottom: 12 }}>
            <span style={{ fontFamily: 'monospace', fontSize: 11, color: '#666', width: 70, flexShrink: 0 }}>{s}</span>
            <span style={{ fontSize: 24, textTransform: `var(--ds-primitive-typography-text-transform-${s})`, color: '#111' }}>
              Harbor Design System
            </span>
            <Label>--ds-primitive-typography-text-transform-{s}</Label>
          </div>
        ))}
      </Section>
    </div>
  ),
};

// ─── Dimension ───────────────────────────────────────────────────────────────

const dimensionSteps = ['4','8','12','16','24','32','40','48','64','80','96','128'];

export const Dimension: StoryObj = {
  render: () => (
    <div style={{ padding: 24, ...tokens }}>
      <Section title="Dimension Scale">
        {dimensionSteps.map(step => (
          <div key={step} style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 8 }}>
            <span style={{ fontFamily: 'monospace', fontSize: 11, color: '#666', width: 30, flexShrink: 0 }}>
              {step}
            </span>
            <div style={{
              height: 20,
              width: `var(--ds-primitive-dimension-${step})`,
              background: 'var(--ds-primitive-color-brand-lavender-400)',
              borderRadius: 2,
              minWidth: 2,
              flexShrink: 0,
            }} />
            <span style={{ fontFamily: 'monospace', fontSize: 11, color: '#666' }}>
              --ds-primitive-dimension-{step}
            </span>
          </div>
        ))}
      </Section>
    </div>
  ),
};

// ─── Borders ─────────────────────────────────────────────────────────────────

const radiusSteps = ['0','2','4','8','12','16','24','32','48'];
const widthSteps = ['0','1','2','4','8'];

export const Borders: StoryObj = {
  render: () => (
    <div style={{ padding: 24, ...tokens }}>
      <Section title="Border Radius">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'flex-end' }}>
          {radiusSteps.map(step => (
            <div key={step} style={{ textAlign: 'center' as const }}>
              <div style={{
                width: 64, height: 64,
                background: 'var(--ds-primitive-color-brand-lavender-100)',
                border: '1px solid var(--ds-primitive-color-brand-lavender-300)',
                borderRadius: `var(--ds-primitive-border-radius-${step})`,
              }} />
              <Label>{step}</Label>
            </div>
          ))}
          <div style={{ textAlign: 'center' as const }}>
            <div style={{
              width: 64, height: 64,
              background: 'var(--ds-primitive-color-brand-lavender-100)',
              border: '1px solid var(--ds-primitive-color-brand-lavender-300)',
              borderRadius: 'var(--ds-primitive-border-radius-9999)',
            }} />
            <Label>full</Label>
          </div>
        </div>
      </Section>

      <Section title="Border Width">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, alignItems: 'flex-end' }}>
          {widthSteps.map(step => (
            <div key={step} style={{ textAlign: 'center' as const }}>
              <div style={{
                width: 64, height: 64,
                background: 'var(--ds-primitive-color-neutral-50)',
                border: `solid var(--ds-primitive-color-brand-lavender-500)`,
                borderWidth: `var(--ds-primitive-border-width-${step})`,
                borderRadius: 4,
                boxSizing: 'border-box' as const,
              }} />
              <Label>{step}px</Label>
            </div>
          ))}
        </div>
      </Section>
    </div>
  ),
};

// ─── Shadow primitives ─────────────────────────────────────────────────────────

// Raw building blocks (offset / blur / spread) composed into Tier 2 shadow tokens.
// Each primitive is isolated in one position of a box-shadow so its effect is visible.
type ShadowDim = 'x' | 'y' | 'blur' | 'spread';

const shadowGroups: { group: string; dim: ShadowDim; tokens: string[] }[] = [
  { group: 'Offset X', dim: 'x', tokens: ['--ds-primitive-shadow-x-0'] },
  { group: 'Offset Y', dim: 'y', tokens: ['--ds-primitive-shadow-y-0', '--ds-primitive-shadow-y-4', '--ds-primitive-shadow-y-8'] },
  { group: 'Blur', dim: 'blur', tokens: ['--ds-primitive-shadow-blur-0', '--ds-primitive-shadow-blur-4', '--ds-primitive-shadow-blur-8'] },
  { group: 'Spread', dim: 'spread', tokens: ['--ds-primitive-shadow-spread-minus-4', '--ds-primitive-shadow-spread-0', '--ds-primitive-shadow-spread-2', '--ds-primitive-shadow-spread-4'] },
];

const shadowFor = (dim: ShadowDim, cssVar: string): string => {
  const v = `var(${cssVar})`;
  const c = 'rgba(0,0,0,.35)';
  switch (dim) {
    case 'x': return `${v} 4px 8px 0 ${c}`;
    case 'y': return `0 ${v} 8px 0 ${c}`;
    case 'blur': return `0 4px ${v} 0 ${c}`;
    case 'spread': return `0 4px 6px ${v} ${c}`;
  }
};

export const Shadows: StoryObj = {
  render: () => (
    <div style={{ padding: 24, ...tokens }}>
      <p style={{ ...tokens, color: '#666', margin: '0 0 24px', maxWidth: 540, lineHeight: 1.5 }}>
        Tier 1 shadow primitives are the raw offset, blur, and spread building blocks.
        Each is shown isolated in one box-shadow position; they are composed into the
        ready-to-use <code>--ds-semantic-shadow-*</code> tokens in Tier 2.
      </p>
      {shadowGroups.map(({ group, dim, tokens: list }) => (
        <Section key={group} title={group}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 32 }}>
            {list.map(cssVar => (
              <div key={cssVar} style={{ textAlign: 'center' as const }}>
                <div style={{
                  width: 72, height: 56,
                  background: '#fff',
                  borderRadius: 6,
                  boxShadow: shadowFor(dim, cssVar),
                  margin: '6px 12px',
                }} />
                <Label>{cssVar}</Label>
              </div>
            ))}
          </div>
        </Section>
      ))}
    </div>
  ),
};
