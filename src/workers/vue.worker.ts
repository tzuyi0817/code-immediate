import * as worker from 'monaco-editor/esm/vs/editor/editor.worker';
import type * as monaco from 'monaco-editor';
import { createJsDelivrFs, createJsDelivrUriResolver, decorateServiceEnvironment } from '@volar/cdn';
import { resolveConfig } from '@vue/language-service';
import { createLanguageHost, createLanguageService, createServiceEnvironment } from '@volar/monaco/worker';
import * as ts from 'typescript';
import type { CreateData } from '@/utils/monacoEditor';

self.onmessage = () => {
  worker.initialize((ctx: monaco.worker.IWorkerContext, { tsconfig, dependencies }: CreateData) => {
    const { options: compilerOptions } = ts.convertCompilerOptionsFromJson(tsconfig?.compilerOptions || {}, '');
    const env = createServiceEnvironment();
    const host = createLanguageHost(ctx.getMirrorModels, env, '/src', compilerOptions);
    const jsDelivrFs = createJsDelivrFs();
    const jsDelivrUriResolver = createJsDelivrUriResolver('/node_modules', dependencies);

    decorateServiceEnvironment(env, jsDelivrUriResolver, jsDelivrFs);

    return createLanguageService(
      { typescript: ts },
      env,
      resolveConfig(ts, {}, compilerOptions, tsconfig.vueCompilerOptions || {}),
      host,
    );
  });
};
