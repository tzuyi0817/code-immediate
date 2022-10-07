import {
  parse,
  compileScript,
  compileStyle,
  compileTemplate,
  SFCDescriptor,
  SFCStyleBlock,
  SFCStyleCompileOptions,
  SFCTemplateCompileOptions,
} from 'vue/compiler-sfc';
import { SCRIPT_TYPE_MAP } from '@/config/scriptType';
import { TEMPLATE_MAP } from '@/config/template';
import type { CodeContent } from '@/types/codeContent';

interface RawSourceMap {
  version: string;
  sources: string[];
  names: string[];
  sourceRoot?: string;
  sourcesContent?: string[];
  mappings: string;
  file?: string;
}

export function compileSfc(content: CodeContent): Promise<CodeContent> {
  const { vue } = content;
  const sfcPromise = parseSfc(vue!);

  return new Promise((resolve, reject) => {
    sfcPromise.then(codeContent => {
      resolve(codeContent);
    })
    .catch(reject);
  })
}

function parseSfc(content: string): Promise<CodeContent> {
  return new Promise(async (resolve, reject) => {
    try {
      const { descriptor } = parse(content);
      const codeContent = await processDescriptor(descriptor);

      resolve(codeContent);
    } catch (error) {
      reject(error);
    }
  });
}

async function processDescriptor(descriptor: SFCDescriptor): Promise<CodeContent> {
  const { styles, filename, slotted, template } = descriptor;
  const scopeId = `data-v-${Date.now().toString().slice(-6)}`;
  const isScoped = styles.some(style => style.scoped);
  const compileTemplateOptions = template ? {
    source: template.content,
    filename,
    id: scopeId,
    scoped: isScoped,
    slotted,
    preprocessLang: template?.lang,
    compilerOptions: {
      scopeId: isScoped ? scopeId : undefined,
      mode: 'module',
    },
  } : undefined;

  const cssCode = compileCss(styles, scopeId);
  // @ts-ignore
  const jsCode = compileJs(descriptor, scopeId, compileTemplateOptions);

  return {
    html: '<div id="app"></div>',
    css: cssCode,
    js: jsCode,
  }
}

function compileJs(
  descriptor: SFCDescriptor,
  scopeId: string,
  compileTemplateOptions: SFCTemplateCompileOptions | undefined,
) {
  const scriptType = SCRIPT_TYPE_MAP.VueSFC;
  const renderScript = transformSfc(descriptor, scopeId, compileTemplateOptions);
  const renderUrl = getBlobURL(renderScript);
  const importMap = {
    imports: {
      "vue": "./lib/vue@3.2.40.esm-browser.js",
      [scopeId]: renderUrl
    }
  };

  TEMPLATE_MAP.VueSFC.JS.import = `<script type="importmap">${JSON.stringify(importMap, null, '\t')}<\/script>`;
  return `
  <script ${scriptType}>
    import { createApp } from 'vue';
    import app from '${scopeId}';
    createApp(app).mount('#app'); 
  </script>
  `;
}

function compileCss(styles: SFCStyleBlock[], scopeId: string) {
  return styles.reduce((result, style) => {
    const { content, scoped, map, lang } = style;
    const { code } = compileStyle({
      id: scopeId,
      source: content,
      scoped,
      filename: map!.file!,
      preprocessLang: lang as SFCStyleCompileOptions['preprocessLang'],
    });
    return result += `${code}\r\n`;
  }, '');
}

function transformSfc(
  descriptor: SFCDescriptor,
  scopeId: string,
  compileTemplateOptions: SFCTemplateCompileOptions | undefined,
) {
  const { filename } = descriptor;
  const template = compileTemplateOptions ? compileTemplate(compileTemplateOptions) : null;
  const scriptBlock = compileScript(descriptor, {
    id: scopeId,
    templateOptions: compileTemplateOptions,
    sourceMap: true,
  });

  if (template?.map)
    template.code = `${template.code}\n${(sourceMappingURL(template.map))}`;
  if (scriptBlock.map)
    scriptBlock.content = `${scriptBlock.content}\n${sourceMappingURL(scriptBlock.map)}`;
    console.log({ scriptBlock, template })
  return `
    import script from '${getBlobURL(scriptBlock.content)}';
    import { render } from '${getBlobURL(template?.code ?? '')}';
    script.render = render;
    ${filename ? `script.__file = '${filename}'` : ''};
    ${scopeId ? `script.__scopeId = '${scopeId}'` : ''};
    export default script;
  `;
}

function getBlobURL(jsCode: string) {
  const blob = new Blob([jsCode], {type: 'text/javascript'});
  const blobURL = URL.createObjectURL(blob);
  return blobURL;
}

function sourceMappingURL(map: RawSourceMap) {
  return `//# sourceMappingURL=data:application/json;base64,${btoa(JSON.stringify(map))}`;
}
