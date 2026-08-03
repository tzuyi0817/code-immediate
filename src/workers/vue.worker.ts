/**
 * volar 的 worker.initialize 會接手 self.onmessage（見下方 globalThis.onmessage 說明），
 * 因此這裡必須以指派的方式註冊處理器，不能改用 addEventListener。
 */
/* eslint-disable unicorn/no-global-object-property-assignment, unicorn/prefer-add-event-listener */
import { createNpmFileSystem } from '@volar/jsdelivr';
import {
  createTypeScriptWorkerLanguageService,
  type Language,
  type LanguageServiceEnvironment,
} from '@volar/monaco/worker';
import {
  createVueLanguagePlugin,
  getDefaultCompilerOptions,
  VueVirtualCode,
  type SourceScript,
  type VueCompilerOptions,
} from '@vue/language-core';
import propsFallbackTypes from '@vue/language-core/types/props-fallback.d.ts?raw';
import templateHelperTypes from '@vue/language-core/types/template-helpers.d.ts?raw';
import vue34ShimTypes from '@vue/language-core/types/vue-3.4-shims.d.ts?raw';
import { createVueLanguageServicePlugins, type LanguageService } from '@vue/language-service';
import { postprocessLanguageService, preprocessLanguageService } from '@vue/typescript-plugin/lib/common';
import { getComponentDirectives } from '@vue/typescript-plugin/lib/requests/getComponentDirectives';
import { getComponentMeta } from '@vue/typescript-plugin/lib/requests/getComponentMeta';
import { getComponentNames } from '@vue/typescript-plugin/lib/requests/getComponentNames';
import { getComponentProps } from '@vue/typescript-plugin/lib/requests/getComponentProps';
import { getComponentSlots } from '@vue/typescript-plugin/lib/requests/getComponentSlots';
import { getElementAttrs } from '@vue/typescript-plugin/lib/requests/getElementAttrs';
import { getElementNames } from '@vue/typescript-plugin/lib/requests/getElementNames';
import { isRefAtPosition } from '@vue/typescript-plugin/lib/requests/isRefAtPosition';
import { resolveModuleName } from '@vue/typescript-plugin/lib/requests/resolveModuleName';
import * as worker from 'monaco-editor/editor/editor.worker';
import { create as createTypeScriptDirectiveCommentPlugin } from 'volar-service-typescript/lib/plugins/directiveComment';
import { create as createTypeScriptSemanticPlugin } from 'volar-service-typescript/lib/plugins/semantic';
import { getTsConstructor } from '@/utils/cdn';
import { isString } from '@/utils/check-type';
import { WORKER_INIT, WORKER_READY, type CreateData } from './protocol';
import { asFileName, asUri, getCdnPath } from './utils';
import type * as monaco from 'monaco-editor';

/**
 * @vue/language-core 產生的虛擬程式碼會以 `/// <reference types="..." />` 指向此處的型別檔。
 * 必須是 bare specifier（而非絕對路徑），才會走 node_modules 解析、落到 TYPES_DIR；
 * 若給絕對路徑，產生的會是相對路徑形式的 reference，無法被解析到。
 */
const TYPES_ROOT = '@vue/language-core/types';

/** 上述 specifier 經 node_modules 解析後，在虛擬檔案系統中的實際位置 */
const TYPES_DIR = `/node_modules/${TYPES_ROOT}`;

/**
 * 這裡把安裝版本的型別檔內嵌進 worker 並由虛擬檔案系統供應，
 * 以免改從 CDN 抓取而與實際安裝的版本不同步。
 */
const GLOBAL_TYPE_FILES: Record<string, string> = {
  [`${TYPES_DIR}/props-fallback.d.ts`]: propsFallbackTypes,
  [`${TYPES_DIR}/template-helpers.d.ts`]: templateHelperTypes,
  [`${TYPES_DIR}/vue-3.4-shims.d.ts`]: vue34ShimTypes,
};

/**
 * preprocessLanguageService / postprocessLanguageService 兩層 Proxy 所攔截的方法聯集。
 * 兩者皆回傳新的 Proxy，而 volar 內部持有的是原始 languageService 實體，
 * 因此需把包裝後的這些方法覆寫回原物件才會實際生效。
 */
