import * as monaco from 'monaco-editor';
import { createHighlighterCore } from 'shiki/core';
import { createJavaScriptRegexEngine } from 'shiki/engine-javascript.mjs';
import { shikiToMonaco } from '@shikijs/monaco';
import langVue from 'shiki/langs/vue.mjs';
import langHaml from 'shiki/langs/haml.mjs';
import langMarkdown from 'shiki/langs/markdown.mjs';
import langScss from 'shiki/langs/scss.mjs';
import langLess from 'shiki/langs/less.mjs';
import langSass from 'shiki/langs/sass.mjs';
import langStylus from 'shiki/langs/stylus.mjs';
import langPostcss from 'shiki/langs/postcss.mjs';
import langCoffeescript from 'shiki/langs/coffeescript.mjs';
import themeDark from 'shiki/themes/dark-plus.mjs';

export const SHIKI_HIGHLIGHT_LANG = new Set([
  'vue',
  'html',
  'haml',
  'markdown',

  'css',
  'scss',
  'less',
  'sass',
  'stylus',
  'postcss',

  'javascript',
  'typescript',
  'coffeescript',
]);

export async function registerShikiTheme() {
  const highlighter = await createHighlighterCore({
    themes: [themeDark],
    langs: [langVue, langHaml, langMarkdown, langScss, langLess, langSass, langStylus, langPostcss, langCoffeescript],
    engine: createJavaScriptRegexEngine(),
  });

  shikiToMonaco(highlighter, monaco);
}

export async function registerVsCodeTheme() {
  const theme = await (await fetch('themes/themes.json')).json();

  monaco.editor.defineTheme('vs-code-theme-converted', theme);
}
