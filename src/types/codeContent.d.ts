export interface CodeContent {
  html: string;
  css: string;
  js: string;
  vue?: string;
  importMap: ImportMap | null;
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
  importMap: ImportMap | null;
}

export type CodeModel = 'HTML' | 'CSS' | 'JS' | 'VUE';
export type CodeTemplate = 'ES6' | 'Vue' | 'VueSFC' | 'React' | 'Angular' | 'SolidJs' | 'RxJS';
export type ImportMap = Record<'imports', Record<string, string>>;

export interface CodeCompile {
  language: string;
  compile: Record<string, Function>
  content: string;
}

export interface CodeMap {
  language: string;
  content: string;
  resources: string[];
}

export interface CodeBase {
  CSS: CodeMap;
  HTML: Omit<CodeMap, 'resources'>;
  JS: CodeMap;
}

export interface CodeProject extends CodeBase {
  title: string;
  VUE: Omit<CodeMap, 'resources'>;
  codeTemplate: CodeTemplate;
  id: string;
  srcdoc?: string;
}

export type CodePayload = Omit<CodeProject, 'id' | 'srcdoc'>;