const VUE_PROXY_METHODS = [
  'findReferences',
  'findRenameLocations',
  'getCodeFixesAtPosition',
  'getCompletionEntryDetails',
  'getCompletionsAtPosition',
  'getDefinitionAndBoundSpan',
  'getQuickInfoAtPosition',
  'getSuggestionDiagnostics',
] as const;

let ts: typeof import('typescript');

globalThis.onmessage = async message => {
  if (message.data !== WORKER_INIT) return;

  ts = await getTsConstructor();
  // worker.initialize 會接手 self.onmessage 以接收主執行緒送來的 createData，
  // 因此必須先註冊、再回報載入完成，createData 才不會落到已被替換掉的處理器上。
  worker.initialize((ctx: monaco.worker.IWorkerContext, { tsconfig }: CreateData) => {
    // @volar/jsdelivr 在版本未指定時會抓 latest。TypeScript 7 起套件結構改為 /dist 且
    // 不再包含 lib/lib.*.d.ts，會導致所有內建型別（Array、Promise…）解析失敗；
    // worker 內實際載入的是 ts.version，型別檔必須釘在同一版本才一致。
    const getPackageVersion = (packageName: string) => (packageName === 'typescript' ? ts.version : undefined);

    const env: LanguageServiceEnvironment = {
      workspaceFolders: [asUri('/')],
      fs: createNpmFileSystem(getCdnPath, getPackageVersion),
    };

    const tsCompilerOptions = tsconfig?.compilerOptions ?? {};
    const { options: compilerOptions } = ts.convertCompilerOptionsFromJson(tsCompilerOptions, '');
    const vueCompilerOptions: VueCompilerOptions = {
      ...getDefaultCompilerOptions(),
      ...tsconfig.vueCompilerOptions,
      // 預設值會依 __dirname 推導，在 bundle 內不可靠，故明確指定
      typesRoot: TYPES_ROOT,
    };

    setupGlobalTypes(env);

    const { workerContext, markReady } = createSafeWorkerContext(ctx);
    const workerService = createTypeScriptWorkerLanguageService({
      typescript: ts,
      compilerOptions,
      workerContext,
      env,
      uriConverter: { asUri, asFileName },
      languagePlugins: [createVueLanguagePlugin(ts, compilerOptions, vueCompilerOptions, asFileName)],
      languageServicePlugins: [
        ...getTsLanguageServicePlugins(vueCompilerOptions),
        ...getVueLanguageServicePlugins(getLanguageService),
      ],
    });

    markReady();

    function getLanguageService() {
      return workerService.languageService;
    }

    return workerService;
  });

  postMessage(WORKER_READY);
};

/**
 * 建構當下主執行緒尚未同步任何 model 過來，回傳空陣列本就是正確語意，
 * 待建構結束後由呼叫端 markReady() 改為實際取用。
 * 之後 getProjectVersion() 會因 model 數量變動而遞增版本，程式庫會自行重新同步。
 */
function createSafeWorkerContext(ctx: monaco.worker.IWorkerContext) {
  let isWorkerServerReady = false;

  return {
    workerContext: {
      ...ctx,
      getMirrorModels: () => (isWorkerServerReady ? ctx.getMirrorModels() : []),
    },
    markReady() {
      isWorkerServerReady = true;
    },
  };
}

/**
 * 官方 plugin 以檔名當 script id，因此部分 request 的型別寫死 `SourceScript<string>`。
 * 此處的 language 改以 URI 索引，但傳入的 sourceScript 與 language 取自同一份實體，
 * 且這些 request 只把 sourceScript 當作 `language.maps.get()` 的索引鍵，
 * 執行期行為一致，僅泛型宣告不符，故於邊界轉型。
 */
function asStringSourceScript<T>(sourceScript: SourceScript<T>) {
  return sourceScript as unknown as SourceScript<string>;
}

