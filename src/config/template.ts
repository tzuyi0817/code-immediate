import {
  VUE_HTML,
  VUE_CSS,
  VUE_JS,
  VUE_SFC_CONTENT,
  REACT_JS,
  ANGULAR_HTML,
  ANGULAR_JS,
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
      resources: [],
      import: '',
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
      resources: [
        'lib/vue@3.2.40.global.js',
      ],
      import: '',
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
      import: '',
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
      resources: [
        'lib/react@18.2.0.js',
        'lib/react-dom@18.2.0.js',
        'parses/babel.js',
      ],
      import: '',
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
      resources: []
    },
    JS: {
      language: 'JavaScript',
      content: ANGULAR_JS,
      resources: [
        'lib/angular@1.8.3.js',
      ],
      import: '',
    },
    VUE: {
      language: 'Vue',
      content: '',
    },
  },
};

export function initTemplate() {
  const { codeTemplate, setCodeMap } = useCodeContentStore();
  setCodeMap(TEMPLATE_MAP[codeTemplate as CodeTemplate]);
}
