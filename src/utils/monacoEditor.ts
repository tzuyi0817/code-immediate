import { loadWASM } from 'onigasm';
import { Registry } from 'monaco-textmate';
import * as monaco from 'monaco-editor';
import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker.js?worker';
import TsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker.js?worker';
import JsonWorker from 'monaco-editor/esm/vs/language/json/json.worker.js?worker';
import CssWorker from 'monaco-editor/esm/vs/language/css/css.worker.js?worker';
import HtmlWorker from 'monaco-editor/esm/vs/language/html/html.worker.js?worker';
import { vueConfiguration } from '@/config/language-configuration/vue';

const baseUrl = import.meta.env.MODE === 'test' ? 'http://localhost:3000/' : '';

export async function initMonacoEditor() {
  await loadWASM(`${baseUrl}onigasm/onigasm.wasm`);
  const theme = await (await fetch('themes/themes.json')).json();

  monaco.editor.defineTheme('vs-code-theme-converted', theme);
  setCustomLanguage();
  window.MonacoEnvironment = {
    getWorker(_: string, label: string) {
      if (label === 'typescript' || label === 'javascript') return new TsWorker();
      if (label === 'json') return new JsonWorker();
      if (label === 'css' || label === 'scss' || label === 'less') return new CssWorker();
      if (label === 'html') return new HtmlWorker();
      return new EditorWorker();
    },
  };
}

function setCustomLanguage() {
  monaco.languages.register({ id: 'haml' });
  monaco.languages.register({ id: 'sass' });
  monaco.languages.register({ id: 'stylus' });
  monaco.languages.register({ id: 'postcss' });
  monaco.languages.register({ id: 'livescript' });
  monaco.languages.register({ id: 'vue' });
  monaco.languages.setLanguageConfiguration('vue', vueConfiguration);
  // monaco.languages.registerCompletionItemProvider('vue', {
  //   provideCompletionItems: () => {},
  // });
  // monaco.languages.registerHoverProvider('vue', {
  //   provideHover(model, position, token) {},
  // });
}

export function setTestEnvironmentLanguage() {
  monaco.languages.register({ id: 'html' });
  monaco.languages.register({ id: 'markdown' });
  setCustomLanguage();
}

