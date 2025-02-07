import {
  parse,
  compileScript,
  compileTemplate,
  SFCDescriptor,
  SFCStyleBlock,
  type CompilerOptions,
  type BindingMetadata,
} from 'vue/compiler-sfc';
import hashId from 'hash-sum';
import { SCRIPT_TYPE_MAP } from '@/config/script-type';
import { HTML_LANGUAGE_MAP, CSS_LANGUAGE_MAP, VUE_LANGUAGE_MAP } from '@/config/language';
import { IMPORT_MAP } from '@/config/import-map';
// import { utoa } from '@/utils/common';
import { transformHtml, transformCss, transformJs } from '@/utils/compile';
import { loadParse } from '@/utils/load-parse';
import { transformToJsdelivr } from '@/utils/cdn';
import type { CodeContent, CompileParams, CssLanguages, HtmlLanguages, ImportMap } from '@/types/code-content';

// interface RawSourceMap {
//   version: string;
//   sources: string[];
//   names: string[];
//   sourceRoot?: string;
//   sourcesContent?: string[];
//   mappings: string;
//   file?: string;
// }

const COMP_IDENTIFIER = '__sfc__';

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

function processDescriptor(descriptor: SFCDescriptor): Promise<CodeContent> {
  const { styles, filename } = descriptor;
  const scopeId = hashId(filename);

  return new Promise((resolve, reject) => {
    const html = '<div id="app"></div>';

    Promise.all([compileCss(styles), compileJs(descriptor, scopeId)])
      .then(([css, { modules, importMap }]) => {
        resolve({ html, css, js: '', modules, importMap });
      })
      .catch(reject);
  });
}

async function compileHtml(content: string, lang?: string) {
  const language = VUE_LANGUAGE_MAP.html[lang as keyof typeof VUE_LANGUAGE_MAP.html];
  const source = HTML_LANGUAGE_MAP[language as HtmlLanguages];

  if (source) {
    await loadParse(source);
  }
  return await transformHtml(content, language);
}

async function compileJs(descriptor: SFCDescriptor, scopeId: string) {
  const scriptType = SCRIPT_TYPE_MAP.VueSFC;
  const { renderModules, imports } = await transformSfc(descriptor, scopeId);
  const importMap: ImportMap = {
    imports: {
      ...IMPORT_MAP.VueSFC.imports,
    },
  };

  for (const { source } of Object.values(imports)) {
    if (source === 'vue') continue;

    importMap.imports[source] = transformToJsdelivr(source);
  }

  return {
    modules: `
      ${renderModules}
      <script ${scriptType}>
        import { createApp } from 'vue';

        const AppComponent = __modules__['${descriptor.filename}'].default;
        const app = createApp(AppComponent);

        if (!app.config.hasOwnProperty('unwrapInjectedRef')) {
          app.config.unwrapInjectedRef = true;
        }
        app.errorHandler = error => console.error(error);
        app.mount('#app'); 
      </script>
    `,
    importMap,
  };
}

function compileCss(styles: SFCStyleBlock[]): Promise<string> {
  const parseCss = async (source: string, code: string, language: CssLanguages) => {
    if (source) {
      await loadParse(source);
    }
    return transformCss(code, language);
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
      .then((...args) => {
        resolve(args.join('\r\n'));
      })
      .catch(reject);
  });
}

async function transformSfc(descriptor: SFCDescriptor, scopeId: string) {
  const { filename, script } = descriptor;
  const isTS = script?.lang === 'ts';
  const expressionPlugins: CompilerOptions['expressionPlugins'] = isTS ? ['typescript'] : [];
  const compilerOptions = {
    expressionPlugins,
  };

  const scriptBlock = await doCompileScript(descriptor, scopeId, compilerOptions);
  const templateResults = await doCompileTemplate(descriptor, scopeId, compilerOptions, scriptBlock.bindings);

  return {
    renderModules: `
      <script type="module">
        const __module__ = __modules__.render = { [Symbol.toStringTag]: 'Module' };

        ${templateResults.code}

        __module__.default = render;
      </script>
      <script type="module">
        const __module__ = __modules__['${filename}'] = { [Symbol.toStringTag]: 'Module' };

        ${scriptBlock.content}
        ${COMP_IDENTIFIER}.render = __modules__.render.default;
        ${COMP_IDENTIFIER}.__file = '${filename}';
        ${COMP_IDENTIFIER}.__scopeId = 'data-v-${scopeId}';

        __module__.default = ${COMP_IDENTIFIER};
      </script>
    `,
    imports: scriptBlock.imports ?? {},
  };
}

async function doCompileScript(descriptor: SFCDescriptor, scopeId: string, compilerOptions: CompilerOptions) {
  const scriptBlock = compileScript(descriptor, {
    id: scopeId,
    genDefaultAs: COMP_IDENTIFIER,
    // fs: {
    //   fileExists(file: string) {
    //     if (file.startsWith('/')) file = file.slice(1);
    //     return false;
    //   },
    //   readFile(file: string) {
    //     if (file.startsWith('/')) file = file.slice(1);
    //     return '';
    //   },
    // },
    templateOptions: {
      ssr: false,
      ssrCssVars: descriptor.cssVars,
      compilerOptions: {
        expressionPlugins: compilerOptions.expressionPlugins,
      },
    },
  });

  const { lang, content } = scriptBlock;
  const language = VUE_LANGUAGE_MAP.js[lang as keyof typeof VUE_LANGUAGE_MAP.js];

  scriptBlock.content = await transformJs(content, language);

  return scriptBlock;
}

async function doCompileTemplate(
  descriptor: SFCDescriptor,
  scopeId: string,
  compilerOptions: CompilerOptions,
  bindingMetadata?: BindingMetadata,
) {
  const { filename, template, slotted, styles } = descriptor;
  const templateResults = compileTemplate({
    source: template ? await compileHtml(template.content, template?.lang) : '',
    filename,
    id: scopeId,
    scoped: styles.some(style => style.scoped),
    slotted,
    isProd: false,
    ssr: false,
    ssrCssVars: descriptor.cssVars,
    compilerOptions: {
      ...compilerOptions,
      bindingMetadata,
    },
  });

  templateResults.code = templateResults.code.replace(/export (function) render/, '$1 render');

  return templateResults;
}

// function sourceMappingURL(map: RawSourceMap) {
//   const code = JSON.stringify(map);

//   return `//# sourceMappingURL=data:application/json;base64,${utoa(code)}`;
// }
