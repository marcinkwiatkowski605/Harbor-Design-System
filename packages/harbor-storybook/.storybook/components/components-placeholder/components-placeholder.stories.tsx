import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta = {
  title: 'Components/Introduction'
};

export default meta;

export const Placeholder: StoryObj = {
  render: () => (
    <p style={{ fontFamily: 'sans-serif', color: '#666' }}>
      Components will be added when tokens are defined.
    </p>
  )
};
