import * as volar from '@volar/monaco';
import EditorWorker from 'monaco-editor/editor/editor.worker.js?worker';
import CssWorker from 'monaco-editor/language/css/css.worker.js?worker';
import HtmlWorker from 'monaco-editor/language/html/html.worker.js?worker';
import JsonWorker from 'monaco-editor/language/json/json.worker.js?worker';
import TsWorker from 'monaco-editor/language/typescript/ts.worker.js?worker';
import { Registry } from 'monaco-textmate';
import { loadWASM } from 'onigasm';
import { IS_TEST_MODE } from '@/constants/common';
import { GRAMMAR_PLIST, GRAMMAR_SCOPE_NAME_MAP, type GrammarScope } from '@/constants/grammar';
import { VUE_COMPILER_TARGET } from '@/constants/template';
import { WORKER_INIT, WORKER_READY, type CreateData } from '@/workers/protocol';
import VueWorker from '@/workers/vue.worker.ts?worker';
import type { WorkerLanguageService } from '@volar/monaco/worker';

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

export async function initMonacoEditor() {
  // monaco 官方以全域變數傳遞 worker factory，且其 .d.ts 已宣告 MonacoEnvironment，
  // 直接指派才能讓 getWorker 的簽章受型別檢查
  // eslint-disable-next-line unicorn/no-global-object-property-assignment
  globalThis.MonacoEnvironment = {
    getWorker(_: string, label: string) {
      if (label === 'typescript' || label === 'javascript') return new TsWorker();
      if (label === 'json') return new JsonWorker();
      if (label === 'css' || label === 'scss' || label === 'less') return new CssWorker();
      if (label === 'html') return new HtmlWorker();

      return new EditorWorker();
    },
  };
  await loadWASM(`${BASE_URL}onigasm/onigasm.wasm`);
  const { registerShikiTheme } = await import('./highlight');

  await setupCustomLanguage();
  registerShikiTheme();
}

/**
 * 啟動 vue worker 並完成握手：送出 WORKER_INIT，待 worker 回報 WORKER_READY 才 resolve。
 * 唯有等到 WORKER_READY，createData 才不會落到尚未被 worker.initialize 替換掉的處理器上。
 */
function startVueWorker() {
  const worker = new VueWorker();

  return new Promise<Worker>(resolve => {
    const onMessage = ({ data }: MessageEvent) => {
      if (data !== WORKER_READY) return;

      worker.removeEventListener('message', onMessage);
      resolve(worker);
    };

    worker.addEventListener('message', onMessage);
    worker.postMessage(WORKER_INIT);
  });
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
  await setupCustomLanguage();
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
    const worker = await createVueWorker<WorkerLanguageService>({
      ...TSCONFIG,
      vueCompilerOptions: {
        target: VUE_COMPILER_TARGET,
      },
    });
    const languageId = ['vue'];
    const getSyncUris = () => [Uri.parse('file:///demo.vue')];

    volar.activateMarkers(worker, languageId, 'vue', getSyncUris, editor);
    volar.activateAutoInsertion(worker, languageId, getSyncUris, editor);
    await volar.registerProviders(worker, languageId, getSyncUris, languages);
  });
}

async function createVueWorker<T extends object>(tsconfig: CreateData['tsconfig']) {
  // worker 握手要等 CDN 上的 TypeScript 下載完，與 monaco 的載入互不相依，故並行
  const workerPromise = startVueWorker();
  const { editor } = await import('monaco-editor');
  const worker = await workerPromise;

  worker.postMessage({ tsconfig } satisfies CreateData);

  return editor.createWebWorker<T>({ worker });
}

let grammarRegistry: Registry | undefined;

/** 共用單一 registry，讓已解析過的 grammar 在切換語言時能重用，不必重新抓取與解析 */
export function registry() {
  grammarRegistry ??= new Registry({
    getGrammarDefinition: async scopeName => {
      const source = GRAMMAR_SCOPE_NAME_MAP[scopeName as GrammarScope];

      return {
        format: GRAMMAR_PLIST.includes(scopeName) ? 'plist' : 'json',
        content: await (await fetch(`${BASE_URL}grammars/${source}`)).text(),
      };
    },
  });

  return grammarRegistry;
}
