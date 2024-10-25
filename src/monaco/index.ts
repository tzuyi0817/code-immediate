import { loadWASM } from 'onigasm';
import { Registry } from 'monaco-textmate';
import * as monaco from 'monaco-editor';
import * as volar from '@volar/monaco';
import type { VueCompilerOptions } from '@vue/language-service';
import type { WorkerLanguageService } from '@volar/monaco/worker';
import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker.js?worker';
import TsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker.js?worker';
import JsonWorker from 'monaco-editor/esm/vs/language/json/json.worker.js?worker';
import CssWorker from 'monaco-editor/esm/vs/language/css/css.worker.js?worker';
import HtmlWorker from 'monaco-editor/esm/vs/language/html/html.worker.js?worker';
import VueWorker from '@/workers/vue.worker.ts?worker';
import { vueConfiguration } from '@/config/language-configuration/vue';
import { VERSION } from '@/config/template';
import { GRAMMAR_SCOPE_NAME_MAP, GRAMMAR_PLIST, type GrammarScope } from '@/config/grammar';

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
  window.MonacoEnvironment = {
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

  setupCustomLanguage();
  await registerShikiTheme();
}

async function initializeWorker(worker: Worker) {
  const initialize = new Promise<Worker>(resolve => {
    worker.addEventListener('message', () => resolve(worker));
    worker.postMessage('initializing');
  });

  return await initialize;
}

function setupCustomLanguage() {
  monaco.languages.register({ id: 'haml', extensions: ['.haml'] });
  monaco.languages.register({ id: 'sass', extensions: ['.sass'] });
  monaco.languages.register({ id: 'stylus', extensions: ['.styl'] });
  monaco.languages.register({ id: 'postcss', extensions: ['.postcss'] });
  monaco.languages.register({ id: 'livescript', extensions: ['.mlx'] });
  setupVueLanguage();
}

export function setupTestEnvironmentLanguage() {
  monaco.languages.register({ id: 'html' });
  monaco.languages.register({ id: 'markdown' });
  setupCustomLanguage();
}

async function setupVueLanguage() {
  monaco.languages.register({ id: 'vue', extensions: ['.vue'] });
  monaco.languages.setLanguageConfiguration('vue', vueConfiguration);
  monaco.languages.onLanguage('vue', async () => {
    if (IS_TEST_MODE) return;
    const worker = createWebWorker<WorkerLanguageService>('vue', {
      ...TSCONFIG,
      vueCompilerOptions: {
        target: VERSION.VUE,
      },
    });
    const languageId = ['vue'];
    const getSyncUris = () => [monaco.Uri.parse('file:///demo.vue')];

    volar.activateMarkers(worker, languageId, 'vue', getSyncUris, monaco.editor);
    volar.activateAutoInsertion(worker, languageId, getSyncUris, monaco.editor);
    await volar.registerProviders(worker, languageId, getSyncUris, monaco.languages);
  });
}

function createWebWorker<T extends object>(
  language: string,
  tsconfig: Record<string, unknown> = {},
  dependencies: Record<string, string> = {},
) {
  return monaco.editor.createWebWorker<T>({
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
