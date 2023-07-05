import { defineStore } from "pinia";
import { deepClone } from '@/utils/common';
import type { User } from '@/types/user';

const defaultState = {
  user: {} as User,
};

export default defineStore('code_immediate_user', {
  state: () => deepClone(defaultState),
  getters: {
    isLogin: (state) => {
      return Object.hasOwn(state.user, 'account');
    },
  },
  actions: {
    setUser(user: User) {
      this.user = user;
    },
  },
  persist: {
    storage: localStorage,
    paths: [
      'user',
    ],
  },
});