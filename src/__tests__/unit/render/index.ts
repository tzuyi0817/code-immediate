import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query';
import { render } from '@testing-library/vue';
import { createPinia, setActivePinia } from 'pinia';
import { createMemoryHistory, createRouter } from 'vue-router';
import { routes } from '@/router';
import type { RenderOptions } from '@testing-library/vue/types';
import type { Component } from 'vue';

interface RenderComponentOptions extends RenderOptions<unknown> {
  provide?: Record<PropertyKey, unknown>;
}

const pinia = createPinia();

export const router = createRouter({ history: createMemoryHistory(), routes });

setActivePinia(pinia);

export function renderComponent(testComponent: Component, options?: RenderComponentOptions) {
  const { provide, ...componentOptions } = options ?? {};

  return render(testComponent, {
    ...componentOptions,
    global: {
      stubs: { FontAwesomeIcon },
      plugins: [pinia, router, [VueQueryPlugin, { queryClient: new QueryClient() }]],
      provide,
    },
  });
}
