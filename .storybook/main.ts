import type { StorybookConfig } from '@storybook/experimental-nextjs-vite';
import path from 'path';
import { fileURLToPath } from 'url';

const _dirname = path.dirname(fileURLToPath(import.meta.url));

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|mjs|ts|tsx|mdx)'],
  addons: [
    '@storybook/addon-docs',
    '@storybook/addon-essentials',
    '@storybook/addon-onboarding',
    '@chromatic-com/storybook',
    '@storybook/experimental-addon-test',
  ],
  framework: {
    name: '@storybook/experimental-nextjs-vite',
    options: {},
  },
  staticDirs: ['../public'],
  docs: {
    autodocs: true,
    defaultName: 'Documentation',
  },
  env: (config) => ({
    ...config,
    STORYBOOK: 'true',
  }),
  viteFinal: async (config) => {
    if (config.resolve) {
      config.resolve.alias = {
        ...config.resolve.alias,
        '@': path.resolve(_dirname, '../src'),
      };
    }

    return config;
  },
};

export default config;
