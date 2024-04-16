export interface Sass {
  compile: (text: string, _options: { indentedSyntax: boolean }, callback: (result: { text: string }) => void) => void;
}

export interface Showdown {
  makeHtml(text: string): string;
}
