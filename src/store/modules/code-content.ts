import { defineStore } from 'pinia';
import { DEFAULT_TEMPLATE_MAP, TEMPLATE_MAP } from '@/constants/template';
import { getCode } from '@/services/http';
import { deepClone } from '@/utils/common';
import { loadParseSources } from '@/utils/load-parse';
import type { CdnModel } from '@/types/cdn';
import type { CodeModel, CodeTemplate, CodeTemplateMap, Languages } from '@/types/code-content';
import { useFlagStore } from './flag';

interface CodeContentStore {
  codeContent: CodeTemplateMap;
  codeTemplate: CodeTemplate;
  codeId: string;
  codeTitle: string;
  currentModel: CodeModel;
  offsetCodeWrap: string;
  previewWidth: string;
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
  currentModel: 'HTML',
  offsetCodeWrap: '45vw',
  previewWidth: '55vw',
};

type CodeMap = Partial<typeof defaultState.codeContent>;

interface ContentAction<T> {
  type: T;
  code?: string;
  language?: Languages;
  resources?: string[];
}

export const useCodeContentStore = defineStore('code-content', {
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
    setTemplateMap() {
      const defaultTemplateMap = deepClone(DEFAULT_TEMPLATE_MAP);

      Object.assign(TEMPLATE_MAP, defaultTemplateMap);
      TEMPLATE_MAP[this.codeTemplate] = this.codeContent;
    },
    setCodeId(id: string) {
      this.codeId = id;
    },
    setCodeTitle(title: string) {
      this.codeTitle = title;
    },
    setCode(id: string) {
      const { setCodeLoading } = useFlagStore();

      setCodeLoading(true);
      this.setCodeId(id);

      getCode(id)
        .then(async ({ resultMap }) => {
          if (resultMap) {
            const { title, HTML, CSS, JS, VUE, codeTemplate } = resultMap.code;

            await loadParseSources({ HTML, CSS, JS });
            this.setCodeMap({ HTML, CSS, JS, VUE });
            this.setCodeTemplate(codeTemplate);
            this.setCodeTitle(title);
            this.setTemplateMap();
          }
        })
        .finally(() => {
          setCodeLoading(false);
        });
    },
  },
  persist: {
    storage: localStorage,
    pick: ['codeContent', 'codeTemplate', 'codeTitle', 'currentModel', 'offsetCodeWrap', 'previewWidth'],
  },
});
