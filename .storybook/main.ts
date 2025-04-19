import type { StorybookConfig } from '@storybook/experimental-nextjs-vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const config: StorybookConfig = {
  stories: ['../src/**/*.storiesssssssss.@(js|jsx|mjs|ts|tsx|mdx)'],
  addons: ['@storybook/addon-essentials'],
  framework: {
    name: '@storybook/experimental-nextjs-vite',
    options: {},
  },
};

export default config;
