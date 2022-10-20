export interface CodeContent {
  html: string;
  css: string;
  js: string;
  vue?: string;
}

export type CodeModel = 'HTML' | 'CSS' | 'JS' | 'VUE';
export type CodeTemplate = 'ES6' | 'Vue' | 'VueSFC' | 'React' | 'Angular';
export type ImportMap = string | Record<'imports', Record<string, string>>;

export interface CodeCompile {
  language: string;
  compile: Record<string, Function>
  content: string;
}
