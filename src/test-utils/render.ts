import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query';
import { render } from '@testing-library/vue';
import { createPinia, setActivePinia } from 'pinia';
import { ref, type Component } from 'vue';
import { createMemoryHistory, createRouter } from 'vue-router';
import { routes } from '@/router';
import type { RenderOptions } from '@testing-library/vue/types';

interface RenderComponentOptions extends RenderOptions<unknown> {
  provide?: Record<PropertyKey, unknown>;
}

function createTestPinia() {
  const testPinia = createPinia();

  setActivePinia(testPinia);

  return testPinia;
}

const pinia = createTestPinia();

export const router = createRouter({ history: createMemoryHistory(), routes });

export function renderComponent(testComponent: Component, options?: RenderComponentOptions) {
  const { provide, ...componentOptions } = options ?? {};

  return render(testComponent, {
    ...componentOptions,
    global: {
      stubs: { FontAwesomeIcon },
      directives: { tick: {} },
      plugins: [pinia, router, [VueQueryPlugin, { queryClient: new QueryClient() }]],
      provide: { iframeRef: ref(null), ...provide },
    },
  });
}
