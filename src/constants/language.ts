export const HTML_LANGUAGE_MAP = {
  HTML: '',
  Haml: 'haml',
  Markdown: 'markdown',
  // Slim: 'slim',
  Pug: 'pug',
} as const;

export const CSS_LANGUAGE_MAP = {
  CSS: '',
  Less: 'less',
  SCSS: 'scss',
  Sass: 'scss',
  Stylus: 'stylus',
  PostCSS: '',
} as const;

export const JS_LANGUAGE_MAP = {
  JavaScript: '',
  Babel: 'babel',
  TypeScript: '',
  CoffeeScript: 'coffeescript',
  LiveScript: 'livescript',
} as const;

export const VUE_LANGUAGE_MAP = {
  html: {
    haml: 'Haml',
    markdown: 'Markdown',
    pug: 'Pug',
  },
  css: {
    less: 'Less',
    scss: 'SCSS',
    sass: 'Sass',
    stylus: 'Stylus',
    postcss: 'PostCSS',
  },
  js: {
    ts: 'TypeScript',
  },
} as const;
