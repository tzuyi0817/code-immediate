import { defineStore } from "pinia";
import { deepClone } from '@/utils/common';
import type { CodeModel, CodeTemplate, ImportMap } from '@/types/codeContent';
import type { CdnModel } from '@/types/cdn';

const defaultState = {
  codeContent: {
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
      content: '',
    },
  },
  codeTemplate: 'ES6' as CodeTemplate,
  importMap: '' as ImportMap,
};

type CodeMap = Partial<typeof defaultState.codeContent>;
interface ContentAction<T> {
  type: T;
  code?: string;
  language?: string;
  resources?: string[];
}

export default defineStore('code_immediate_content', {
  state: () => deepClone(defaultState),
  getters: {
    isSFC: (state) => state.codeTemplate === 'VueSFC',
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
    setImportMap(importMap: ImportMap) {
      this.importMap = importMap;
    }, 
  },
  persist: {
    storage: localStorage,
    paths: [
      'codeContent',
      'codeTemplate',
      'importMap',
    ],
  },
});
