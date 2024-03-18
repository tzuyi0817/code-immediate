// @ts-expect-error
import * as worker from 'monaco-editor/esm/vs/editor/editor.worker';
import type * as monaco from 'monaco-editor';
import { type ServiceEnvironment, createTypeScriptWorkerService } from '@volar/monaco/worker';
// import { create as createTypeScriptService } from 'volar-service-typescript';

self.onmessage = (msg: MessageEvent) => {
  worker.initialize(async (ctx: monaco.worker.IWorkerContext) => {
    const ts = await import('typescript');
    const env: ServiceEnvironment = {
      workspaceFolder: 'file:///',
      typescript: {
        uriToFileName: uri => uri.substring('file://'.length),
        fileNameToUri: fileName => `file://${fileName}`,
      },
    };

    self.postMessage({ msg });
    return createTypeScriptWorkerService({
      typescript: ts,
      compilerOptions: {},
      workerContext: ctx,
      env,
      // servicePlugins: [createTypeScriptService(ts)],
    });
  });
};
