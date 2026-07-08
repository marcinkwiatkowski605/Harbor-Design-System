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
const states = ['enabled', 'hover', 'selected', 'focus', 'disabled'] as const;
type ButtonState = typeof states[number];

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
        <TokenRow name="border-radius" cssVar="--ds-component-button-border-radius" />
        <TokenRow name="border-width" cssVar="--ds-component-button-border-width" />
        <TokenRow name="height" cssVar="--ds-component-button-height" />
        <TokenRow name="padding" cssVar="--ds-component-button-padding" />
      </Section>

      <Section title="Focus ring (shared, semantic)">
        <TokenRow name="ring-color" cssVar="--ds-semantic-focus-ring-ring-color" />
        <TokenRow name="ring-spread" cssVar="--ds-semantic-focus-ring-ring-spread" />
        <TokenRow name="ring-blur" cssVar="--ds-semantic-focus-ring-ring-blur" />
        <TokenRow name="gap-color" cssVar="--ds-semantic-focus-ring-gap-color" />
        <TokenRow name="gap-spread" cssVar="--ds-semantic-focus-ring-gap-spread" />
        <TokenRow name="gap-blur" cssVar="--ds-semantic-focus-ring-gap-blur" />
      </Section>

      {variants.map(variant => (
        <Section key={variant} title={`${variantLabel[variant]} tokens`}>
          {states.map(state => (
            <div key={state}>
              {(['background', 'content', ...(variant === 'outline' ? ['border'] : [])] as string[]).map(role => {
                // Focus reuses the enabled token for every role — it adds the shared ring on top.
                const tokenState = state === 'focus' ? 'enabled' : state;
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
