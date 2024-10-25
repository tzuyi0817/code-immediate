import srcdoc from '@/assets/srcdoc.html?raw';
import { VERSION } from '@/config/template';
import type { CreateHtmlParams } from '@/types/code-content';

export function createHtml({ html, css, js, cssResources, jsResources, importMap, modules = '' }: CreateHtmlParams) {
  return srcdoc
    .replace(/<!-- LINK-HTML -->/, createLinkHtml(cssResources))
    .replace(/<!-- IMPORT-MAP -->/, createImportMapHtml(importMap))
    .replace(/<!-- MODULES -->/, modules)
    .replace(/<!-- SCRIPT-HTML -->/, createScriptHtml(jsResources))
    .replace(/<!-- STYLE-HTML -->/, `<style type="text/css">${css}</style>`)
    .replace(/<!-- PREVIEW-BODY-HTML -->/, html)
    .replace(/<!-- PREVIEW-BODY-SCRIPT -->/, js);
}

function createLinkHtml(cssResources: CreateHtmlParams['cssResources']) {
  return cssResources.reduce((html: string, resource: string) => {
    return `${html}<link href="${resource}" rel="stylesheet">\n\t`;
  }, '');
}

function createImportMapHtml(importMap: CreateHtmlParams['importMap']) {
  if (!importMap) return '';
  return `
    <script async src="lib/es-module-shims@${VERSION.ES_MODULE_SHIMS}.js"></script>
    <script type="importmap">${JSON.stringify(importMap, null, '\t')}</script>
  `;
}

function createScriptHtml(jsResources: CreateHtmlParams['jsResources']) {
  return jsResources.reduce((html: string, resource: string) => {
    return `${html}<script src="${resource}"></script>\n\t`;
  }, '');
}
