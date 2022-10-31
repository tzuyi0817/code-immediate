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
import getCode from '@/utils/getCode';
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
        'lib/vue@3.2.40.global.js',
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
};

export const DEFAULT_TEMPLATE_MAP = deepClone(TEMPLATE_MAP);
export const BUILT_IN_RESOURCES = new Set([
  'lib/vue@3.2.40.global.js',
  'lib/react@18.2.0.js',
  'lib/react-dom@18.2.0.js',
  'parses/babel.js',
  'lib/angular@1.8.3.js',
]);

export async function initTemplate() {
  const { codeId } = useCodeContentStore();
  codeId && await getCode(codeId);
  const { codeContent, codeTemplate } = useCodeContentStore();
  TEMPLATE_MAP[codeTemplate] = codeContent;
}
