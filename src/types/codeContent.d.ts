export interface CodeContent {
  html: string;
  css: string;
  js: string;
  vue?: string;
  importMap: ImportMap;
}

export interface CompileParams {
  html: {
    language: string;
    content: string;
  },
  css: {
    language: string;
    content: string;
    resources: string[];
  },
  js: {
    language: string;
    content: string;
    resources: string[];
  },
  vue: {
    language: string;
    content: string;
  },
  codeTemplate: CodeTemplate
}

export interface CreateHtmlParams extends CodeContent {
  cssResources: string[];
  jsResources: string[];
  importMap: ImportMap;
}

export type CodeModel = 'HTML' | 'CSS' | 'JS' | 'VUE';
export type CodeTemplate = 'ES6' | 'Vue' | 'VueSFC' | 'React' | 'Angular';
export type ImportMap = string | Record<'imports', Record<string, string>>;

export interface CodeCompile {
  language: string;
  compile: Record<string, Function>
  content: string;
}

interface CodeMap {
  language: string;
  content: string;
  resources: string[];
}

export interface CodeProject {
  title: string;
  CSS: CodeMap;
  HTML: CodeMap;
  JS: CodeMap;
  VUE: CodeMap;
  codeTemplate: CodeTemplate;
  id: string;
  srcdoc?: string;
}
