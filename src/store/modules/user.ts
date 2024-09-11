import { defineStore } from 'pinia';
import { deepClone } from '@/utils/common';
import type { User } from '@/types/user';

interface UserState {
  user: Partial<User>;
}

const defaultState: UserState = {
  user: {},
};

export const useUserStore = defineStore('code_immediate_user', {
  state: () => deepClone(defaultState),
  getters: {
    isLogin: state => {
      return Object.hasOwn(state.user, 'account');
    },
  },
  actions: {
    setUser(user: Partial<User>) {
      this.user = user;
    },
  },
  persist: {
    storage: localStorage,
    pick: ['user'],
  },
});
