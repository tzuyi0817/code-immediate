// @ts-expect-error
import * as worker from 'monaco-editor/esm/vs/editor/editor.worker';
import { createLanguageService } from '@volar/monaco/worker';

self.onmessage = (msg: MessageEvent) => {
  console.log({ worker, createLanguageService, msg });
  // worker.initialize(() => {
  //   return createLanguageService();
  // });
};
