import { defineConfig, mergeConfig } from 'vitest/config';
import viteConfig from './vite.config';

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      globals: true,
      environment: 'jsdom',
      pool: 'threads',
      include: ['src/__tests__/unit/**/*.test.ts'],
      setupFiles: ['./vitest.setup.ts'],
      alias: [
        {
          find: /^monaco-editor$/,
          replacement: `${__dirname}/node_modules/monaco-editor/esm/vs/editor/editor.api`,
        },
      ],
      coverage: {
        provider: 'v8',
        include: ['src/**/*.ts', 'src/**/*.vue'],
        exclude: ['src/main.ts', 'src/App.vue', 'src/mocks/browser.ts', 'src/*.d.ts', 'src/types/*', 'src/plugins/*'],
      },
    },
  }),
);
