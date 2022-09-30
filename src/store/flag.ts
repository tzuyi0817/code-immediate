import { defineStore } from "pinia";

const defaultState = {
  isLoading: false,
};

export default defineStore('flag', {
  state: () => ({ ...defaultState }),
  actions: {
    setLoading(isOpen: boolean) {
      this.isLoading = isOpen;
    }
  },
});