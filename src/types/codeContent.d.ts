export interface CodeContent {
  html: string;
  css: string;
  js: string;
}

export type CodeModel = 'HTML' | 'CSS' | 'JS';
export type CodeTemplate = 'ES6' | 'Vue' | 'React' | 'Angular';

export interface CodeCompile {
  language: string;
  compile: Record<string, Function>
  content: string;
}
