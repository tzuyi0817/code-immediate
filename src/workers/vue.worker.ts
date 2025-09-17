/* eslint-disable unicorn/prefer-add-event-listener */
import { createNpmFileSystem } from '@volar/jsdelivr';
import {
  createTypeScriptWorkerLanguageService,
  type Language,
  type LanguageServiceEnvironment,
} from '@volar/monaco/worker';
import {
  createVueLanguagePlugin,
  generateGlobalTypes,
  getDefaultCompilerOptions,
  getGlobalTypesFileName,
  VueVirtualCode,
  type VueCompilerOptions,
} from '@vue/language-core';
import { createVueLanguageServicePlugins, type LanguageService } from '@vue/language-service';
import { createVueLanguageServiceProxy } from '@vue/typescript-plugin/lib/common';
import { getComponentDirectives } from '@vue/typescript-plugin/lib/requests/getComponentDirectives';
import { getComponentEvents } from '@vue/typescript-plugin/lib/requests/getComponentEvents';
import { getComponentNames } from '@vue/typescript-plugin/lib/requests/getComponentNames';
import { getComponentProps } from '@vue/typescript-plugin/lib/requests/getComponentProps';
import { getComponentSlots } from '@vue/typescript-plugin/lib/requests/getComponentSlots';
import { getElementAttrs } from '@vue/typescript-plugin/lib/requests/getElementAttrs';
import { getElementNames } from '@vue/typescript-plugin/lib/requests/getElementNames';
import { isRefAtPosition } from '@vue/typescript-plugin/lib/requests/isRefAtPosition';
import * as worker from 'monaco-editor/esm/vs/editor/editor.worker';
import { create as createTypeScriptDirectiveCommentPlugin } from 'volar-service-typescript/lib/plugins/directiveComment';
import { create as createTypeScriptSemanticPlugin } from 'volar-service-typescript/lib/plugins/semantic';
import { getTsConstructor } from '@/utils/cdn';
import type { CreateData } from '@/monaco';
import { asFileName, asUri, getCdnPath } from './utils';
import type * as monaco from 'monaco-editor';

let ts: typeof import('typescript');

self.onmessage = async message => {
  if (message.data === 'initializing') {
    ts = await getTsConstructor();
    self.postMessage('loading finished');
    return;
  }

  worker.initialize((ctx: monaco.worker.IWorkerContext, { tsconfig, dependencies }: CreateData) => {
    const getPackageVersion = (packageName: string) => dependencies[packageName];

    const env: LanguageServiceEnvironment = {
      workspaceFolders: [asUri('/')],
      fs: createNpmFileSystem(getCdnPath, getPackageVersion),
    };

    const tsCompilerOptions = tsconfig?.compilerOptions ?? {};
    const { options: compilerOptions } = ts.convertCompilerOptionsFromJson(tsCompilerOptions, '');
    const vueCompilerOptions: VueCompilerOptions = {
      ...getDefaultCompilerOptions(),
      ...tsconfig.vueCompilerOptions,
    };

    setupGlobalTypes(vueCompilerOptions, env);

    const workerService = createTypeScriptWorkerLanguageService({
      typescript: ts,
      compilerOptions,
      workerContext: ctx,
      env,
      uriConverter: { asUri, asFileName },
      languagePlugins: [createVueLanguagePlugin(ts, compilerOptions, vueCompilerOptions, asFileName)],
      languageServicePlugins: [
        ...getTsLanguageServicePlugins(vueCompilerOptions),
        ...getVueLanguageServicePlugins(getLanguageService),
      ],
    });

    function getLanguageService() {
      return (workerService as any).languageService as LanguageService;
    }

    return workerService;
  });
};

function setupGlobalTypes(options: VueCompilerOptions, env: LanguageServiceEnvironment) {
  if (!env.fs) return;

  const globalTypes = generateGlobalTypes(options);
  const globalTypesPath = `/node_modules/${getGlobalTypesFileName(options)}`;
  const { stat, readFile } = env.fs;
  const ctime = Date.now();

  options.globalTypesPath = () => globalTypesPath;
  env.fs.stat = async uri => {
    if (uri.path === globalTypesPath) {
      return { type: 1, ctime, mtime: ctime, size: globalTypes.length };
    }

    return stat(uri);
  };

  env.fs.readFile = async uri => {
    if (uri.path === globalTypesPath) {
      return globalTypes;
    }

    return readFile(uri);
  };
}

function getTsLanguageServicePlugins(vueCompilerOptions: VueCompilerOptions) {
  const semanticPlugin = createTypeScriptSemanticPlugin(ts);
  const { create } = semanticPlugin;

  semanticPlugin.create = context => {
    const created = create(context);
    const languageService = created.provide['typescript/languageService']();
    const language = new Proxy(
      {},
      {
        get(_target, prop, receiver) {
          return Reflect.get(context.language, prop, receiver);
        },
      },
    ) as Language;

    const proxy = createVueLanguageServiceProxy(ts, language, languageService, vueCompilerOptions, asUri);

    languageService.getCompletionsAtPosition = proxy.getCompletionsAtPosition;
    languageService.getCompletionEntryDetails = proxy.getCompletionEntryDetails;
    languageService.getCodeFixesAtPosition = proxy.getCodeFixesAtPosition;
    languageService.getDefinitionAndBoundSpan = proxy.getDefinitionAndBoundSpan;
    languageService.getQuickInfoAtPosition = proxy.getQuickInfoAtPosition;

    return created;
  };
  return [semanticPlugin, createTypeScriptDirectiveCommentPlugin()];
}

function getVueLanguageServicePlugins(getLanguageService: () => LanguageService) {
  const plugins = createVueLanguageServicePlugins(ts, {
    getComponentDirectives(fileName) {
      return getComponentDirectives(ts, getProgram(), fileName);
    },
    getComponentEvents(fileName, tag) {
      return getComponentEvents(ts, getProgram(), fileName, tag);
    },
    getComponentNames(fileName) {
      return getComponentNames(ts, getProgram(), fileName);
    },
    getComponentProps(fileName, tag) {
      return getComponentProps(ts, getProgram(), fileName, tag);
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
        getLanguageService().context.language,
        getProgram(),
        sourceScript,
        virtualCode,
        position,
      );
    },
    async getQuickInfoAtPosition(fileName, position) {
      const uri = asUri(fileName);
      const sourceScript = getLanguageService().context.language.scripts.get(uri);
      if (!sourceScript) {
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
    getReactiveReferences() {
      throw new Error('Not implemented');
    },
  });
  const ignoreVueServicePlugins = new Set([
    'vue-extract-file',
    'vue-document-drop',
    'vue-document-highlights',
    'typescript-semantic-tokens',
  ]);

  return plugins.filter(plugin => !ignoreVueServicePlugins.has(plugin.name!));

  function getVirtualCode(fileName: string) {
    const uri = asUri(fileName);
    const sourceScript = getLanguageService().context.language.scripts.get(uri);

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

  function getProgram() {
    const tsService = getLanguageService().context.inject('typescript/languageService');

    return tsService.getProgram()!;
  }
}
