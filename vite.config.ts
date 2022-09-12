import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from "path";
// import monacoEditorPlugin from 'vite-plugin-monaco-editor';

export default defineConfig({
  base: './',
  plugins: [
    vue(),
    // @ts-ignore
    // monacoEditorPlugin.default({
    //   languageWorkers: ['css', 'html', 'json', 'typescript'],
    // }),
  ],
  optimizeDeps: {
    include: [
      'monaco-editor/esm/vs/language/json/json.worker',
      'monaco-editor/esm/vs/language/css/css.worker',
      'monaco-editor/esm/vs/language/html/html.worker',
      'monaco-editor/esm/vs/language/typescript/ts.worker',
      'monaco-editor/esm/vs/editor/editor.worker'
    ],
  },
  server: {
    port: 8080,
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
})
