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
} from "@/config/defaultContent";
import { useCodeContentStore } from '@/store';
import { deepClone } from '@/utils/common';

export const TEMPLATE_MAP = {
  ES6: {
    HTML: {
      language: 'HTML',
      content: ''
    },
    CSS: {
      language: 'CSS',
      content: '',
      resources: [] as string[],
    },
    JS: {
      language: 'JavaScript',
      content: '',
      resources: [] as string[],
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
      resources: [] as string[],
    },
    JS: {
      language: 'JavaScript',
      content: VUE_JS,
      resources: [
        'lib/vue@3.3.4.global.js',
      ],
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
      resources: [] as string[],
    },
    JS: {
      language: 'JavaScript',
      content: '',
      resources: [] as string[],
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
      resources: [] as string[],
    },
    JS: {
      language: 'JavaScript',
      content: REACT_JS,
      resources: [
        'lib/react@18.2.0.js',
        'lib/react-dom@18.2.0.js',
        'parses/babel.js',
      ],
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
      resources: [] as string[],
    },
    JS: {
      language: 'JavaScript',
      content: ANGULAR_JS,
      resources: [
        'lib/angular@1.8.3.js',
      ],
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
      resources: [] as string[],
    },
    JS: {
      language: 'JavaScript',
      content: SOLID_JS,
      resources: [] as string[],
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
      resources: [] as string[],
    },
    JS: {
      language: 'JavaScript',
      content: RXJS_JS,
      resources: [] as string[],
    },
    VUE: {
      language: 'Vue',
      content: '',
    },
  }
};

export const DEFAULT_TEMPLATE_MAP = deepClone(TEMPLATE_MAP);
export const BUILT_IN_RESOURCES = new Set([
  'lib/vue@3.3.4.global.js',
  'lib/react@18.2.0.js',
  'lib/react-dom@18.2.0.js',
  'parses/babel.js',
  'lib/angular@1.8.3.js',
]);

export const TEMPLATE_LIST = [
  { name: 'ES6', src: '/templateIcon/es6.png', version: '' },
  { name: 'React', src: '/templateIcon/react.svg', version: 'v18.2.0' },
  { name: 'Vue', src: '/templateIcon/vue.svg', version: 'v3.3.4' },
  { name: 'VueSFC', src: '/templateIcon/vue.svg', version: 'v3.3.4' },
  { name: 'Angular', src: '/templateIcon/angular.png', version: 'v1.8.3' },
  { name: 'SolidJs', src: '/templateIcon/solid.png', version: 'v1.7.7' },
  { name: 'RxJS', src: '/templateIcon/rxjs.png', version: 'v7.8.1' },
] as const;

export function initTemplate() {
  const { codeContent, codeTemplate } = useCodeContentStore();
  TEMPLATE_MAP[codeTemplate] = codeContent;
}
