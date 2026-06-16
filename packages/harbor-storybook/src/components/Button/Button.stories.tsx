import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: ['primary', 'secondary', 'outline'],
      description: 'Visual style (Figma `Type` axis).',
    },
    loading: { control: 'boolean', description: 'Shows a spinner and marks the button busy.' },
    disabled: { control: 'boolean' },
    children: { control: 'text', description: 'Button label.' },
    onClick: { action: 'clicked' },
  },
  args: {
    variant: 'primary',
    loading: false,
    disabled: false,
    children: 'Sample label',
  },
};
export default meta;

type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: { variant: 'primary' },
};

export const Secondary: Story = {
  args: { variant: 'secondary' },
};

export const Outline: Story = {
  args: { variant: 'outline' },
};

export const Loading: Story = {
  args: { variant: 'primary', loading: true, children: 'Loading…' },
};

export const Disabled: Story = {
  args: { variant: 'primary', disabled: true },
};

/** Every variant side by side. */
export const AllVariants: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: 'flex', gap: 16 }}>
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
    </div>
  ),
};

/** Full variant × state matrix mirroring the Figma component set. */
export const StateMatrix: Story = {
  parameters: { controls: { disable: true }, layout: 'padded' },
  render: () => {
    const variants = ['primary', 'secondary', 'outline'] as const;
    const cell: React.CSSProperties = { padding: '10px 12px', verticalAlign: 'middle' };
    const head: React.CSSProperties = {
      ...cell,
      fontFamily: 'system-ui, sans-serif',
      fontSize: 11,
      textTransform: 'uppercase',
      letterSpacing: '0.06em',
      color: '#888',
      textAlign: 'left',
    };
    return (
      <table style={{ borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={head}>Variant</th>
            <th style={head}>Enabled</th>
            <th style={head}>Loading</th>
            <th style={head}>Disabled</th>
          </tr>
        </thead>
        <tbody>
          {variants.map((v) => (
            <tr key={v}>
              <td style={{ ...head, textTransform: 'capitalize' }}>{v}</td>
              <td style={cell}>
                <Button variant={v}>Sample label</Button>
              </td>
              <td style={cell}>
                <Button variant={v} loading>
                  Loading…
                </Button>
              </td>
              <td style={cell}>
                <Button variant={v} disabled>
                  Sample label
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  },
};
