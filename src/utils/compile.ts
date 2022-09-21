import { useCodeContentStore } from '@/store';
import type { CodeContent } from '@/types/codeContent';

let sass: any = null;

export function compile(content: CodeContent): Promise<CodeContent> {
  const { html, css, js } = content;
  const htmlPromise = transformHtml(html);
  const cssPromise = transformCss(css);
  const jsPromise = transformJs(js);

  return new Promise((resolve, reject) => {
    Promise.all([htmlPromise, cssPromise, jsPromise])
      .then(([htmlCode, cssCode, jsCode]) => {
        resolve({
          html: htmlCode,
          css: cssCode,
          js: jsCode,
        });
      })
      .catch(reject);
  })
}

function transformHtml(htmlContent = '') {
  const { codeContent: { HTML: { language } } } = useCodeContentStore();
  const compile = {
    Haml() {},
    Markdown() {},
    Slim() {},
    Pug() {
      return self.pug.render(htmlContent);
    },
  }
  return compile[language as keyof typeof compile]?.() ?? htmlContent;
}

async function transformCss(cssContent = '') {
  const { codeContent: { CSS: { language } } } = useCodeContentStore();
  const compile = {
    Less() {},
    SCSS(): Promise<string> {
      return new Promise(resolve => {
        if (!sass) sass = new self.Sass();
        sass.compile(
          cssContent,
          { indentedSyntax: false },
          ({ text }: { text: string }) => resolve(text)
        );
      })
    },
    Sass() {},
    Stylus() {},
    PostCSS() {},
  }
  return await compile[language as keyof typeof compile]?.() ?? cssContent;
}

function transformJs(jsContent = '') {
  const { codeContent: { JS: { language } } } = useCodeContentStore();
  const compile = {
    Babel() {
      const { code } = self.Babel.transform(jsContent, {
        presets: ['env'],
      });
      return code;
    },
    TypeScript() {
      const { outputText } = self.ts.transpileModule(jsContent, {
        reportDiagnostics: true,
        compilerOptions: { module: 'es2015' },
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

  jsContent = compile[language as keyof typeof compile]?.() ?? jsContent;
  return `<script>${jsContent}</script>`;
}
