# code immediate

This is a code online editing preview tool, similar to `codepen`.

![CI](https://github.com/tzuyi0817/code-immediate/actions/workflows/ci.yml/badge.svg)

## Features

[o] Built-in many frontend templates  
[o] Support multiple preprocessing languages  
[o] Support `vue3 sfc`  
[o] Support for save code  
[o] Built-in support for using ES module syntax on browsers using [unpkg](https://unpkg.com/), [esbuild](https://esbuild.vercel.app) and [importmap](https://github.com/WICG/import-maps)  
[o] Support code formatting  
[o] Support setting [CDNjs](https://cdnjs.com/) for use  
[o] Support github third-party login  
[o] Support export `zip`  
[o] Support embedded mode for easy use in documentation sites, making documentation examples easier  
[o] Support sharing code URL to others to view  
[x] Support multiple layouts to switch  

## Development

Clone this repository and install dependencies by running `pnpm`, then:

- `pnpm dev`: Run in development mode
- `pnpm build`: Build in production mode
- `pnpm preview`: Run preview

## Built-in frontend framework

- React
- Vue
- Vue3 SFC
- Angular
- SolidJs
- RxJS

## Support ES module syntax

Currently supports using `ESM` in `JavaScript`, `TypeScript`, `CoffeeScript`, etc. mode, by default, if you directly import as follows：

```js
import moment from 'moment'
```

It will be converted into `script` and placed in `html head`:

```html
<script src="https://esbuild.vercel.app/moment@latest?format=iife"></script>
```

In the case of `script type="module"` (ex: `vue3 sfc` or `solidJs`), it will be converted into:

```js
import moment from 'https://unpkg.com/moment?module'
```

## Support Languages

Category | Language |
:--- | :--- |
HTML | Haml, Markdown, Pug |
CSS | Less, SCSS, Sass, Stylus, PostCSS |
JS | Babel, TypeScript, CoffeeScript, LiveScript |

## Use Technology

- vue3
- pinia
- typescript
- tailwindcss
- vite
- monaco editor
- loadjs
- jszip
- file-saver
- vitest
- @testing-library
- msw

## License

[MIT](https://opensource.org/licenses/MIT)
