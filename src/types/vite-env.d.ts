/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly STORYBOOK: string;
  // Add other environment variables as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
