import {
  VUE_HTML,
  VUE_CSS,
  VUE_JS,
  VUE_SFC_CONTENT,
  REACT_JS,
  ANGULAR_HTML,
  ANGULAR_JS,
  SOLID_JS,
  SOLID_CSS,
  RXJS_HTML,
  RXJS_JS,
  RXJS_CSS,
} from '@/config/default-content';
import { useCodeContentStore } from '@/store';
import { deepClone } from '@/utils/common';
import type { CodeTemplate, CodeTemplateMap } from '@/types/code-content';

export const VERSION = {
  REACT: '18.3.1',
  VUE: '3.5.13',
  ANGULAR: '1.8.3',
  SOLID_JS: '1.8.17',
  RXJS: '7.8.1',
  ES_MODULE_SHIMS: '1.10.0',
} as const;

export const TEMPLATE_MAP: Record<CodeTemplate, CodeTemplateMap> = {
  ES6: {
    HTML: {
      language: 'HTML',
      content: '',
    },
    CSS: {
      language: 'CSS',
      content: '',
      resources: [],
    },
    JS: {
      language: 'JavaScript',
      content: '',
      resources: [],
    },
    VUE: {
      language: 'Vue',
      content: '',
    },
  },
  Vue: {
    HTML: {
      language: 'HTML',
      content: VUE_HTML,
    },
    CSS: {
      language: 'CSS',
      content: VUE_CSS,
      resources: [],
    },
    JS: {
      language: 'JavaScript',
      content: VUE_JS,
      resources: [],
    },
    VUE: {
      language: 'Vue',
      content: '',
    },
  },
  VueSFC: {
    HTML: {
      language: 'HTML',
      content: '',
    },
    CSS: {
      language: 'CSS',
      content: '',
      resources: [],
    },
    JS: {
      language: 'JavaScript',
      content: '',
      resources: [],
    },
    VUE: {
      language: 'Vue',
      content: VUE_SFC_CONTENT,
    },
  },
  React: {
    HTML: {
      language: 'HTML',
      content: '<div id="root"></div>',
    },
    CSS: {
      language: 'CSS',
      content: '',
      resources: [],
    },
    JS: {
      language: 'JavaScript',
      content: REACT_JS,
      resources: [],
    },
    VUE: {
      language: 'Vue',
      content: '',
    },
  },
  Angular: {
    HTML: {
      language: 'HTML',
      content: ANGULAR_HTML,
    },
    CSS: {
      language: 'CSS',
      content: '',
      resources: [],
    },
    JS: {
      language: 'JavaScript',
      content: ANGULAR_JS,
      resources: [`lib/angular@${VERSION.ANGULAR}.js`],
    },
    VUE: {
      language: 'Vue',
      content: '',
    },
  },
  SolidJs: {
    HTML: {
      language: 'HTML',
      content: '<div id="root"></div>',
    },
    CSS: {
      language: 'CSS',
      content: SOLID_CSS,
      resources: [],
    },
    JS: {
      language: 'JavaScript',
      content: SOLID_JS,
      resources: [],
    },
    VUE: {
      language: 'Vue',
      content: '',
    },
  },
  RxJS: {
    HTML: {
      language: 'HTML',
      content: RXJS_HTML,
    },
    CSS: {
      language: 'CSS',
      content: RXJS_CSS,
      resources: [],
    },
    JS: {
      language: 'JavaScript',
      content: RXJS_JS,
      resources: [],
    },
    VUE: {
      language: 'Vue',
      content: '',
    },
  },
};

export const DEFAULT_TEMPLATE_MAP = deepClone(TEMPLATE_MAP);
export const BUILT_IN_RESOURCES = new Set([`lib/angular@${VERSION.ANGULAR}.js`]);

export const TEMPLATE_LIST = [
  { name: 'ES6', src: '/templateIcon/es6.png', version: '' },
  { name: 'React', src: '/templateIcon/react.svg', version: `v${VERSION.REACT}` },
  { name: 'Vue', src: '/templateIcon/vue.svg', version: `v${VERSION.VUE}` },
  { name: 'VueSFC', src: '/templateIcon/vue.svg', version: `v${VERSION.VUE}` },
  { name: 'Angular', src: '/templateIcon/angular.png', version: `v${VERSION.ANGULAR}` },
  { name: 'SolidJs', src: '/templateIcon/solid.png', version: `v${VERSION.SOLID_JS}` },
  { name: 'RxJS', src: '/templateIcon/rxjs.png', version: `v${VERSION.RXJS}` },
] as const;

export function setupTemplate() {
  const { codeContent, codeTemplate } = useCodeContentStore();
  const defaultTemplateMap = deepClone(DEFAULT_TEMPLATE_MAP);

  Object.assign(TEMPLATE_MAP, defaultTemplateMap);
  TEMPLATE_MAP[codeTemplate] = codeContent;
}
