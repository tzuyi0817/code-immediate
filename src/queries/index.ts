import { QueryClient } from '@tanstack/vue-query';

export * from './modules/code';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: { gcTime: 1000 * 60 * 60 * 5 },
  },
});
