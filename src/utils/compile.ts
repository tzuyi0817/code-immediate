import { toRaw } from 'vue';
import { useCodeContentStore } from '@/store';
import type { CodeContent } from '@/types/codeContent';

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

function transformCss(cssContent = '') {
  const { codeContent: { CSS: { language } } } = useCodeContentStore();
  const regexp = /(@import\s+)('|")([^'"]+)('|")/g;
  return cssContent.replace(regexp, (str: string, ...matches: unknown[]) => {
    console.log({ str, matches })
    return str;
  });
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
    CoffeeScript() {},
    LiveScript() {},
  };

  jsContent = compile[language as keyof typeof compile]?.() ?? jsContent;
  return `<script>${jsContent}</script>`;
}
