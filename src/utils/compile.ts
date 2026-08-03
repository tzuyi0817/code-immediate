import postcss from 'postcss';
import postcssNested from 'postcss-nested';
import { IMPORT_MAP } from '@/constants/import-map';
import { esModel, SCRIPT_TYPE_MAP } from '@/constants/script-type';
import { getTsConstructor } from '@/utils/cdn';
import { parseImport } from '@/utils/parse-import';
import type {
  CodeCompile,
  CodeContent,
  CompileParams,
  CssLanguages,
  HtmlLanguages,
  JsLanguages,
} from '@/types/code-content';
import type { Sass, Showdown } from '@/types/language';
import type typescript from 'typescript';

let sass: Sass | null = null;
let showdown: Showdown | null = null;
let ts: typeof typescript | null = null;

export async function compile(params: CompileParams): Promise<CodeContent> {
  const { html, css, js, codeTemplate } = params;
  const [htmlCode, cssCode, jsCode] = await Promise.all([
    transformHtml(html.content, html.language),
    transformCss(css.content, css.language),
    transformJs(js.content, js.language),
  ]);
  const scriptType = SCRIPT_TYPE_MAP[codeTemplate] ?? '';
  const isESM = scriptType === esModel;
  const { code, scripts = '' } = parseImport(jsCode, isESM);

  return {
    html: htmlCode,
    css: cssCode,
    js: scripts + (code ? `\n<script ${scriptType}>\n${code}\n</script>` : ''),
    importMap: IMPORT_MAP[codeTemplate],
  };
}

export function transformHtml(htmlContent: string, language: HtmlLanguages) {
  const compileHtml = {
    Haml() {
      return globalThis.Haml.render(htmlContent);
    },
    Markdown() {
      if (!showdown) showdown = new globalThis.showdown.Converter();
      return showdown?.makeHtml(htmlContent.replaceAll(/\n[ \t]+#/g, '\n#'));
    },
    Slim() {},
    Pug() {
      return globalThis.pug.render(htmlContent);
    },
  };
  return catchCompile({ language, compile: compileHtml, content: htmlContent });
}

export function transformCss(cssContent: string, language: CssLanguages) {
  const compileCss = {
    async Less() {
      try {
        const { css }: { css: string } = await globalThis.less.render(cssContent);

        return css;
      } catch (error) {
        console.error(`syntax error, cause ${error}`);
        throw error;
      }
    },
    SCSS() {
      return compileScss(cssContent);
    },
    Sass() {
      return compileScss(cssContent, true);
    },
    Stylus(): Promise<string> {
      return new Promise((resolve, reject) => {
        globalThis.stylus.render(cssContent, (error: Error, css: string) => {
          if (error) reject(error);
          resolve(css);
        });
      });
    },
    async PostCSS() {
      const autoprefixer = await import('autoprefixer');
      const processor = postcss([autoprefixer.default, postcssNested]);
      const { css } = processor.process(cssContent);

      return css;
    },
  };
  return catchCompile({
    language,
    compile: compileCss,
    content: cssContent,
  });
}

export async function transformJs(jsContent: string, language: JsLanguages) {
  const compileJs = {
    Babel() {
      const { code } = globalThis.Babel.transform(jsContent, {
        presets: [['env', { modules: false }], 'react'],
      });

      return code;
    },
    async TypeScript() {
      ts = await getTsConstructor();

      const { ModuleKind, JsxEmit, transpileModule } = ts;
      const { outputText } = transpileModule(jsContent, {
        reportDiagnostics: true,
        compilerOptions: {
          module: ModuleKind.ESNext,
          jsx: JsxEmit.Preserve,
        },
      });

      return outputText;
    },
    CoffeeScript() {
      return globalThis.CoffeeScript.compile(jsContent);
    },
    LiveScript() {
      // 全域的 require 由 public/parses/livescript.js（browserify bundle）掛上，並非 CJS 模組載入器，
      // 取出後改名以區別於真正的 require import
      const { require: livescriptRequire } = globalThis;
      const code = livescriptRequire('livescript').compile(jsContent, {
        bare: true, // 不要在外面包一層 function
        header: false, // 不要產生 LiveScript 版本註解
      });

      return code.replaceAll(/import\$\(this,\s+(\w+)\(from\(['"](.+?)['"]\)\)\);/g, "import $1 from '$2';");
    },
  };
  return catchCompile({ language, compile: compileJs, content: jsContent });
}

function compileScss(cssContent: string, indentedSyntax = false): Promise<string> {
  return new Promise(resolve => {
    if (!sass) sass = new globalThis.Sass();

    sass?.compile(cssContent, { indentedSyntax }, ({ text }: { text: string }) => resolve(text));
  });
}

function catchCompile({ language, compile: compileCode, content }: CodeCompile): Promise<string> {
  const compilePromise = compileCode[language];

  if (!compilePromise) return Promise.resolve(content);
  try {
    return compilePromise();
  } catch (error) {
    return Promise.reject(error);
  }
}
