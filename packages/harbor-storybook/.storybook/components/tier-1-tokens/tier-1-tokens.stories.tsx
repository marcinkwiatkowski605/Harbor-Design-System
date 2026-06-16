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
    <h2 style={{ ...tokens, fontWeight: 600, fontSize: 11, textTransform: 'uppercase' as const, letterSpacing: '0.06em', color: '#888', margin: '0 0 14px' }}>
      {title}
    </h2>
    {children}
  </div>
);

const Label = ({ children }: { children: React.ReactNode }) => (
  <span style={{ fontFamily: 'monospace', fontSize: 10, color: '#aaa', display: 'block', marginTop: 4, lineHeight: 1.3 }}>
    {children}
  </span>
);

// ─── Colors ──────────────────────────────────────────────────────────────────

const palettes = [
  { name: 'Pale Plum', base: '--ds-color-brand-pale-plum', steps: ['50','100','200','300','400','500','600','700','800','900','950'] },
  { name: 'Soft Orange', base: '--ds-color-brand-soft-orange', steps: ['50','100','200','300','400','500','600','700','800','900','950'] },
  { name: 'Neutral', base: '--ds-color-neutral', steps: ['50','100','200','300','400','500','600','700','800','900','950','black','white'] },
  { name: 'Utility Blue', base: '--ds-color-utility-blue', steps: ['50','100','200','300','400','500','600','700','800','900','950'] },
  { name: 'Utility Green', base: '--ds-color-utility-green', steps: ['50','100','200','300','400','500','600','700','800','900','950'] },
  { name: 'Utility Red', base: '--ds-color-utility-red', steps: ['50','100','200','300','400','500','600','700','800','900','950'] },
  { name: 'Utility Yellow', base: '--ds-color-utility-yellow', steps: ['50','100','200','300','400','500','600','700','800','900','950'] },
  { name: 'Black Alpha', base: '--ds-color-black-alpha', steps: ['25','90'] },
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

export const Typography: StoryObj = {
  render: () => (
    <div style={{ padding: 24, ...tokens }}>
      <Section title="Font Family">
        <div style={{ fontSize: 24, fontFamily: 'var(--ds-typography-font-family-sans, sans-serif)', marginBottom: 4 }}>
          Harbor Design System Aa Bb Cc
        </div>
        <Label>--ds-typography-font-family-sans</Label>
      </Section>

      <Section title="Font Size Scale">
        {fontSizeSteps.map(step => (
          <div key={step} style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginBottom: 10, paddingBottom: 10, borderBottom: '1px solid #f0f0f0' }}>
            <span style={{ fontFamily: 'monospace', fontSize: 10, color: '#bbb', width: 30, flexShrink: 0 }}>{step}</span>
            <span style={{ fontSize: `var(--ds-typography-font-size-${step})`, lineHeight: 1.1, color: '#111', whiteSpace: 'nowrap', overflow: 'hidden' }}>
              Harbor
            </span>
            <span style={{ fontFamily: 'monospace', fontSize: 10, color: '#ccc', marginLeft: 'auto', flexShrink: 0 }}>
              --ds-typography-font-size-{step}
            </span>
          </div>
        ))}
      </Section>

      <Section title="Font Weight">
        {(['regular', 'bold'] as const).map(w => (
          <div key={w} style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginBottom: 12 }}>
            <span style={{ fontFamily: 'monospace', fontSize: 10, color: '#bbb', width: 50, flexShrink: 0 }}>{w}</span>
            <span style={{ fontSize: 24, fontWeight: w === 'bold' ? 700 : 400, color: '#111' }}>
              Harbor Design System
            </span>
            <Label>--ds-typography-font-weight-{w}</Label>
          </div>
        ))}
      </Section>

      <Section title="Letter Spacing">
        {letterSpacingSteps.map(({ key, label }) => (
          <div key={key} style={{ marginBottom: 10, paddingBottom: 10, borderBottom: '1px solid #f0f0f0' }}>
            <span style={{ fontSize: 20, letterSpacing: `var(--ds-typography-letter-spacing-${key})`, color: '#111', display: 'block' }}>
              Harbor Design System
            </span>
            <Label>--ds-typography-letter-spacing-{key} ({label}%)</Label>
          </div>
        ))}
      </Section>
    </div>
  ),
};

// ─── Spacing ─────────────────────────────────────────────────────────────────

const spacingSteps = ['4','8','12','16','24','32','40','48','64','80','96','128'];

export const Spacing: StoryObj = {
  render: () => (
    <div style={{ padding: 24, ...tokens }}>
      <Section title="Spacing Scale">
        {spacingSteps.map(step => (
          <div key={step} style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 8 }}>
            <span style={{ fontFamily: 'monospace', fontSize: 10, color: '#bbb', width: 30, flexShrink: 0 }}>
              {step}
            </span>
            <div style={{
              height: 20,
              width: `var(--ds-spacing-${step})`,
              background: 'var(--ds-color-brand-pale-plum-400)',
              borderRadius: 2,
              minWidth: 2,
              flexShrink: 0,
            }} />
            <span style={{ fontFamily: 'monospace', fontSize: 10, color: '#ccc' }}>
              --ds-spacing-{step}
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
                background: 'var(--ds-color-brand-pale-plum-100)',
                border: '1px solid var(--ds-color-brand-pale-plum-300)',
                borderRadius: `var(--ds-border-radius-${step})`,
              }} />
              <Label>{step}</Label>
            </div>
          ))}
          <div style={{ textAlign: 'center' as const }}>
            <div style={{
              width: 64, height: 64,
              background: 'var(--ds-color-brand-pale-plum-100)',
              border: '1px solid var(--ds-color-brand-pale-plum-300)',
              borderRadius: 'var(--ds-border-radius-9999)',
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
                background: 'var(--ds-color-neutral-50)',
                border: `solid var(--ds-color-brand-pale-plum-500)`,
                borderWidth: `var(--ds-border-width-${step})`,
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
