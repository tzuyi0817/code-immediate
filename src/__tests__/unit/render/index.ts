import type { Component } from 'vue';
import { render, RenderOptions } from '@testing-library/vue';
import { setActivePinia, createPinia } from 'pinia';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import LoadingButton from '@/components/LoadingButton.vue';

const pinia = createPinia();

setActivePinia(pinia);

export function renderComponent(testComponent: Component, options?: RenderOptions) {
  const componentOptions = options ?? {};

  return render(testComponent, {
    ...componentOptions,
    global: {
      stubs: { FontAwesomeIcon },
      plugins: [pinia],
    },
  });
}

export function renderLoadingButton() {
  return renderComponent(LoadingButton, { props: { isLoading: false }});
}
