import postcss from 'postcss';
import postcssNested from 'postcss-nested';
import autoprefixer from 'autoprefixer';
import typescript from 'typescript';
import { useCodeContentStore } from '@/store';
import type { CodeContent, CodeCompile } from '@/types/codeContent';

let sass: any = null;
let showdown: any = null;

export function compile(content: CodeContent): Promise<CodeContent> {
  const { html, css, js } = content;
  const htmlPromise = transformHtml(html);
  const cssPromise = transformCss(css);
  const jsPromise = transformJs(js);

  return new Promise((resolve, reject) => {
    Promise.all([htmlPromise, cssPromise, jsPromise])
      .then(([htmlCode, cssCode, jsCode]) => {
        const { codeTemplate } = useCodeContentStore();
        const scripType = codeTemplate === 'React' ? 'type="text/babel"' : '';

        resolve({
          html: htmlCode,
          css: cssCode,
          js: `<script ${scripType}>${jsCode}<\/script>`,
        });
      })
      .catch(reject);
  })
}

function transformHtml(htmlContent = '') {
  const { codeContent: { HTML: { language } } } = useCodeContentStore();
  const compile = {
    Haml() {
      return self.Haml.render(htmlContent);
    },
    Markdown() {
      if (!showdown) showdown = new self.showdown.Converter();
      return showdown.makeHtml(htmlContent);
    },
    Slim() {},
    Pug() {
      return self.pug.render(htmlContent);
    },
  }
  return catchCompile({ language, compile, content: htmlContent });
}

function transformCss(cssContent = '') {
  const { codeContent: { CSS: { language } } } = useCodeContentStore();
  const compile = {
    async Less() {
      const { css }: { css: string } = await self.less.render(cssContent)
        .catch((error: Error) => console.log('syntax error'));
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
      const processor = postcss([autoprefixer, postcssNested]);
      const { css } = processor.process(cssContent);
      return css;
    },
  };
  return catchCompile({ language, compile, content: cssContent });
}

async function transformJs(jsContent = '') {
  const { codeContent: { JS: { language } } } = useCodeContentStore();
  const compile = {
    Babel() {
      const { code } = self.Babel.transform(jsContent, {
        presets: ['env', 'react'],
      });
      return code;
    },
    TypeScript() {
      const { ModuleKind, JsxEmit } = typescript;
      const { outputText } = typescript.transpileModule(jsContent, {
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
  return catchCompile({ language, compile, content: jsContent });
}

function compileScss(cssContent: string, indentedSyntax = false): Promise<string> {
  return new Promise(resolve => {
    if (!sass) sass = new self.Sass();
    sass.compile(
      cssContent,
      { indentedSyntax },
      ({ text }: { text: string }) => resolve(text)
    );
  });
}

function catchCompile({ language, compile, content }: CodeCompile): Promise<string> {
  return new Promise(async (resolve, reject) => {
    try {
      const result = await compile[language]?.() ?? content;
      resolve(result);
    } catch (error) {
      reject(error);
    }
  });
}
