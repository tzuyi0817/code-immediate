// @ts-nocheck
/* eslint-disable unicorn/prefer-add-event-listener */
import * as worker from 'monaco-editor/esm/vs/editor/editor.worker';
import type * as monaco from 'monaco-editor';
import {
  getFullLanguageServicePlugins,
  createVueLanguagePlugin,
  resolveVueCompilerOptions,
} from '@vue/language-service';
import { createTypeScriptWorkerLanguageService, type LanguageServiceEnvironment } from '@volar/monaco/worker';
import { createNpmFileSystem } from '@volar/jsdelivr';
import { URI } from 'vscode-uri';
import { getTsConstructor } from '@/utils/cdn';
import type { CreateData } from '@/monaco';

let ts: typeof import('typescript');

self.onmessage = async message => {
  if (message.data === 'initializing') {
    ts = await getTsConstructor();
    self.postMessage('loading finished');
    return;
  }

  worker.initialize((ctx: monaco.worker.IWorkerContext, { tsconfig, dependencies }: CreateData) => {
    const asFileName = (uri: URI) => uri.path;
    const asUri = (fileName: string) => URI.file(fileName);
    const getCdnPath = (uri: URI) => {
      if (uri.scheme !== 'file') return;
      if (uri.path === '/node_modules') return '';
      if (uri.path.startsWith('/node_modules/')) {
        return uri.path.slice('/node_modules/'.length);
      }
    };

    const getPackageVersion = (packageName: string) => dependencies[packageName];
    const env: LanguageServiceEnvironment = {
      workspaceFolders: [asUri('/')],
      fs: createNpmFileSystem(getCdnPath, getPackageVersion),
    };

    const { options: compilerOptions } = ts.convertCompilerOptionsFromJson(tsconfig?.compilerOptions ?? {}, '');
    const vueCompilerOptions = resolveVueCompilerOptions(tsconfig.vueCompilerOptions ?? {});

    return createTypeScriptWorkerLanguageService({
      typescript: ts,
      compilerOptions,
      workerContext: ctx,
      env,
      uriConverter: { asUri, asFileName },
      languagePlugins: [createVueLanguagePlugin(ts, compilerOptions, vueCompilerOptions, asFileName)],
      languageServicePlugins: getFullLanguageServicePlugins(ts),
      setup: ({ project }) => {
        project.vue = { compilerOptions: vueCompilerOptions };
      },
    });
  });
};
