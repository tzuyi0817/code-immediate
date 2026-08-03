import hashId from 'hash-sum';
import {
  compileScript,
  compileTemplate,
  parse,
  type BindingMetadata,
  type CompilerOptions,
  type SFCDescriptor,
  type SFCStyleBlock,
} from 'vue/compiler-sfc';
import { IMPORT_MAP } from '@/constants/import-map';
import { CSS_LANGUAGE_MAP, HTML_LANGUAGE_MAP, VUE_LANGUAGE_MAP } from '@/constants/language';
import { SCRIPT_TYPE_MAP } from '@/constants/script-type';
import { transformToJsdelivr } from '@/utils/cdn';
// import { utoa } from '@/utils/common';
import { transformCss, transformHtml, transformJs } from '@/utils/compile';
import { loadParse } from '@/utils/load-parse';
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

export async function compileSfc({ vue }: CompileParams): Promise<CodeContent> {
  const { descriptor } = parse(vue.content, { filename: 'src/App.vue', sourceMap: true });
  const { styles, filename } = descriptor;
  const scopeId = hashId(filename);
  const [css, { modules, importMap }] = await Promise.all([compileCss(styles), compileJs(descriptor, scopeId)]);

  return { html: '<div id="app"></div>', css, js: '', modules, importMap };
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

async function compileCss(styles: SFCStyleBlock[]): Promise<string> {
  const parseCss = async (source: string, code: string, language: CssLanguages) => {
    if (source) {
      await loadParse(source);
    }
    return transformCss(code, language);
  };
  const cssList = await Promise.all(
    styles.map(({ content, lang }) => {
      const language = VUE_LANGUAGE_MAP.css[lang as keyof typeof VUE_LANGUAGE_MAP.css];

      return parseCss(CSS_LANGUAGE_MAP[language], content, language);
    }),
  );

  return cssList.join('\r\n');
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
