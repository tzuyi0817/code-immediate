import { shikiToMonaco } from '@shikijs/monaco';
import * as monaco from 'monaco-editor';
import { createHighlighterCoreSync } from 'shiki/core';
import { createJavaScriptRegexEngine } from 'shiki/engine-javascript.mjs';
import langCoffeescript from 'shiki/langs/coffeescript.mjs';
import langHaml from 'shiki/langs/haml.mjs';
import langJsx from 'shiki/langs/jsx.mjs';
import langLess from 'shiki/langs/less.mjs';
import langMarkdown from 'shiki/langs/markdown.mjs';
import langPostcss from 'shiki/langs/postcss.mjs';
import langSass from 'shiki/langs/sass.mjs';
import langScss from 'shiki/langs/scss.mjs';
import langStylus from 'shiki/langs/stylus.mjs';
import langTsx from 'shiki/langs/tsx.mjs';
import langVue from 'shiki/langs/vue.mjs';
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
  'jsx',
  'tsx',
]);

export function registerShikiTheme() {
  const highlighter = createHighlighterCoreSync({
    themes: [themeDark],
    langs: [
      langVue,
      langTsx,
      langJsx,
      langHaml,
      langMarkdown,
      langScss,
      langLess,
      langSass,
      langStylus,
      langPostcss,
      langCoffeescript,
    ],
    engine: createJavaScriptRegexEngine(),
  });

  shikiToMonaco(highlighter, monaco);
}

export async function registerVsCodeTheme() {
  const theme = await (await fetch('themes/themes.json')).json();

  monaco.editor.defineTheme('vs-code-theme-converted', theme);
}
