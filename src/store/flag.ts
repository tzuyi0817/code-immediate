import { defineStore } from "pinia";
import type { CodeModel } from '@/types/codeContent';

const defaultState = {
  isInitLoading: true,
  isLoading: false,
  loadingType: '',
  isStartDrag: false,
  formatterMap: {
    HTML: false,
    CSS: false,
    JS: false,
    VUE: false,
  }
};

export default defineStore('flag', {
  state: () => ({ ...defaultState }),
  getters: {
    isFormatter: (state) => {
      const { HTML, CSS, JS, VUE } = state.formatterMap;
      return HTML || CSS || JS || VUE;
    },
  },
  actions: {
    setInitLoading(isLoading: boolean) {
      this.isInitLoading = isLoading;
    },
    setLoading({ type, isOpen }: { type: string, isOpen: boolean }) {
      this.loadingType = type;
      this.isLoading = isOpen;
    },
    setFormatter({ model, isFormatter }: { model: CodeModel, isFormatter: boolean }) {
      this.formatterMap[model] = isFormatter;
    },
    setDragFlag(isStartDrag: boolean) {
      this.isStartDrag = isStartDrag;
    }
  },
});