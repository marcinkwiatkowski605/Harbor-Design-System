import type { Meta, StoryObj } from '@storybook/react';
import { TextArea } from './TextArea';

const meta: Meta<typeof TextArea> = {
  title: 'Components/TextArea',
  component: TextArea,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    label: { control: 'text', description: 'Field label, shown above the textarea.' },
    description: {
      control: 'text',
      description: 'Helper text shown below the textarea when the field is valid.',
    },
    errorMessage: {
      control: 'text',
      description: 'Error message shown below the textarea when `isInvalid` is true.',
    },
    placeholder: { control: 'text' },
    rows: { control: 'number', description: 'Visible number of text lines.' },
    isDisabled: { control: 'boolean' },
    isReadOnly: { control: 'boolean' },
    isRequired: { control: 'boolean' },
    isInvalid: { control: 'boolean' },
    onChange: { action: 'changed' },
  },
  args: {
    label: 'Feedback',
    description: 'Let us know what worked and what didn’t.',
    errorMessage: 'Feedback must be at least 10 characters.',
    placeholder: 'Type your feedback here...',
    rows: 4,
    isDisabled: false,
    isReadOnly: false,
    isRequired: false,
    isInvalid: false,
  },
};
export default meta;

type Story = StoryObj<typeof TextArea>;

/** Use the Controls panel to toggle disabled/read-only/required/invalid. */
export const Default: Story = {};
