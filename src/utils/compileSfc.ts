import {
  parse,
  compileScript,
  // compileTemplate,
  SFCDescriptor,
  SFCStyleBlock,
  SFCTemplateCompileOptions,
  type CompilerOptions,
} from 'vue/compiler-sfc';
import { SCRIPT_TYPE_MAP } from '@/config/scriptType';
import { HTML_LANGUAGE_MAP, CSS_LANGUAGE_MAP, VUE_LANGUAGE_MAP } from '@/config/language';
import { IMPORT_MAP } from '@/config/importMap';
// import { utoa } from '@/utils/common';
import { transformHtml, transformCss, transformJs } from '@/utils/compile';
import { loadParse } from '@/utils/loadParse';
import type { CodeContent, CompileParams, CssLanguages, HtmlLanguages, ImportMap } from '@/types/codeContent';

// interface RawSourceMap {
//   version: string;
//   sources: string[];
//   names: string[];
//   sourceRoot?: string;
//   sourcesContent?: string[];
//   mappings: string;
//   file?: string;
// }

type BlobURLType = 'render' | 'template';

const blobURLMap = new Map<BlobURLType, string>();
const COMP_IDENTIFIER = `__sfc__`;

export function compileSfc(content: CompileParams): Promise<CodeContent> {
  const { vue } = content;
  const sfcPromise = parseSfc(vue.content);

  return new Promise((resolve, reject) => {
    sfcPromise
      .then(codeContent => {
        resolve(codeContent);
      })
      .catch(reject);
  });
}

function parseSfc(content: string, filename = 'src/App.vue'): Promise<CodeContent> {
  return new Promise((resolve, reject) => {
    try {
      const { descriptor } = parse(content, { filename, sourceMap: true });

      processDescriptor(descriptor).then(resolve).catch(reject);
    } catch (error) {
      reject(error);
    }
  });
}

async function processDescriptor(descriptor: SFCDescriptor): Promise<CodeContent> {
  const { styles, filename, slotted, template, script } = descriptor;
  const scopeId = `data-v-${Date.now().toString().slice(-6)}`;
  const isScoped = styles.some(style => style.scoped);
  const isTS = script?.lang === 'ts';
  const expressionPlugins: CompilerOptions['expressionPlugins'] = isTS ? ['typescript'] : [];
  const compileTemplateOptions: SFCTemplateCompileOptions = {
    source: template ? await compileHtml(template.content, template?.lang) : '',
    filename,
    id: scopeId,
    scoped: isScoped,
    slotted,
    ast: template?.ast,
    compilerOptions: {
      scopeId: isScoped ? scopeId : undefined,
      expressionPlugins,
    },
  };

  return new Promise((resolve, reject) => {
    Promise.all([compileCss(styles), compileJs(descriptor, scopeId, compileTemplateOptions)])
      .then(([css, js]) => {
        resolve({
          html: '<div id="app"></div>',
          css,
          js: js.code,
          importMap: js.importMap,
        });
      })
      .catch(reject);
  });
}

async function compileHtml(content: string, lang?: string) {
  const language = VUE_LANGUAGE_MAP.html[lang as keyof typeof VUE_LANGUAGE_MAP.html];
  const source = HTML_LANGUAGE_MAP[language as HtmlLanguages];
  source && (await loadParse(source));
  return await transformHtml(content, language);
}

async function compileJs(
  descriptor: SFCDescriptor,
  scopeId: string,
  compileTemplateOptions: SFCTemplateCompileOptions,
) {
  const scriptType = SCRIPT_TYPE_MAP.VueSFC;
  const { renderScript, imports } = await transformSfc(descriptor, scopeId, compileTemplateOptions);
  const renderUrl = getBlobURL(renderScript, 'render');
  const defaultImportMap: ImportMap = {
    imports: {
      ...IMPORT_MAP.VueSFC.imports,
      [scopeId]: renderUrl,
    },
  };
  const importMap = Object.values(imports).reduce((map, { source }) => {
    if (source === 'vue') return map;
    map.imports[source] = `https://cdn.jsdelivr.net/npm/${source}/+esm`;

    return map;
  }, defaultImportMap);

  return {
    code: `
      <script ${scriptType}>
        import { createApp } from 'vue';
        import app from '${scopeId}';
        createApp(app).mount('#app'); 
      </script>
    `,
    importMap,
  };
}

function compileCss(styles: SFCStyleBlock[]): Promise<string> {
  const parseCss = async (source: string, code: string, language: CssLanguages) => {
    source && (await loadParse(source));
    return await transformCss(code, language);
  };
  const css = styles.reduce((result: Promise<string>[], style) => {
    const { content, lang } = style;
    const language = VUE_LANGUAGE_MAP.css[lang as keyof typeof VUE_LANGUAGE_MAP.css];
    const source = CSS_LANGUAGE_MAP[language];
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
  compileTemplateOptions: SFCTemplateCompileOptions,
) {
  const { filename } = descriptor;
  const { compilerOptions } = compileTemplateOptions;
  const scriptBlock = compileScript(descriptor, {
    id: scopeId,
    genDefaultAs: COMP_IDENTIFIER,
    inlineTemplate: true,
    templateOptions: {
      compilerOptions: {
        expressionPlugins: compilerOptions?.expressionPlugins,
      },
    },
  });

  // const template = compileTemplate({
  //   ...compileTemplateOptions,
  //   compilerOptions: {
  //     ...compileTemplateOptions.compilerOptions,
  //     bindingMetadata: scriptBlock.bindings,
  //   },
  // });

  const { lang, content } = scriptBlock;
  const language = VUE_LANGUAGE_MAP.js[lang as keyof typeof VUE_LANGUAGE_MAP.js];
  const code = await transformJs(content, language);

  scriptBlock.content = `${code}`;
  revokeBlobURL();

  return {
    renderScript: `
      ${scriptBlock.content}
      ${COMP_IDENTIFIER}.__file = '${filename}';
      ${COMP_IDENTIFIER}.__scopeId = '${scopeId}';
      export default ${COMP_IDENTIFIER};
    `,
    imports: scriptBlock.imports ?? {},
  };
}

function getBlobURL(jsCode: string, type: BlobURLType) {
  const blob = new Blob([jsCode], { type: 'text/javascript' });
  const blobURL = URL.createObjectURL(blob);

  blobURLMap.set(type, blobURL);
  return blobURL;
}

function revokeBlobURL() {
  blobURLMap.forEach(blobURL => URL.revokeObjectURL(blobURL));
}

// function sourceMappingURL(map: RawSourceMap) {
//   const code = JSON.stringify(map);

//   return `//# sourceMappingURL=data:application/json;base64,${utoa(code)}`;
// }
