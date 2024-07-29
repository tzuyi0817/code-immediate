import type { Component } from 'vue';
import { createRouter, createMemoryHistory } from 'vue-router';
import { render } from '@testing-library/vue';
import type { RenderOptions } from '@testing-library/vue/types';
import { setActivePinia, createPinia } from 'pinia';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import LoadingButton from '@/components/LoadingButton.vue';
import { routes } from '@/router';

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
      plugins: [pinia, router],
      provide,
    },
  });
}

export function renderLoadingButton() {
  return renderComponent(LoadingButton, { props: { isLoading: false } });
}
