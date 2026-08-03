import { fileURLToPath, URL } from 'node:url';
import tailwindcss from '@tailwindcss/vite';
import vue from '@vitejs/plugin-vue';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig } from 'vite';
import { createHtmlPlugin } from 'vite-plugin-html';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig({
  base: './',
  plugins: [
    vue(),
    tailwindcss(),
    nodePolyfills({
      globals: {
        Buffer: true,
        global: true,
        process: true,
      },
      protocolImports: true,
    }),
    createHtmlPlugin({
      minify: true,
      inject: {
        ejsOptions: {
          views: ['./.ejs/'],
        },
      },
    }),
    visualizer({ gzipSize: true, open: true }),
  ],
  server: {
    port: 8080,
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('src', import.meta.url)),
      /**
       * @vue/language-service 的 htmlFormatter 直接 require vscode-html-languageservice 的 UMD 產物，
       * 繞過套件的 module field。UMD wrapper 在模組求值當下就會讀取裸 require，
       * 於 worker（瀏覽器）環境會拋 `require is not defined`。
       * 同套件的 ESM 產物 API 完全相同，改指向它即可。
       */
      'vscode-html-languageservice/lib/umd': 'vscode-html-languageservice/lib/esm',
    },
  },
  esbuild: {
    pure: ['console.log'],
    drop: ['debugger'],
  },
  build: {
    rolldownOptions: {
      output: {
        chunkFileNames: 'chunks/[name]-[hash].js',
        assetFileNames: 'assets/[name].[hash].[ext]',
        entryFileNames: 'entries/[name].[hash].js',
        codeSplitting: {
          groups: [
            {
              name: 'core',
              test: /node_modules[\\/](vue|pinia)/,
              priority: 20,
            },
            {
              name: 'vender',
              test: /node_modules[\\/](axios|file-saver|loadjs|jszip|onigasm|monaco-textmate|monaco-editor-textmate|@fortawesome)/,
              priority: 15,
            },
            {
              name: 'monaco-editor',
              test: /node_modules[\\/]monaco-editor/,
              priority: 10,
            },
          ],
        },
      },
    },
  },
});
