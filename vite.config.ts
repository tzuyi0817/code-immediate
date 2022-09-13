import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from "path";
// import monacoEditorPlugin from 'vite-plugin-monaco-editor';
const prefix = `monaco-editor/esm/vs`;

export default defineConfig({
  base: './',
  plugins: [
    vue(),
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
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          JsonWorker: [`${prefix}/language/json/json.worker`],
          CssWorker: [`${prefix}/language/css/css.worker`],
          HtmlWorker: [`${prefix}/language/html/html.worker`],
          TsWorker: [`${prefix}/language/typescript/ts.worker`],
          EditorWorker: [`${prefix}/editor/editor.worker`],
        },
      },
    },
  },
})
