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
  // optimizeDeps: {
  //   include: [
  //     `${prefix}/language/json/json.worker`,
  //     `${prefix}/language/css/css.worker`,
  //     `${prefix}/language/html/html.worker`,
  //     `${prefix}/language/typescript/ts.worker`,
  //     `${prefix}/editor/editor.worker`
  //   ],
  // },
  server: {
    port: 8080,
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
})
