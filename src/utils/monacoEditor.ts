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
  // monaco.languages.typescript.typescriptDefaults.setEagerModelSync(true);
  // monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
  //   noSemanticValidation: true,
  //   noSyntaxValidation: false
  // });

  // monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
  //   target: monaco.languages.typescript.ScriptTarget.ES2016,
  //   allowNonTsExtensions: true
  // });

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
      const scopeNameMap = {
        'text.html.basic': 'html.tmLanguage.json',
        'text.pug': 'pug.tmLanguage.json',
        'source.css': 'css.tmLanguage.json',
        'source.css.scss': 'scss.tmLanguage.json',
        'source.sass': 'scss.tmLanguage.json',
        'source.sassdoc': 'sassdoc.tmLanguage.json',
        'source.css.less': 'less.tmLanguage.json',
        'source.less': 'less.tmLanguage.json',
        'source.stylus': 'css.tmLanguage.json',
        'source.js': 'javascript.tmLanguage.json',
        'source.ts': 'typescript.tmLanguage.json',
        'source.coffee': 'coffeescript.tmLanguage.json',
        'source.js.regexp': 'Regular Expressions (JavaScript).tmLanguage',
      };
      const json = scopeNameMap[scopeName as keyof typeof scopeNameMap];
      return {
        format: scopeName.includes('regexp') ? 'plist' : 'json',
        content: await (await fetch(`/grammars/${json}`)).text(),
      }
    }
  });
}

export const GRAMMARS_MAP = new Map([
  ['html', 'text.html.basic'],
  ['pug', 'text.pug'],
  ['css', 'source.css'],
  ['less', 'source.css.less'],
  ['scss', 'source.css.scss'],
  ['javascript', 'source.js'],
  ['typescript', 'source.ts'],
  ['coffeescript', 'source.coffee'],
]);

export const COMMON_GRAMMARS_MAP = {
  sass: 'scss',
  babel: 'javascript',
  livescript: 'javascript',
};
