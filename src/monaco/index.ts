import * as volar from '@volar/monaco';
import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker.js?worker';
import CssWorker from 'monaco-editor/esm/vs/language/css/css.worker.js?worker';
import HtmlWorker from 'monaco-editor/esm/vs/language/html/html.worker.js?worker';
import JsonWorker from 'monaco-editor/esm/vs/language/json/json.worker.js?worker';
import TsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker.js?worker';
import { Registry } from 'monaco-textmate';
import { loadWASM } from 'onigasm';
import { GRAMMAR_PLIST, GRAMMAR_SCOPE_NAME_MAP, type GrammarScope } from '@/constants/grammar';
import { VERSION } from '@/constants/template';
import VueWorker from '@/workers/vue.worker.ts?worker';
import type { WorkerLanguageService } from '@volar/monaco/worker';
import type { VueCompilerOptions } from '@vue/language-core';

export const IS_TEST_MODE = import.meta.env.MODE === 'test';
const BASE_URL = IS_TEST_MODE ? 'http://localhost:3000/' : '';
const TSCONFIG = {
  compilerOptions: {
    allowJs: true,
    checkJs: true,
    jsx: 'Preserve',
    target: 'ESNext',
    module: 'ESNext',
    moduleResolution: 'Bundler',
    allowImportingTsExtensions: true,
  },
};

export interface CreateData {
  tsconfig: {
    compilerOptions?: import('typescript').CompilerOptions;
    vueCompilerOptions?: Partial<VueCompilerOptions>;
  };
  dependencies: Record<string, string>;
}

export async function initMonacoEditor() {
  globalThis.MonacoEnvironment = {
    async getWorker(_: string, label: string) {
      if (label === 'typescript' || label === 'javascript') return new TsWorker();
      if (label === 'json') return new JsonWorker();
      if (label === 'css' || label === 'scss' || label === 'less') return new CssWorker();
      if (label === 'html') return new HtmlWorker();
      if (label === 'vue') return await initializeWorker(new VueWorker());
      return new EditorWorker();
    },
  };
  await loadWASM(`${BASE_URL}onigasm/onigasm.wasm`);
  const { registerShikiTheme } = await import('./highlight');

  await setupCustomLanguage();
  registerShikiTheme();
}

async function initializeWorker(worker: Worker) {
  const initialize = new Promise<Worker>(resolve => {
    worker.addEventListener('message', () => resolve(worker));
    worker.postMessage('initializing');
  });

  return await initialize;
}

async function setupCustomLanguage() {
  const { languages, Uri, editor } = await import('monaco-editor');

  languages.register({ id: 'haml', extensions: ['.haml'] });
  languages.register({ id: 'sass', extensions: ['.sass'] });
  languages.register({ id: 'stylus', extensions: ['.styl'] });
  languages.register({ id: 'postcss', extensions: ['.postcss'] });
  languages.register({ id: 'livescript', extensions: ['.mlx'] });
  await setupVueLanguage(languages, Uri, editor);
}

export async function setupTestEnvironmentLanguage() {
  const { languages } = await import('monaco-editor');

  languages.register({ id: 'html' });
  languages.register({ id: 'markdown' });
  setupCustomLanguage();
}

async function setupVueLanguage(
  languages: typeof import('monaco-editor').languages,
  Uri: typeof import('monaco-editor').Uri,
  editor: typeof import('monaco-editor').editor,
) {
  const { vueConfiguration } = await import('@/constants/language-configuration/vue');

  languages.register({ id: 'vue', extensions: ['.vue'] });
  languages.setLanguageConfiguration('vue', vueConfiguration);
  languages.onLanguage('vue', async () => {
    if (IS_TEST_MODE) return;
    const worker = await createWebWorker<WorkerLanguageService>('vue', {
      ...TSCONFIG,
      vueCompilerOptions: {
        target: VERSION.VUE,
      },
    });
    const languageId = ['vue'];
    const getSyncUris = () => [Uri.parse('file:///demo.vue')];

    volar.activateMarkers(worker, languageId, 'vue', getSyncUris, editor);
    volar.activateAutoInsertion(worker, languageId, getSyncUris, editor);
    await volar.registerProviders(worker, languageId, getSyncUris, languages);
  });
}

async function createWebWorker<T extends object>(
  language: string,
  tsconfig: Record<string, unknown> = {},
  dependencies: Record<string, string> = {},
) {
  const { editor } = await import('monaco-editor');

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
        content: await (await fetch(`${BASE_URL}grammars/${source}`)).text(),
      };
    },
  });
}
