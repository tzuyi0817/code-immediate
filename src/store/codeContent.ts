import { defineStore } from "pinia";
import { deepClone } from '@/utils/common';
import type { CodeModel, CodeTemplate } from '@/types/codeContent';
import type { CdnItem } from '@/types/cdn';

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
      resources: [],
      import: '',
    },
    VUE: {
      language: 'Vue',
      content: '',
    },
  },
  codeTemplate: 'ES6',
};

type CodeMap = Partial<typeof defaultState.codeContent>;
interface ContentAction {
  type: CodeModel;
  code?: string;
  language?: string;
  resources?: CdnItem[];
}

export default defineStore('codeContent', {
  state: () => deepClone(defaultState),
  getters: {
    isSFC: (state) => state.codeTemplate === 'VueSFC',
  },
  actions: {
    setCodeMap(map: CodeMap) {
      this.codeContent = { ...this.codeContent, ...map };
    },
    setCodeContent({ type, code }: ContentAction) {
      this.codeContent[type].content = code ?? '';
    },
    setCodeLanguage({ type, language }: ContentAction) {
      this.codeContent[type].language = language ?? defaultState.codeContent[type].language;
    },
    setCodeResource({ type, resources }: ContentAction) {
      this.codeContent[type].resources = resources ?? [];
    },
    setCodeTemplate(template: CodeTemplate) {
      this.codeTemplate = template;
    }
  },
  persist: {
    storage: localStorage,
    paths: [
      'codeContent',
      'codeTemplate',
    ],
  },
});