/**
 * 上游的 getServiceScript() 等工具假設 script id 就是檔名（tsserver 的 Language<string> 情境），
 * 會把 fileName 字串直接餵給 language.scripts.get()。此處改以 URI 索引，
 * 收到字串時 asFileName() 會取到 undefined，並在後續的 path.resolve() 拋錯。
 * 因此於 scripts.get 邊界補上字串 → URI 的轉換；本來就是 id 的參數原樣通過。
 *
 * 上游會在逐項迴圈內反覆讀取 scripts.*（如 transform 的每個 range、每個 reference），
 * 故 get trap 的回傳值都預先建好或快取起來，避免每次讀取都配置新函式。
 * scripts 的方法內部會呼叫 this.set / this.delete，因此需綁回原物件而非 Proxy。
 */
function asFileNameAwareScripts<T extends object>(scripts: T): T {
  const boundMap = new Map<PropertyKey, unknown>();
  // 保留 includeFsFiles / shouldRegister 等後續參數，漏掉會讓上游的 model-only 查詢變成 CDN 抓取
  const get = (id: unknown, ...rest: unknown[]) => (scripts as any).get(isString(id) ? asUri(id) : id, ...rest);

  return new Proxy(scripts, {
    get(target, prop) {
      if (prop === 'get') return get;

      const value = Reflect.get(target, prop);

      if (typeof value !== 'function') return value;
      if (!boundMap.has(prop)) boundMap.set(prop, value.bind(target));

      return boundMap.get(prop);
    },
  });
}

function setupGlobalTypes(env: LanguageServiceEnvironment) {
  if (!env.fs) return;

  const { stat, readFile } = env.fs;
  const ctime = Date.now();

  env.fs.stat = async uri => {
    const content = GLOBAL_TYPE_FILES[uri.path];

    if (content !== undefined) {
      return { type: 1, ctime, mtime: ctime, size: content.length };
    }

    return stat(uri);
  };

  env.fs.readFile = async uri => {
    return GLOBAL_TYPE_FILES[uri.path] ?? (await readFile(uri));
  };
}

function getTsLanguageServicePlugins(vueCompilerOptions: VueCompilerOptions) {
  const semanticPlugin = createTypeScriptSemanticPlugin(ts);
  const { create } = semanticPlugin;

  semanticPlugin.create = context => {
    const created = create(context);
    const languageService = created.provide['typescript/languageService']();
    const scripts = asFileNameAwareScripts(context.language.scripts);
    const language = new Proxy(
      {},
      {
        get(_target, prop, receiver) {
          if (prop === 'scripts') return scripts;

          return Reflect.get(context.language, prop, receiver);
        },
      },
    ) as Language;

    // 依官方 plugin 的順序先 preprocess 再 postprocess 包裝。
    const wrapped = postprocessLanguageService(
      ts,
      language,
      preprocessLanguageService(languageService, () => language),
      vueCompilerOptions,
      asUri as any,
    );
    // 先一次讀出包裝後的方法（此時 Proxy 仍捕獲到原始實作，不會遞迴），再覆寫回原物件
    const patched = Object.fromEntries(VUE_PROXY_METHODS.map(name => [name, wrapped[name]]));

    Object.assign(languageService, patched);

    return created;
  };
  return [semanticPlugin, createTypeScriptDirectiveCommentPlugin()];
}

