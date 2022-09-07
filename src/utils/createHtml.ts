import type { CodeContent } from '@/types/codeContent';

export function createHtml({ html, css, js }: CodeContent) {
  const head = createHead(css);
  const body = createBody(html, js);
  return assembleHtml(head, body);
}

function createHead(css: string) {
  return `
    <title>code Demo<\/title>
    <style type="text/css">
      ${css}
    <\/style>
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
  `.replace(/\r\n|\n\s+/g, '');
}