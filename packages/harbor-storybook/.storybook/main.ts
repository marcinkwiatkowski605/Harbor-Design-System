import type { StorybookConfig } from '@storybook/react-vite';
import remarkGfm from 'remark-gfm';

const config: StorybookConfig = {
  stories: [
    './components/**/*.stories.@(js|jsx|ts|tsx)',
    '../src/**/*.mdx',
    '../src/**/*.stories.@(js|jsx|ts|tsx)'
  ],
  addons: [
    '@storybook/addon-essentials',
    {
      // Registered explicitly so addon-essentials skips its bundled docs and uses
      // this one — letting us enable GitHub-Flavored Markdown (tables, etc.) in MDX.
      name: '@storybook/addon-docs',
      options: {
        mdxPluginOptions: {
          mdxCompileOptions: {
            remarkPlugins: [remarkGfm]
          }
        }
      }
    },
    '@storybook/addon-a11y'
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {}
  },
  // macOS's native FSEvents watcher can silently stop delivering change events on a
  // long-running dev server (observed after the process sat idle across a sleep/wake
  // cycle) — polling re-checks files on an interval instead, so it can't go stale.
  viteFinal: (viteConfig) => {
    viteConfig.server = {
      ...viteConfig.server,
      watch: {
        ...viteConfig.server?.watch,
        usePolling: true,
        interval: 1000
      }
    };
    return viteConfig;
  }
};

export default config;
