import type { Preview } from '@storybook/react';

import './themes.scss';

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
