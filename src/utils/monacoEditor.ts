import { loadWASM } from 'onigasm';
import { Registry } from 'monaco-textmate';
import { editor, languages } from 'monaco-editor';
import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
import TsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker';
import JsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';
import CssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker';
import HtmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker';

export async function initMonacoEditor() {
  await loadWASM('/onigasm/onigasm.wasm');
  const theme = await (await fetch('themes/themes.json')).json();

  editor.defineTheme('vs-code-theme-converted', theme);
  languages.typescript.javascriptDefaults.setDiagnosticsOptions({
    noSemanticValidation: true,
    noSyntaxValidation: false
  });

  languages.typescript.javascriptDefaults.setCompilerOptions({
    target: languages.typescript.ScriptTarget.ES2016,
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