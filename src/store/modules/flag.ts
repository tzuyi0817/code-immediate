import { defineStore } from 'pinia';
import type { CodeModel } from '@/types/code-content';

const defaultState = {
  isLoading: false,
  loadingType: '',
  isStartDrag: false,
  isCreateProject: false,
  isCodeLoading: false,
  isChangeCode: false,
  formatterMap: {
    HTML: false,
    CSS: false,
    JS: false,
    VUE: false,
  },
  EmbedMap: {
    HTML: false,
    CSS: false,
    JS: false,
    VUE: false,
  },
};

export const useFlagStore = defineStore('code_immediate_flag', {
  state: () => ({ ...defaultState }),
  getters: {
    isFormatter: state => {
      const { HTML, CSS, JS, VUE } = state.formatterMap;
      return HTML || CSS || JS || VUE;
    },
  },
  actions: {
    setLoading({ type, isOpen }: { type: string; isOpen: boolean }) {
      this.loadingType = type;
      this.isLoading = isOpen;
    },
    setFormatter({ model, isFormatter }: { model: CodeModel; isFormatter: boolean }) {
      this.formatterMap[model] = isFormatter;
    },
    setDragFlag(isStartDrag: boolean) {
      this.isStartDrag = isStartDrag;
    },
    setCreateProjectFlag(isCreate: boolean) {
      this.isCreateProject = isCreate;
    },
    setCodeLoading(isLoading: boolean) {
      this.isCodeLoading = isLoading;
    },
    setChangeCodeFlag(isChange: boolean) {
      this.isChangeCode = isChange;
    },
    setEmbedFlag({ model, isEmbed }: { model: CodeModel; isEmbed: boolean }) {
      this.EmbedMap[model] = isEmbed;
    },
  },
});
