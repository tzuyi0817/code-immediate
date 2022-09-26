export interface CodeContent {
  html: string;
  css: string;
  js: string;
}

export type CodeModel = 'HTML' | 'CSS' | 'JS' | 'VUE';

export interface CodeCompile {
  language: string;
  compile: Record<string, Function>
  content: string;
}
