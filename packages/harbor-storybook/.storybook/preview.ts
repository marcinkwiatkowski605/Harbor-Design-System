import type { Preview } from '@storybook/react';

// Uncomment after running npm run build:tokens from the root:
// import './themes.scss';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i
      }
    },
    options: {
      storySort: {
        order: ['Foundations', 'Components', 'Pages']
      }
    }
  }
};

export default preview;
