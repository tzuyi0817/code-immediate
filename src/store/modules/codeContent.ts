import { defineStore } from 'pinia';
import { deepClone } from '@/utils/common';
import type { CodeModel, CodeTemplate, CodeTemplateMap, Languages } from '@/types/codeContent';
import type { CdnModel } from '@/types/cdn';

interface CodeContentStore {
  codeContent: CodeTemplateMap;
  codeTemplate: CodeTemplate;
  codeId: string;
  codeTitle: string;
}

const defaultState: CodeContentStore = {
  codeContent: {
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
  codeTemplate: 'ES6',
  codeId: '',
  codeTitle: '',
};

type CodeMap = Partial<typeof defaultState.codeContent>;

interface ContentAction<T> {
  type: T;
  code?: string;
  language?: Languages;
  resources?: string[];
}

export default defineStore('code_immediate_content', {
  state: () => deepClone(defaultState),
  getters: {
    isSFC: state => state.codeTemplate === 'VueSFC',
  },
  actions: {
    setCodeMap(map: CodeMap) {
      this.codeContent = { ...this.codeContent, ...map };
    },
    setCodeContent({ type, code }: ContentAction<CodeModel>) {
      this.codeContent[type].content = code ?? '';
    },
    setCodeLanguage({ type, language }: ContentAction<CodeModel>) {
      this.codeContent[type].language = language ?? defaultState.codeContent[type].language;
    },
    setCodeResource({ type, resources }: ContentAction<CdnModel>) {
      this.codeContent[type].resources = resources ?? [];
    },
    setCodeTemplate(template: CodeTemplate) {
      this.codeTemplate = template;
    },
    setCodeId(id: string) {
      this.codeId = id;
    },
    setCodeTitle(title: string) {
      this.codeTitle = title;
    },
  },
  persist: {
    storage: localStorage,
    paths: ['codeContent', 'codeTemplate', 'codeTitle', 'codeId'],
  },
});
