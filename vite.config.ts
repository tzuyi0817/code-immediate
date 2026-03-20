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
    rollupOptions: {
      output: {
        chunkFileNames: 'chunks/[name]-[hash].js',
        assetFileNames: 'assets/[name].[hash].[ext]',
        entryFileNames: 'entries/[name].[hash].js',
        manualChunks: {
          core: ['vue', 'vue-router', 'pinia', 'pinia-plugin-persistedstate', '@tanstack/vue-query'],
          vender: [
            'axios',
            'file-saver',
            'jszip',
            'loadjs',
            'onigasm',
            'monaco-textmate',
            'monaco-editor-textmate',
            '@fortawesome/fontawesome-svg-core',
            '@fortawesome/free-brands-svg-icons',
            '@fortawesome/free-regular-svg-icons',
            '@fortawesome/free-solid-svg-icons',
            '@fortawesome/vue-fontawesome',
          ],
          'monaco-editor': ['monaco-editor'],
        },
      },
    },
  },
});
