// @ts-expect-error
import * as worker from 'monaco-editor/esm/vs/editor/editor.worker';
import type * as monaco from 'monaco-editor';
import { type ServiceEnvironment, createTypeScriptWorkerService } from '@volar/monaco/worker';
import * as ts from 'typescript';
import { create as createTypeScriptService } from 'volar-service-typescript';

self.onmessage = () => {
  worker.initialize((ctx: monaco.worker.IWorkerContext) => {
    const env: ServiceEnvironment = {
      workspaceFolder: 'file:///',
      typescript: {
        uriToFileName: uri => uri.substring('file://'.length),
        fileNameToUri: fileName => `file://${fileName}`,
      },
    };
    const compilerOptions: ts.CompilerOptions = {
      ...ts.getDefaultCompilerOptions(),
      allowJs: true,
      jsx: ts.JsxEmit.Preserve,
      module: ts.ModuleKind.ESNext,
      moduleResolution: ts.ModuleResolutionKind.NodeJs,
    };

    return createTypeScriptWorkerService({
      typescript: ts,
      compilerOptions,
      workerContext: ctx,
      env,
      servicePlugins: createTypeScriptService(ts),
    });
  });
};
