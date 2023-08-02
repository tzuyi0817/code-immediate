/// <reference types="vitest" />
import { mergeConfig, defineConfig, type UserConfig } from 'vitest/config';
import { fileURLToPath, URL } from 'node:url';
import viteConfig from './vite.config';

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      globals: true,
      environment: 'jsdom',
      include: ['src/__tests__/unit/**/*.test.ts'],
      root: fileURLToPath(new URL('./', import.meta.url)),
      setupFiles: ['src/__tests__/setup/unitTest.ts'],
      alias: [
        {
          find: /^monaco-editor$/,
          replacement: __dirname + '/node_modules/monaco-editor/esm/vs/editor/editor.api',
        },
      ],
    },
  }) as UserConfig,
);