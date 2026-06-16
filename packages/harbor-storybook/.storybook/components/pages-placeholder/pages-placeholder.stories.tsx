import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta = {
  title: 'Pages/Introduction'
};

export default meta;

export const Placeholder: StoryObj = {
  render: () => (
    <p style={{ fontFamily: 'sans-serif', color: '#666' }}>
      Pages will be added when components are ready.
    </p>
  )
};
