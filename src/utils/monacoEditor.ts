import { loadWASM } from 'onigasm';
import { Registry } from 'monaco-textmate';
import { editor, languages, Uri } from 'monaco-editor';
import * as volar from '@volar/monaco';
import type { LanguageService, VueCompilerOptions } from '@vue/language-service';
import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker.js?worker';
import TsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker.js?worker';
import JsonWorker from 'monaco-editor/esm/vs/language/json/json.worker.js?worker';
import CssWorker from 'monaco-editor/esm/vs/language/css/css.worker.js?worker';
import HtmlWorker from 'monaco-editor/esm/vs/language/html/html.worker.js?worker';
import VueWorker from '@/workers/vue.worker.ts?worker';
import { vueConfiguration } from '@/config/language-configuration/vue';
import { GRAMMAR_SCOPE_NAME_MAP, GRAMMAR_PLIST, type GrammarScope } from '@/config/grammar';

const isTestMode = import.meta.env.MODE === 'test';
const baseUrl = isTestMode ? 'http://localhost:3000/' : '';

export interface CreateData {
  tsconfig: {
    compilerOptions?: import('typescript').CompilerOptions;
    vueCompilerOptions?: Partial<VueCompilerOptions>;
  };
  dependencies: Record<string, string>;
}

export async function initMonacoEditor() {
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
  await loadWASM(`${baseUrl}onigasm/onigasm.wasm`);
  const theme = await (await fetch('themes/themes.json')).json();

  editor.defineTheme('vs-code-theme-converted', theme);
  setCustomLanguage();
}

function setCustomLanguage() {
  languages.register({ id: 'haml', extensions: ['.haml'] });
  languages.register({ id: 'sass', extensions: ['.sass'] });
  languages.register({ id: 'stylus', extensions: ['.styl'] });
  languages.register({ id: 'postcss', extensions: ['.postcss'] });
  languages.register({ id: 'livescript', extensions: ['.mlx'] });
  setVueLanguage();
}

export function setTestEnvironmentLanguage() {
  languages.register({ id: 'html' });
  languages.register({ id: 'markdown' });
  setCustomLanguage();
}

function setVueLanguage() {
  languages.register({ id: 'vue', extensions: ['.vue'] });
  languages.setLanguageConfiguration('vue', vueConfiguration);
  languages.onLanguage('vue', async () => {
    if (isTestMode) return;
    const worker = createWebWorker<LanguageService>('vue');
    const languageId = ['vue'];
    const getSyncUris = () => [Uri.parse('file:///demo.vue')];

    volar.editor.activateMarkers(worker, languageId, 'vue', getSyncUris, editor);
    volar.editor.activateAutoInsertion(worker, languageId, getSyncUris, editor);
    await volar.languages.registerProvides(worker, languageId, getSyncUris, languages);
  });
}

function createWebWorker<T extends object>(
  language: string,
  dependencies: Record<string, string> = {},
  tsconfig: Record<string, any> = {},
) {
  return editor.createWebWorker<T>({
    moduleId: `vs/language/${language}/${language}.worker`,
    label: language,
    createData: {
      tsconfig,
      dependencies,
    } satisfies CreateData,
  });
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
