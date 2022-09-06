import type { CodeContent } from '@/types/codeContent';

export function compile(content: CodeContent): Promise<CodeContent> {
  const { html, css } = content;
  const htmlPromise = html;
  const cssPromise = transformCss(css);

  return new Promise((resolve, reject) => {
    Promise.all([htmlPromise, cssPromise])
      .then(([htmlCode, cssCode]) => {
        resolve({
          html: htmlCode,
          css: cssCode,
        });
      })
      .catch(reject);
  })
}

const transformCss = (cssContent = '') => {
  const regexp = /(@import\s+)('|")([^'"]+)('|")/g;
  return cssContent.replace(regexp, (str: string, ...matches: unknown[]) => {
    console.log({ str, matches })
    return str;
    // const source = isBareImport(matches[2]) ? handleEsModuleCdnUrl(matches[2], false) : matches[2];
    // return `${matches[0]}${matches[1]}${source}${matches[1]}`;
  })
}