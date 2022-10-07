import { useCodeContentStore } from '@/store';
import type { CodeContent } from '@/types/codeContent';

export function createHtml({ html, css, js }: CodeContent) {
  const head = createHead(css);
  const body = createBody(html, js);
  return assembleHtml(head, body);
}

function createHead(css: string) {
  const { codeContent: { JS } } = useCodeContentStore();
  const esmImport = JS.import ? `
    <script async src="lib/es-module-shims@1.5.5.js"><\/script>
    ${JS.import}
  ` : '';

  return `
    <title>code Demo<\/title>
    <style type="text/css">${css}<\/style>
    <script type="text/javascript" src="message/index.js"><\/script>
    ${esmImport}
  `;
}

function createBody(html: string, js: string) {
  const { codeContent: { JS } } = useCodeContentStore();
  const jsResources = JS.resources.reduce((html: string, resource: string) => {
    return html + `<script src="${resource}"><\/script>\n`;
  }, '');

  return `
    ${jsResources}
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