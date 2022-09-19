import { defineStore } from "pinia";
import { deepClone } from '@/utils/common';
import type { CodeModel } from '@/types/codeContent';

const defaultState = {
  codeContent: {
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
    VUE: {
      language: 'vue2',
      content: '',
      resources: []
    },
  },
};

interface ContentAction {
  type: CodeModel;
  code?: string;
  language?: string;
}

export default defineStore('codeContent', {
  state: () => deepClone(defaultState),
  actions: {
    setCodeContent({ type, code }: ContentAction) {
      this.codeContent[type].content = code ?? '';
    },
    setCodeLanguage({ type, language }: ContentAction) {
      this.codeContent[type].language = language ?? defaultState.codeContent[type].language;
    },
  },
});
