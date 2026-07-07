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
    disabled: { control: 'boolean' },
    children: { control: 'text', description: 'Button label.' },
    onClick: { action: 'clicked' },
  },
  args: {
    variant: 'primary',
    disabled: false,
    children: 'Sample label',
  },
};
export default meta;

type Story = StoryObj<typeof Button>;

/** Use the Controls panel to switch variant and disabled. */
export const Default: Story = {};
