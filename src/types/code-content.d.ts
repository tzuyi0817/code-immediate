export interface CodeContent {
  html: string;
  css: string;
  js: string;
  vue?: string;
  importMap: ImportMap | null;
  modules?: string;
}

export interface CompileParams {
  html: {
    language: HtmlLanguages;
    content: string;
  };
  css: {
    language: CssLanguages;
    content: string;
    resources: string[];
  };
  js: {
    language: JsLanguages;
    content: string;
    resources: string[];
  };
  vue: {
    language: 'Vue';
    content: string;
  };
  codeTemplate: CodeTemplate;
}

export interface CreateHtmlParams extends CodeContent {
  cssResources: string[];
  jsResources: string[];
}

export type CodeModel = 'HTML' | 'CSS' | 'JS' | 'VUE';
export type CodeTemplate = 'ES6' | 'Vue' | 'VueSFC' | 'React' | 'Angular' | 'SolidJs' | 'RxJS';
export type ImportMap = Record<'imports', Record<string, string>>;
export type HtmlLanguages = 'HTML' | 'Haml' | 'Markdown' | 'Pug';
export type CssLanguages = 'CSS' | 'Less' | 'SCSS' | 'Sass' | 'Stylus' | 'PostCSS';
export type JsLanguages = 'JavaScript' | 'Babel' | 'TypeScript' | 'CoffeeScript' | 'LiveScript';
export type Languages = HtmlLanguages | CssLanguages | JsLanguages | 'Vue';

export interface CodeCompile {
  language: Languages;
  compile: Record<string, Function>;
  content: string;
}

export interface CodeMap {
  language: Languages;
  content: string;
  resources: string[];
}

export interface CodeBase {
  CSS: CodeMap;
  HTML: Omit<CodeMap, 'resources'>;
  JS: CodeMap;
}

export interface CodeTemplateMap {
  HTML: {
    language: HtmlLanguages;
    content: string;
  };
  CSS: {
    language: CssLanguages;
    content: string;
    resources: string[];
  };
  JS: {
    language: JsLanguages;
    content: string;
    resources: string[];
  };
  VUE: {
    language: 'Vue';
    content: string;
  };
}

export interface CodeProject extends CodeTemplateMap {
  title: string;
  codeTemplate: CodeTemplate;
  id: string;
  srcdoc?: string;
}

export type CodePayload = Omit<CodeProject, 'id' | 'srcdoc'>;
