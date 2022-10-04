import {
  VUE_CSS,
  VUE_JS,
  REACT_JS,
} from "@/config/defaultContent";
import { useCodeContentStore } from '@/store'; 
import type { CodeTemplate } from '@/types/codeContent';

export const TEMPLATE_MAP = {
  ES6: {
    HTML: {
      language: 'HTML',
      content: ''
    },
    CSS: {
      language: 'CSS',
      content: '',
      resources: []
    },
    JS: {
      language: 'JavaScript',
      content: '',
      resources: []
    },
  },
  Vue: {
    HTML: {
      language: 'HTML',
      content: '<div id="app">{{ message }}</div>',
    },
    CSS: {
      language: 'CSS',
      content: VUE_CSS,
      resources: [],
    },
    JS: {
      language: 'JavaScript',
      content: VUE_JS,
      resources: [
        'lib/vue@3.2.40.global.js',
      ],
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
      resources: [
        'lib/react@18.2.0.js',
        'lib/react-dom@18.2.0.js',
        'parses/babel.js',
      ],
    },
  },
  Angular: {},
};

export function initTemplate() {
  const { codeTemplate, setCodeMap } = useCodeContentStore();
  setCodeMap(TEMPLATE_MAP[codeTemplate as CodeTemplate]);
}
