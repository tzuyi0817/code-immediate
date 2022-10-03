import { defineStore } from "pinia";
import { deepClone } from '@/utils/common';
import type { CodeModel, CodeTemplate } from '@/types/codeContent';

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
  },
  codeTemplate: 'ES6',
};

type CodeMap = Partial<typeof defaultState.codeContent>;
interface ContentAction {
  type: CodeModel;
  code?: string;
  language?: string;
}

export default defineStore('codeContent', {
  state: () => deepClone(defaultState),
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
    setCodeTemplate(template: CodeTemplate) {
      this.codeTemplate = template;
    }
  },
});
