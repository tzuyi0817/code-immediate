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
  const { selectedLanguage: { html: language } } = useCodeContentStore();
  return htmlContent;
}

function transformCss(cssContent = '') {
  const { selectedLanguage: { css: language } } = useCodeContentStore();
  const regexp = /(@import\s+)('|")([^'"]+)('|")/g;
  return cssContent.replace(regexp, (str: string, ...matches: unknown[]) => {
    console.log({ str, matches })
    return str;
  });
}

function transformJs(jsContent = '') {
  const { selectedLanguage: { javascript: language } } = useCodeContentStore();
  const compile = {
    Babel() {},
    TypeScript() {
      return jsContent;
    },
    CoffeeScript() {},
    LiveScript() {},
  };

  jsContent = compile[language as keyof typeof compile]?.() ?? jsContent;
  return `<script>${jsContent}</script>`;
}
