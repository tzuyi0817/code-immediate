import { loadWASM } from 'onigasm';
import { Registry } from 'monaco-textmate';
import * as monaco from 'monaco-editor';
import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker.js?worker';
import TsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker.js?worker';
import JsonWorker from 'monaco-editor/esm/vs/language/json/json.worker.js?worker';
import CssWorker from 'monaco-editor/esm/vs/language/css/css.worker.js?worker';
import HtmlWorker from 'monaco-editor/esm/vs/language/html/html.worker.js?worker';
import VueWorker from '@/workers/vue.worker.ts?worker';
import { vueConfiguration } from '@/config/language-configuration/vue';
import { GRAMMAR_SCOPE_NAME_MAP, GRAMMAR_PLIST, type GrammarScope } from '@/config/grammar';

const baseUrl = import.meta.env.MODE === 'test' ? 'http://localhost:3000/' : '';

export async function initMonacoEditor() {
  await loadWASM(`${baseUrl}onigasm/onigasm.wasm`);
  const theme = await (await fetch('themes/themes.json')).json();

  monaco.editor.defineTheme('vs-code-theme-converted', theme);
  setCustomLanguage();
  window.MonacoEnvironment = {
    getWorker(_: string, label: string) {
      if (label === 'typescript' || label === 'javascript') return new TsWorker();
      if (label === 'json') return new JsonWorker();
      if (label === 'css' || label === 'scss' || label === 'less') return new CssWorker();
      if (label === 'html') return new HtmlWorker();
      if (label === 'vue') return new VueWorker();
      return new EditorWorker();
    },
  };
}

function setCustomLanguage() {
  monaco.languages.register({ id: 'haml', extensions: ['.haml'] });
  monaco.languages.register({ id: 'sass', extensions: ['.sass'] });
  monaco.languages.register({ id: 'stylus', extensions: ['.styl'] });
  monaco.languages.register({ id: 'postcss', extensions: ['.postcss'] });
  monaco.languages.register({ id: 'livescript', extensions: ['.mlx'] });
  monaco.languages.register({ id: 'vue', extensions: ['.vue'] });
  monaco.languages.setLanguageConfiguration('vue', vueConfiguration);
  // monaco.languages.registerCompletionItemProvider('vue', {
  //   provideCompletionItems: () => {},
  // });
  // monaco.languages.registerHoverProvider('vue', {
  //   provideHover(model, position, token) {},
  // });
}

export function setTestEnvironmentLanguage() {
  monaco.languages.register({ id: 'html' });
  monaco.languages.register({ id: 'markdown' });
  setCustomLanguage();
}

export function registry() {
  return new Registry({
    getGrammarDefinition: async scopeName => {
      const source = GRAMMAR_SCOPE_NAME_MAP[scopeName as GrammarScope];

      return {
        format: GRAMMAR_PLIST.includes(scopeName) ? 'plist' : 'json',
        content: await (await fetch(`${baseUrl}grammars/${source}`)).text(),
      };
    },
  });
}
