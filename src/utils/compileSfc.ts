import {
  parse,
  compileScript,
  compileTemplate,
  SFCDescriptor,
  SFCStyleBlock,
  SFCTemplateCompileOptions,
} from 'vue/compiler-sfc';
import { SCRIPT_TYPE_MAP } from '@/config/scriptType';
import { TEMPLATE_MAP } from '@/config/template';
import { HTML_LANGUAGE_MAP, CSS_LANGUAGE_MAP, VUE_LANGUAGE_MAP } from '@/config/language';
import { transformHtml, transformCss, transformJs } from '@/utils/compile';
import { loadParse } from '@/utils/loadParse';
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
    source: await compileHtml(template.content, template?.lang),
    filename,
    id: scopeId,
    scoped: isScoped,
    slotted,
    compilerOptions: {
      scopeId: isScoped ? scopeId : undefined,
      mode: 'module',
    },
  } : undefined;

  return new Promise((resolve, reject) => {
    Promise.all([
      compileCss(styles),
      // @ts-ignore
      compileJs(descriptor, scopeId, compileTemplateOptions),
    ]).then(([css, js]) => {
      resolve({
        html: '<div id="app"></div>',
        css,
        js,
      })
    }).catch(reject);
  });
}

async function compileHtml(content: string, lang: string | undefined) {
  const language = VUE_LANGUAGE_MAP[lang as keyof typeof VUE_LANGUAGE_MAP];
  const source = HTML_LANGUAGE_MAP[language as keyof typeof HTML_LANGUAGE_MAP];
  source && await loadParse(source);
  return await transformHtml(content, language);
}

async function compileJs(
  descriptor: SFCDescriptor,
  scopeId: string,
  compileTemplateOptions: SFCTemplateCompileOptions | undefined,
) {
  const scriptType = SCRIPT_TYPE_MAP.VueSFC;
  const renderScript = await transformSfc(descriptor, scopeId, compileTemplateOptions);
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

function compileCss(styles: SFCStyleBlock[]): Promise<string> {
  const parseCss = async (source: string, code: string, language: string) => {
    source && await loadParse(source);
    return await transformCss(code, language);
  };
  const css = styles.reduce((result: Promise<string>[], style) => {
    const { content, lang } = style;
    const language = VUE_LANGUAGE_MAP[lang as keyof typeof VUE_LANGUAGE_MAP];
    const source = CSS_LANGUAGE_MAP[language as keyof typeof CSS_LANGUAGE_MAP];
    result.push(parseCss(source, content, language));
    return result;
  }, []);

  return new Promise((resolve, reject) => {
    Promise.all(css)
      .then((...args) => resolve(args.join('\r\n')))
      .catch(reject);
  });
}

async function transformSfc(
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

  if (template?.map) {
    template.code = `${template.code}\n${(sourceMappingURL(template.map))}`;
  }

  if (scriptBlock.map) {
    const { lang, map, content } = scriptBlock;
    const language = VUE_LANGUAGE_MAP[lang as keyof typeof VUE_LANGUAGE_MAP];
    const code = await transformJs(content, language);
    scriptBlock.content = `${code}\n${sourceMappingURL(map)}`;
  }

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
  const blob = new Blob([jsCode], { type: 'text/javascript' });
  const blobURL = URL.createObjectURL(blob);
  return blobURL;
}

function sourceMappingURL(map: RawSourceMap) {
  return `//# sourceMappingURL=data:application/json;base64,${self.btoa(JSON.stringify(map))}`;
}