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
  },
  selectedLanguage: {
    html: 'HTML',
    css: 'CSS',
    javascript: 'JavaScript'
  },
};

interface ContentAction {
  type: keyof typeof defaultState.codeContent;
  code: string;
}

interface SelectedLanguage {
  html: string;
  css: string;
  javascript: string;
}

export default defineStore('codeContent', {
  state: () => ({ ...defaultState }),
  actions: {
    setCodeContent({ type, code }: ContentAction) {
      this.codeContent[type].content = code;
    },
    setSelectedLanguage(selectedLanguage: SelectedLanguage) {
      this.selectedLanguage = selectedLanguage;
    },
  },
});
