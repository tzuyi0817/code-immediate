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
