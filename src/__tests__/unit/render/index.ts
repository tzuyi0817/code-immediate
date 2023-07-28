import type { Component } from 'vue';
import { render } from '@testing-library/vue';
import { setActivePinia, createPinia } from 'pinia';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import LoadingButton from '@/components/LoadingButton.vue';

interface RenderComponentOptions {
  props?: Record<string, any>;
  provide?: Record<any, any>;
}

const pinia = createPinia();

setActivePinia(pinia);


export function renderComponent(testComponent: Component, options?: RenderComponentOptions) {
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
