import type { Component } from 'vue';
import { render } from '@testing-library/vue';
import { setActivePinia, createPinia } from 'pinia';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import LoadingButton from '@/components/LoadingButton.vue';

interface RenderComponentOptions {
  props?: Record<string, any>;
}

const pinia = createPinia();

setActivePinia(pinia);


export function renderComponent(TestComponent: Component, options?: RenderComponentOptions) {
  const { props } = options ?? {};

  return render(TestComponent, {
    props,
    global: {
      stubs: { FontAwesomeIcon },
      plugins: [pinia],
    },
  });
}

export function renderLoadingButton() {
  return renderComponent(LoadingButton, { props: { isLoading: false }});
}
