import type { Meta, StoryObj } from '@storybook/react';
import { Select } from './Select';

const meta: Meta<typeof Select> = {
  title: 'Components/🚧 Select',
  component: Select,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    label: { control: 'text', description: 'Field label, shown above the trigger.' },
    description: {
      control: 'text',
      description: 'Helper text shown below the trigger when the field is valid.',
    },
    errorMessage: {
      control: 'text',
      description: 'Error message shown below the trigger when `isInvalid` is true.',
    },
    placeholder: { control: 'text' },
    items: { control: 'object', description: 'The list of selectable options.' },
    isDisabled: { control: 'boolean' },
    isRequired: { control: 'boolean' },
    isInvalid: { control: 'boolean' },
    onSelectionChange: { action: 'changed' },
  },
  args: {
    label: 'Country',
    description: "We'll use this to set your default currency.",
    errorMessage: 'Choose a country.',
    placeholder: 'Select a country',
    items: [
      { id: 'pl', label: 'Poland' },
      { id: 'de', label: 'Germany' },
      { id: 'fr', label: 'France' },
      { id: 'es', label: 'Spain' },
      { id: 'it', label: 'Italy', isDisabled: true },
    ],
    isDisabled: false,
    isRequired: false,
    isInvalid: false,
  },
};
export default meta;

type Story = StoryObj<typeof Select>;

/** Use the Controls panel to toggle disabled/required/invalid. */
export const Default: Story = {};
