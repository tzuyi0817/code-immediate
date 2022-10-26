import { useCodeContentStore } from '@/store';
import type { CodeContent } from '@/types/codeContent';

export function createHtml({ html, css, js }: CodeContent) {
  const head = createHead(css);
  const body = createBody(html, js);
  return assembleHtml(head, body);
}

function createHead(css: string) {
  const { codeContent: { CSS, JS }, importMap } = useCodeContentStore();
  const cssResources = CSS.resources.reduce((html: string, resource: string) => {
    return html + `<link href="${resource}" rel="stylesheet">\n`;
  }, '');
  const esmImport = importMap ? `
    <script async src="lib/es-module-shims@1.5.5.js"><\/script>
    <script type="importmap">${JSON.stringify(importMap, null, '\t')}<\/script>
  ` : '';
  const jsResources = JS.resources.reduce((html: string, resource: string) => {
    return html + `<script src="${resource}"><\/script>\n`;
  }, '');

  return `
    <title>code Demo<\/title>
    ${cssResources}
    <style type="text/css">${css}<\/style>
    <script type="text/javascript" src="message/index.js"><\/script>
    ${esmImport}
    ${jsResources}
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
      <body>
        ${body}
      </body>
    </html>
  `;
}