export function registry() {
  return new Registry({
    getGrammarDefinition: async scopeName => {
      const scopeNameMap = {
        'text.html.basic': 'html.tmLanguage.json',
        'text.html.markdown': 'markdown.tmLanguage.json',
        'text.html.handlebars': 'Handlebars.tmLanguage.json',
        'text.html.derivative': 'html-derivative.tmLanguage.json',
        'text.html.javadoc': 'JavaDoc.tmLanguage',
        'text.html.textile': 'Textile.tmLanguage',
        'text.haml': 'Ruby Haml.tmLanguage',
        'text.pug': 'pug.tmLanguage.json',
        'text.xml': 'xml.tmLanguage.json',
        'text.xml.xsl': 'xsl.tmLanguage.json',
        'text.git-commit': 'git-commit.tmLanguage.json',
        'text.git-rebase': 'git-rebase.tmLanguage.json',
        'text.log': 'log.tmLanguage.json',
        'text.dart-doccomments': 'Dart Doc Comments.tmLanguage',
        'text.elixir': 'Elixir.tmLanguage',
        'source.css': 'css.tmLanguage.json',
        'source.css.scss': 'scss.tmLanguage.json',
        'source.scss': 'scss.tmLanguage.json',
        'source.sass': 'Sass.tmLanguage',
        'source.sassdoc': 'sassdoc.tmLanguage.json',
        'source.css.less': 'less.tmLanguage.json',
        'source.less': 'less.tmLanguage.json',
        'source.stylus': 'Stylus.tmLanguage',
        'source.postcss': 'PostCSS.tmLanguage',
        'source.js': 'javascript.tmLanguage.json',
        'source.ts': 'typescript.tmLanguage.json',
        'source.coffee': 'coffeescript.tmLanguage.json',
        'source.livescript': 'LiveScript.tmLanguage',
        'source.js.regexp': 'Regular Expressions (JavaScript).tmLanguage',
        'source.ini': 'ini.tmLanguage.json',
        'source.java': 'java.tmLanguage.json',
        'source.lua': 'lua.tmLanguage.json',
        'source.makefile': 'make.tmLanguage.json',
        'source.perl': 'perl.tmLanguage.json',
        'source.r': 'r.tmLanguage.json',
        'source.ruby': 'ruby.tmLanguage.json',
        'source.ruby.rails': 'ruby.tmLanguage.json',
        'source.php': 'php.tmLanguage.json',
        'source.sql': 'sql.tmLanguage.json',
        'source.asp.vb.net': 'asp-vb-net.tmlanguage.json',
        'source.yaml': 'yaml.tmLanguage.json',
        'source.batchfile': 'batchfile.tmLanguage.json',
        'source.clojure': 'clojure.tmLanguage.json',
        'source.c': 'c.tmLanguage.json',
        'source.cpp': 'cpp.tmLanguage.json',
        'source.diff': 'diff.tmLanguage.json',
        'source.dockerfile': 'docker.tmLanguage.json',
        'source.go': 'go.tmLanguage.json',
        'source.groovy': 'groovy.tmLanguage.json',
        'source.json': 'JSON.tmLanguage.json',
        'source.json.comments': 'JSONC.tmLanguage.json',
        'source.objc': 'objective-c.tmLanguage.json',
        'source.swift': 'swift.tmLanguage.json',
        'source.perl.6': 'perl6.tmLanguage.json',
        'source.powershell': 'powershell.tmLanguage.json',
        'source.python': 'MagicPython.tmLanguage.json',
        'source.regexp.python': 'MagicRegExp.tmLanguage.json',
        'source.rust': 'rust.tmLanguage.json',
        'source.scala': 'scala.tmlanguage.json',
        'source.shell': 'shell-unix-bash.tmLanguage.json',
        'source.tsx': 'TypeScriptReact.tmLanguage.json',
        'source.cs': 'csharp.tmLanguage.json',
        'source.fsharp': 'fsharp.tmLanguage.json',
        'source.dart': 'Dart.tmLanguage',
        'source.erlang': 'Erlang.tmLanguage',
        'source.elixir': 'Elixir.tmLanguage',
        'source.postscript': 'Postscript.tmLanguage',
        'source.c++': 'c.tmLanguage.json',
        'source.js.jquery': 'javascript.tmLanguage.json',
        'source.asm': 'rgbds-asm.tmLanguage',
        'source.x86': 'Assembly (x86).tmLanguage',
        'source.x86_64': 'Assembly (x86).tmLanguage',
        'source.arm': 'ARM.tmLanguage',
        'source.cpp.embedded.macro': 'cpp.embedded.macro.tmLanguage.json',
        'source.glsl': 'GLSL.tmLanguage',
        'source.applescript': 'applescript.tmLanguage.json',
        'source.vue': 'vue.tmLanguage.json',
        'source.graphql': 'GraphQL.tmLanguage',
        'source.js.jsx': 'JavaScript (JSX).tmLanguage',
        'source.toml': 'TOML.tmLanguage',
      };
      const source = scopeNameMap[scopeName as keyof typeof scopeNameMap];
      const plist = [
        'source.sass',
        'source.postcss',
        'source.js.regexp',
        'source.livescript',
        'source.dart',
        'source.erlang',
        'source.elixir',
        'source.postscript',
        'source.stylus',
        'source.asm',
        'source.x86',
        'source.x86_64',
        'source.arm',
        'source.glsl',
        'source.graphql',
        'source.js.jsx',
        'source.toml',
        'text.haml',
        'text.html.javadoc',
        'text.html.textile',
        'text.dart-doccomments',
        'text.elixir',
      ];
      return {
        format: plist.includes(scopeName) ? 'plist' : 'json',
        content: await (await fetch(`${baseUrl}grammars/${source}`)).text(),
      };
    },
  });
}

export const GRAMMARS_MAP = new Map([
  ['html', 'text.html.basic'],
  ['haml', 'text.haml'],
  ['markdown', 'text.html.markdown'],
  ['pug', 'text.pug'],
  ['css', 'source.css'],
  ['less', 'source.css.less'],
  ['scss', 'source.css.scss'],
  ['sass', 'source.sass'],
  ['stylus', 'source.stylus'],
  ['postcss', 'source.postcss'],
  ['javascript', 'source.js'],
  ['typescript', 'source.ts'],
  ['coffeescript', 'source.coffee'],
  ['livescript', 'source.livescript'],
  ['vue', 'source.vue'],
]);

export const COMMON_GRAMMARS_MAP = {
  babel: 'javascript',
};
