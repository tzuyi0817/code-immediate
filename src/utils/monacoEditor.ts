import { loadWASM } from 'onigasm';
import { Registry } from 'monaco-textmate';
import { editor, languages } from 'monaco-editor/esm/vs/editor/editor.api';

export async function initMonacoEditor() {
  await loadWASM('/onigasm/onigasm.wasm');
  const theme = await (await fetch('themes/themes.json')).json();
  languages.register({ id: "html" });
  languages.register({ id: "css" });
  languages.register({ id: "javascript" });
  editor.defineTheme('vs-code-theme-converted', theme);
}

export function registry(file: string) {
  return new Registry({
    getGrammarDefinition: async () => {
      return {
        format: 'json',
        content: await (await fetch(`/grammars/${file}.json`)).text(),
      }
    }
  });
}

export const GRAMMARS_MAP = new Map([
  ['html', 'text.html.basic'],
  ['css', 'source.css'],
  ['javascript', 'source.js'],
]);