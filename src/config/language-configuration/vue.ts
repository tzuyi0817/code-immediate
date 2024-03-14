import { languages } from 'monaco-editor';

export const vueConfiguration: languages.LanguageConfiguration = {
  comments: {
    blockComment: ['<!--', '-->'],
  },
  brackets: [
    ['<!--', '-->'],
    ['<', '>'],
    ['{', '}'],
    ['(', ')'],
  ],
  autoClosingPairs: [
    {
      open: '{',
      close: '}',
    },
    {
      open: '[',
      close: ']',
    },
    {
      open: '(',
      close: ')',
    },
    {
      open: "'",
      close: "'",
    },
    {
      open: '"',
      close: '"',
    },
    {
      open: '<!--',
      close: '-->',
      notIn: ['comment', 'string'],
    },
    {
      open: '`',
      close: '`',
      notIn: ['string', 'comment'],
    },
    {
      open: '/**',
      close: ' */',
      notIn: ['string'],
    },
  ],
  autoCloseBefore: ';:.,=}])><`\'" \n\t',
  surroundingPairs: [
    {
      open: "'",
      close: "'",
    },
    {
      open: '"',
      close: '"',
    },
    {
      open: '{',
      close: '}',
    },
    {
      open: '[',
      close: ']',
    },
    {
      open: '(',
      close: ')',
    },
    {
      open: '<',
      close: '>',
    },
    {
      open: '`',
      close: '`',
    },
  ],
  colorizedBracketPairs: [],
  folding: {
    markers: {
      start: /^\s*<!--\s*#region\b.*-->/,
      end: /^\s*<!--\s*#endregion\b.*-->/,
    },
  },
  wordPattern: /(-?\d*\.\d\w*)|([^\`\@\~\!\%\^\&\*\(\)\-\=\+\[\{\]\}\\\|\;\:\'\"\,\.\<\>/\?\s]+)/,
  onEnterRules: [
    {
      beforeText:
        /<(?!(?:area|base|br|col|embed|hr|img|input|keygen|link|menuitem|meta|param|source|track|wbr|script|style))([_:\w][_:\w-.\d]*)(?:(?:[^'"/>]|"[^"]*"|'[^']*')*?(?!\/)>)[^<]*$/i,
      afterText: /^<\/([_:\w][_:\w-.\d]*)\s*>/i,
      action: {
        indentAction: languages.IndentAction.IndentOutdent,
      },
    },
    {
      beforeText:
        /<(?!(?:area|base|br|col|embed|hr|img|input|keygen|link|menuitem|meta|param|source|track|wbr|script|style))([_:\w][_:\w-.\d]*)(?:(?:[^'"/>]|"[^"]*"|'[^']*')*?(?!\/)>)[^<]*$/i,
      action: {
        indentAction: languages.IndentAction.Indent,
      },
    },
  ],
  indentationRules: {
    increaseIndentPattern:
      /<(?!\?|(?:area|base|br|col|frame|hr|html|img|input|keygen|link|menuitem|meta|param|source|track|wbr|script|style)\b|[^>]*\/>)([-_\.A-Za-z0-9]+)(?=\s|>)\b[^>]*>(?!\s*\()(?!.*<\/\1>)|<!--(?!.*-->)|\{[^}"']*$/i,
    decreaseIndentPattern: /^\s*(<\/(?!html)[-_\.A-Za-z0-9]+\b[^>]*>|-->|\})/,
  },
};
