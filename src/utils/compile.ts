import type { CodeContent } from '@/types/codeContent';

export function compile(content: CodeContent): Promise<CodeContent> {
  const { html, css, js } = content;
  const htmlPromise = html;
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

function transformCss(cssContent = '') {
  const regexp = /(@import\s+)('|")([^'"]+)('|")/g;
  return cssContent.replace(regexp, (str: string, ...matches: unknown[]) => {
    console.log({ str, matches })
    return str;
  });
}

function transformJs(jsContent = '') {
  return `<script>${jsContent}</script>`;
}
