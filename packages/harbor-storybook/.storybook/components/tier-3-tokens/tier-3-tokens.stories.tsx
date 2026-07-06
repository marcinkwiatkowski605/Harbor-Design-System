import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta = {
  title: 'Foundations/Design Tokens/Tier 3: Component Tokens',
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

const TokenRow = ({ name, cssVar }: { name: string; cssVar: string }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '6px 0', borderBottom: '1px solid #f5f5f5' }}>
    <span style={{ fontFamily: 'monospace', fontSize: 10, color: '#888', flex: 1 }}>{name}</span>
    <span style={{ fontFamily: 'monospace', fontSize: 10, color: '#bbb' }}>{cssVar}</span>
  </div>
);

// ─── Button ──────────────────────────────────────────────────────────────────

type ButtonVariant = 'primary' | 'secondary' | 'outline';

const variants: ButtonVariant[] = ['primary', 'secondary', 'outline'];
const states = ['enabled', 'hover', 'pressed', 'loading', 'disabled'] as const;
type ButtonState = typeof states[number];

const variantLabel: Record<ButtonVariant, string> = {
  primary: 'Primary',
  secondary: 'Secondary',
  outline: 'Outline',
};

const ButtonPreview = ({ variant, state }: { variant: ButtonVariant; state: ButtonState }) => {
  // Outline keeps its enabled (white) background when disabled — only border and
  // content drop to their disabled tokens. Mirrors Button.css, not just the raw token name.
  const bgState = variant === 'outline' && state === 'disabled' ? 'enabled' : state;
  const bgVar = `var(--ds-component-button-${variant}-color-background-${bgState})`;
  const contentVar = `var(--ds-component-button-${variant}-color-content-${state})`;
  const borderVar = variant === 'outline'
    ? `var(--ds-component-button-${variant}-color-border-${state})`
    : 'transparent';

  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'var(--ds-component-button-padding-vertical) var(--ds-component-button-padding-horizontal)',
      background: bgVar,
      color: contentVar,
      border: `var(--ds-component-button-border-width) solid ${borderVar}`,
      borderRadius: 'var(--ds-component-button-border-radius)',
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
        <TokenRow name="border-radius" cssVar="--ds-component-button-border-radius" />
        <TokenRow name="border-width" cssVar="--ds-component-button-border-width" />
        <TokenRow name="padding-horizontal" cssVar="--ds-component-button-padding-horizontal" />
        <TokenRow name="padding-vertical" cssVar="--ds-component-button-padding-vertical" />
      </Section>

      {variants.map(variant => (
        <Section key={variant} title={`${variantLabel[variant]} tokens`}>
          {states.map(state => (
            <div key={state}>
              {(['background', 'content', ...(variant === 'outline' ? ['border'] : [])] as string[]).map(role => {
                // Outline's disabled background resolves through the enabled token, not
                // a dedicated disabled one — mirrors Button.css and Button.mdx.
                const tokenState = variant === 'outline' && role === 'background' && state === 'disabled' ? 'enabled' : state;
                const cssVar = `--ds-component-button-${variant}-color-${role}-${tokenState}`;
                return <TokenRow key={role} name={`${state} · ${role}`} cssVar={cssVar} />;
              })}
            </div>
          ))}
        </Section>
      ))}
    </div>
  ),
};

// ─── Text Input ──────────────────────────────────────────────────────────────

export const TextInput: StoryObj = {
  name: 'Text Input',
  render: () => (
    <div style={{ padding: 24, ...baseStyle }}>
      <Section title="Preview">
        <input
          type="text"
          placeholder="Placeholder text"
          style={{
            display: 'block',
            padding: 'var(--ds-component-text-input-padding-vertical, 0.75rem) var(--ds-component-text-input-padding-horizontal, 1rem)',
            background: 'var(--ds-component-text-input-color-background-enabled)',
            border: `var(--ds-component-text-input-border-width, 1px) solid var(--ds-semantic-color-border-default)`,
            borderRadius: 'var(--ds-semantic-border-radius-sm)',
            fontFamily: 'system-ui, sans-serif',
            fontSize: 14,
            color: 'var(--ds-semantic-color-content-default)',
            width: 280,
            outline: 'none',
          }}
        />
      </Section>

      <Section title="Text Input tokens">
        {[
          'border-width',
          'color-background-default',
          'padding-gap',
          'padding-horizontal',
          'padding-vertical',
        ].map(name => (
          <TokenRow key={name} name={name} cssVar={`--ds-component-text-input-${name}`} />
        ))}
      </Section>
    </div>
  ),
};
