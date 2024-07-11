import * as monaco from 'monaco-editor';
import { createHighlighterCore } from 'shiki/core';
import { shikiToMonaco } from '@shikijs/monaco';
import langVue from 'shiki/langs/vue.mjs';
import themeDark from 'shiki/themes/dark-plus.mjs';

export async function registerShikiTheme() {
  const highlighter = await createHighlighterCore({
    themes: [themeDark],
    langs: [langVue],
    loadWasm: import('shiki/wasm'),
  });

  shikiToMonaco(highlighter, monaco);
}

export async function registerVsCodeTheme() {
  const theme = await (await fetch('themes/themes.json')).json();

  monaco.editor.defineTheme('vs-code-theme-converted', theme);
}
