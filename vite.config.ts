import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from "path";
import { nodePolyfills } from 'vite-plugin-node-polyfills';
// import monacoEditorPlugin from 'vite-plugin-monaco-editor';
const prefix = `monaco-editor/esm/vs`;

export default defineConfig({
  base: './',
  plugins: [
    vue(),
    nodePolyfills(),
    // @ts-ignore
    // monacoEditorPlugin.default({
    //   languageWorkers: ['editorWorkerService', 'css', 'html', 'json', 'typescript'],
    // }),
  ],
  server: {
    port: 8080,
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
})
