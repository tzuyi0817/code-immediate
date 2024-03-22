import { VERSION } from '@/config/template';
import type { CreateHtmlParams } from '@/types/codeContent';

export function createHtml({ html, css, js, cssResources, jsResources, importMap }: CreateHtmlParams) {
  const head = createHead({ css, cssResources, jsResources, importMap });
  const body = createBody(html, js);
  return assembleHtml(head, body);
}

function createHead(params: Omit<CreateHtmlParams, 'js' | 'html'>) {
  const { css, cssResources, jsResources, importMap } = params;
  const links = cssResources.reduce((html: string, resource: string) => {
    return `${html}<link href="${resource}" rel="stylesheet">\n`;
  }, '');
  const esmImport = importMap
    ? `
    <script async src="lib/es-module-shims@${VERSION.ES_MODULE_SHIMS}.js"></script>
    <script type="importmap">${JSON.stringify(importMap, null, '\t')}</script>
  `
    : '';
  const scripts = jsResources.reduce((html: string, resource: string) => {
    return `${html}<script src="${resource}"></script>\n`;
  }, '');

  return `
    <title>code Demo</title>
    ${links}
    <style type="text/css">${css}</style>
    <script type="text/javascript" src="message/index.js"></script>
    ${esmImport}
    ${scripts}
  `;
}

function createBody(html: string, js: string) {
  return `
    ${html}
    ${js}
  `;
}

function assembleHtml(head: string, body: string) {
  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        ${head}
      </head>
      <body style="margin: 0">
        ${body}
      </body>
    </html>
  `;
}