function getVueLanguageServicePlugins(getLanguageService: () => LanguageService) {
  const plugins = createVueLanguageServicePlugins(ts, {
    getComponentDirectives(fileName) {
      return getComponentDirectives(ts, getProgram(), fileName);
    },
    getComponentMeta(fileName, tag) {
      const { virtualCode } = getVirtualCode(fileName);
      const program = getProgram();
      const sourceFile = program.getSourceFile(virtualCode.fileName);

      if (!sourceFile) return;

      return getComponentMeta(ts, program, getLanguage(), getSourceScript, sourceFile, virtualCode, tag);
    },
    getComponentNames(fileName) {
      const { virtualCode } = getVirtualCode(fileName);

      return getComponentNames(ts, getProgram(), virtualCode);
    },
    getComponentProps(fileName, position) {
      const { sourceScript, virtualCode } = getVirtualCode(fileName);
      const tsLanguageService = getTsLanguageService();

      return getComponentProps(
        ts,
        tsLanguageService,
        tsLanguageService.getProgram()!,
        getLanguage(),
        asStringSourceScript(sourceScript),
        virtualCode,
        position,
      );
    },
    getComponentSlots(fileName) {
      const { virtualCode } = getVirtualCode(fileName);

      return getComponentSlots(ts, getProgram(), virtualCode);
    },
    getElementAttrs(fileName, tag) {
      return getElementAttrs(ts, getProgram(), fileName, tag);
    },
    getElementNames(fileName) {
      return getElementNames(ts, getProgram(), fileName);
    },
    isRefAtPosition(fileName, position) {
      const { sourceScript, virtualCode } = getVirtualCode(fileName);

      return isRefAtPosition(
        ts,
        getLanguage(),
        getProgram(),
        asStringSourceScript(sourceScript),
        virtualCode,
        position,
      );
    },
    resolveModuleName(fileName, moduleName, allowNonExistent) {
      return resolveModuleName(ts, getTsLanguageServiceHost(), fileName, moduleName, allowNonExistent);
    },
    async getQuickInfoAtPosition(fileName, position) {
      const uri = asUri(fileName);

      if (!getSourceScript(fileName)) {
        return;
      }
      const hover = await getLanguageService().getHover(uri, position);
      let text = '';
      if (typeof hover?.contents === 'string') {
        text = hover.contents;
      } else if (Array.isArray(hover?.contents)) {
        text = hover.contents.map(c => (typeof c === 'string' ? c : c.value)).join('\n');
      } else if (hover) {
        text = hover.contents.value;
      }
      text = text.replaceAll('```typescript', '');
      text = text.replaceAll('```', '');
      text = text.replaceAll('---', '');
      text = text.trim();
      while (true) {
        const newText = text.replaceAll('\n\n', '\n');
        if (newText === text) {
          break;
        }
        text = newText;
      }
      text = text.replaceAll('\n', ' | ');
      return text;
    },
    // 樣板內的 auto import 建議需要未經 volar 包裝的原始 TS language service 與
    // tsserver 的格式化設定，monaco worker 取不到，回傳 undefined 讓該功能靜默停用
    getAutoImportSuggestions() {
      return;
    },
    resolveAutoImportCompletionEntry() {
      return;
    },
    // 以下請求僅被 ignoreVueServicePlugins 內的 plugin 使用，實際不會被呼叫
    collectExtractProps() {
      throw new Error('Not implemented');
    },
    getImportPathForFile() {
      throw new Error('Not implemented');
    },
    getDocumentHighlights() {
      throw new Error('Not implemented');
    },
    getEncodedSemanticClassifications() {
      throw new Error('Not implemented');
    },
  });
  const ignoreVueServicePlugins = new Set([
    'vue-extract-file',
    'vue-document-drop',
    'vue-document-highlights',
    'typescript-semantic-tokens',
    // volar-service-pug 會被 package.json 的 browser field 換成 stub，
    // 其 create() 回傳的物件沒有 provide，而 vue-template 未加防護就讀取
    // provide['html/languageService'] 因而拋錯；pug 樣板在瀏覽器環境本就無法支援
    'vue-template (jade)',
  ]);

  return plugins.filter(plugin => !ignoreVueServicePlugins.has(plugin.name!));

  /** 官方 plugin 直接以檔名當 script id，此處的 language 改以 URI 索引，故統一由此轉換 */
  function getSourceScript(fileName: string) {
    return getLanguage().scripts.get(asUri(fileName));
  }

  function getVirtualCode(fileName: string) {
    const sourceScript = getSourceScript(fileName);

    if (!sourceScript) {
      throw new Error(`No source script found for file: ${fileName}`);
    }

    const virtualCode = sourceScript.generated?.root;

    if (!(virtualCode instanceof VueVirtualCode)) {
      throw new TypeError(`No virtual code found for file: ${fileName}`);
    }

    return {
      sourceScript,
      virtualCode,
    };
  }

  function getLanguage() {
    return getLanguageService().context.language;
  }

  function getTsLanguageService() {
    return getLanguageService().context.inject('typescript/languageService');
  }

  function getTsLanguageServiceHost() {
    return getLanguageService().context.inject('typescript/languageServiceHost');
  }

  function getProgram() {
    return getTsLanguageService().getProgram()!;
  }
}
