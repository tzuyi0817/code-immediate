import { loadWASM } from 'onigasm';
import { Registry } from 'monaco-textmate';
import * as monaco from 'monaco-editor';
import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker.js?worker';
import TsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker.js?worker';
import JsonWorker from 'monaco-editor/esm/vs/language/json/json.worker.js?worker';
import CssWorker from 'monaco-editor/esm/vs/language/css/css.worker.js?worker';
import HtmlWorker from 'monaco-editor/esm/vs/language/html/html.worker.js?worker';

export async function initMonacoEditor() {
  await loadWASM('/onigasm/onigasm.wasm');
  const theme = await (await fetch('themes/themes.json')).json();

  monaco.editor.defineTheme('vs-code-theme-converted', theme);
  monaco.languages.typescript.typescriptDefaults.setEagerModelSync(true);
  monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
    noSemanticValidation: true,
    noSyntaxValidation: false
  });

  monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
    target: monaco.languages.typescript.ScriptTarget.ES2016,
    allowNonTsExtensions: true
  });

  window.MonacoEnvironment = {
    getWorker(_: string, label: string) {
      if (label === 'typescript' || label === 'javascript') return new TsWorker();
      if (label === 'json') return new JsonWorker();
      if (label === 'css' || label === 'scss' || label === 'less') return new CssWorker();
      if (label === 'html') return new HtmlWorker();
      return new EditorWorker();
    }
  }
}

export function registry() {
  return new Registry({
    getGrammarDefinition: async (scopeName) => {
      return {
        format: 'json',
        content: await (await fetch(`/grammars/${scopeName}.tmLanguage.json`)).text(),
      }
    }
  });
}

export const GRAMMARS_MAP = new Map([
  ['html', 'text.html.basic'],
  ['css', 'source.css'],
  ['javascript', 'source.js'],
]);
