import { createPinia as create } from 'pinia';
import { createPersistedState } from 'pinia-plugin-persistedstate';
import { STORAGE_PREFIX } from './constants';

export { useCodeContentStore } from '@/store/modules/code-content';
export { useFlagStore } from '@/store/modules/flag';
export { useUserStore } from '@/store/modules/user';
export * from './constants';

export function createPinia() {
  const pinia = create();
  const persistedState = createPersistedState({
    key: storeKey => `${STORAGE_PREFIX}-${storeKey}`,
  });

  pinia.use(persistedState);

  return pinia;
}
