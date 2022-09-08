import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from "path";
import monacoEditorPlugin from 'vite-plugin-monaco-editor';

export default defineConfig({
  base: './',
  plugins: [
    vue(),
    // @ts-ignore
    monacoEditorPlugin.default({
      languageWorkers: ['editorWorkerService', 'css', 'html', 'json', 'typescript'],
    }),
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
