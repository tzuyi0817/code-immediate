import postcss from 'postcss';
import postcssNested from 'postcss-nested';
import typescript from 'typescript';
import { SCRIPT_TYPE_MAP, esModel } from '@/config/script-type';
import { IMPORT_MAP } from '@/config/import-map';
import { parseImport } from '@/utils/parse-import';
import { getTsConstructor } from '@/utils/cdn';
import type {
  CodeContent,
  CodeCompile,
  CompileParams,
  HtmlLanguages,
  CssLanguages,
  JsLanguages,
} from '@/types/code-content';
import type { Sass, Showdown } from '@/types/language';

let sass: Sass | null = null;
let showdown: Showdown | null = null;
let ts: typeof typescript | null = null;

export function compile(params: CompileParams): Promise<CodeContent> {
  const { html, css, js, codeTemplate } = params;
  const htmlPromise = transformHtml(html.content, html.language);
  const cssPromise = transformCss(css.content, css.language);
  const jsPromise = transformJs(js.content, js.language);

  return new Promise((resolve, reject) => {
    Promise.all([htmlPromise, cssPromise, jsPromise])
      .then(([htmlCode, cssCode, jsCode]) => {
        const scriptType = SCRIPT_TYPE_MAP[codeTemplate] ?? '';
        const isESM = scriptType === esModel;
        const { code, scripts = '' } = parseImport(jsCode, isESM);

        resolve({
          html: htmlCode,
          css: cssCode,
          js: scripts + (code ? `\n<script ${scriptType}>\n${code}\n</script>` : ''),
          importMap: IMPORT_MAP[codeTemplate],
        });
      })
      .catch(reject);
  });
}

export function transformHtml(htmlContent: string, language: HtmlLanguages) {
  const compileHtml = {
    Haml() {
      return self.Haml.render(htmlContent);
    },
    Markdown() {
      if (!showdown) showdown = new self.showdown.Converter();
      return showdown?.makeHtml(htmlContent.replaceAll(/\n[ \t]+#/g, '\n#'));
    },
    Slim() {},
    Pug() {
      return self.pug.render(htmlContent);
    },
  };
  return catchCompile({ language, compile: compileHtml, content: htmlContent });
}

export function transformCss(cssContent: string, language: CssLanguages) {
  const compileCss = {
    async Less() {
      const { css }: { css: string } = await self.less
        .render(cssContent)
        .catch((error: Error) => console.log(`syntax error, cause ${error}`));
      return css;
    },
    SCSS() {
      return compileScss(cssContent);
    },
    Sass() {
      return compileScss(cssContent, true);
    },
    Stylus(): Promise<string> {
      return new Promise((resolve, reject) => {
        self.stylus.render(cssContent, (error: Error, css: string) => {
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
      const { code } = self.Babel.transform(jsContent, {
        presets: ['env', 'react'],
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
      return self.CoffeeScript.compile(jsContent);
    },
    LiveScript() {
      return self.require('livescript').compile(jsContent);
    },
  };
  return catchCompile({ language, compile: compileJs, content: jsContent });
}

function compileScss(cssContent: string, indentedSyntax = false): Promise<string> {
  return new Promise(resolve => {
    if (!sass) sass = new self.Sass();
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
