import type { CodeContent } from '@/types/codeContent';

export function compile(content: CodeContent) {
  const { html, css } = content;
  transformCss(css);
  return html;
}

const transformCss = (cssContent = '') => {
  return cssContent.replace(/(@import\s+)('|")([^'"]+)('|")/g, (str, ...matches) => {
    console.log({ str, matches })
    // const source = isBareImport(matches[2]) ? handleEsModuleCdnUrl(matches[2], false) : matches[2];
    // return `${matches[0]}${matches[1]}${source}${matches[1]}`;
  })
}