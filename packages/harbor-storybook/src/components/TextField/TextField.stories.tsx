import type { Meta, StoryObj } from '@storybook/react';
import { TextField } from './TextField';

const meta: Meta<typeof TextField> = {
  title: 'Components/🚧 TextField',
  component: TextField,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    label: { control: 'text', description: 'Field label, shown above the input.' },
    description: {
      control: 'text',
      description: 'Helper text shown below the input when the field is valid.',
    },
    errorMessage: {
      control: 'text',
      description: 'Error message shown below the input when `isInvalid` is true.',
    },
    placeholder: { control: 'text' },
    isDisabled: { control: 'boolean' },
    isReadOnly: { control: 'boolean' },
    isRequired: { control: 'boolean' },
    isInvalid: { control: 'boolean' },
    onChange: { action: 'changed' },
  },
  args: {
    label: 'Email address',
    description: "We'll only use this to send you a receipt.",
    errorMessage: 'Enter a valid email address.',
    placeholder: 'you@example.com',
    isDisabled: false,
    isReadOnly: false,
    isRequired: false,
    isInvalid: false,
  },
};
export default meta;

type Story = StoryObj<typeof TextField>;

/** Use the Controls panel to toggle disabled/read-only/required/invalid. */
export const Default: Story = {};
