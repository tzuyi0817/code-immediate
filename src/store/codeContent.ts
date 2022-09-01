import { defineStore } from "pinia";

const defaultState = {
  codeContent: {
    HTML: {
      language: 'html',
      content: ''
    },
    CSS: {
      language: 'css',
      content: '',
      resources: []
    },
    JS: {
      language: 'javascript',
      content: '',
      resources: []
    },
    VUE: {
      language: 'vue2',
      content: '',
      resources: []
    },
  }
};

interface CodeContent {
  type: keyof typeof defaultState.codeContent;
  code: string;
}

export default defineStore('codeContent', {
  state: () => ({ ...defaultState }),
  actions: {
    setCodeContent({ type, code }: CodeContent) {
      this.codeContent[type].content = code;
    }
  },
});
