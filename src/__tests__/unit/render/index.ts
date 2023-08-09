import type { Component } from 'vue';
import { render } from '@testing-library/vue';
import type { RenderOptions } from '@testing-library/vue/types';
import { setActivePinia, createPinia } from 'pinia';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import LoadingButton from '@/components/LoadingButton.vue';

interface RenderComponentOptions extends RenderOptions {
  provide?: Record<any, any>;
}

const pinia = createPinia();

setActivePinia(pinia);

export function renderComponent(testComponent: Component, options?: RenderComponentOptions) {
  const { provide, ...componentOptions } = options ?? {};

  return render(testComponent, {
    ...componentOptions,
    global: {
      stubs: { FontAwesomeIcon },
      plugins: [pinia],
      provide,
    },
  });
}

export function renderLoadingButton() {
  return renderComponent(LoadingButton, { props: { isLoading: false }});
}
