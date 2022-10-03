import {
  VUE_CSS,
  VUE_JS,
} from "@/config/defaultContent";

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
  React: {},
  Angular: {},
};