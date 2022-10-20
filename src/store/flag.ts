import { defineStore } from "pinia";
import type { CodeModel } from '@/types/codeContent';

const defaultState = {
  isLoading: false,
  loadingType: '',
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
    setLoading({ type, isOpen }: { type: string, isOpen: boolean }) {
      this.loadingType = type;
      this.isLoading = isOpen;
    },
    setFormatter({ model, isFormatter }: { model: CodeModel, isFormatter: boolean }) {
      this.formatterMap[model] = isFormatter;
    }
  },
});