import * as worker from 'monaco-editor/esm/vs/editor/editor.worker';
import type * as monaco from 'monaco-editor';
import { URI } from 'vscode-uri';
import {
  getVueLanguageServicePlugins,
  createVueLanguagePlugin,
  resolveVueCompilerOptions,
} from '@vue/language-service';
import {
  activateAutomaticTypeAcquisition,
  createTypeScriptWorkerService,
  type LanguageServiceEnvironment,
} from '@volar/monaco/worker';
import * as ts from 'typescript';
import type { CreateData } from '@/utils/monacoEditor';

self.onmessage = () => {
  worker.initialize((ctx: monaco.worker.IWorkerContext, { tsconfig }: CreateData) => {
    const { options: compilerOptions } = ts.convertCompilerOptionsFromJson(tsconfig?.compilerOptions ?? {}, '');
    const vueCompilerOptions = resolveVueCompilerOptions(tsconfig.vueCompilerOptions ?? {});
    const uriToFileName = (uri: URI) => uri.path;
    const env: LanguageServiceEnvironment = { workspaceFolders: [URI.parse('file:///')] };
    const uriConverter = {
      asUri: (fileName: string) => URI.file(fileName),
      asFileName: uriToFileName,
    };
    const getProjectVersion = () =>
      tsconfig.vueCompilerOptions?.target ? `${tsconfig.vueCompilerOptions.target}` : '';
    const isRootFile = () => true;

    activateAutomaticTypeAcquisition(env, { asFileName: uriToFileName });

    return createTypeScriptWorkerService({
      typescript: ts,
      compilerOptions,
      workerContext: ctx,
      env,
      uriConverter,
      languagePlugins: [
        createVueLanguagePlugin(ts, uriToFileName, getProjectVersion, isRootFile, compilerOptions, vueCompilerOptions),
      ],
      servicePlugins: getVueLanguageServicePlugins(ts, () => vueCompilerOptions),
    });
  });
};
