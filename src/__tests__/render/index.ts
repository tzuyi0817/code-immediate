import { render } from '@testing-library/vue';
import { setActivePinia, createPinia, type Pinia } from 'pinia';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import LoadingButton from '@/components/LoadingButton.vue';

interface RenderComponentOptions {
  props?: Record<string, any>;
  pinia?: Pinia;
}

export function setPinia() {
  const pinia = createPinia();

  setActivePinia(pinia);
  return pinia;
}

export function renderComponent(TestComponent: any, options?: RenderComponentOptions) {
  const { props, pinia } = options ?? {};

  return render(TestComponent, {
    props,
    global: {
      stubs: { FontAwesomeIcon },
      plugins: pinia ? [pinia] : undefined,
    },
  });
}

export function renderLoadingButton() {
  return renderComponent(LoadingButton, { props: { isLoading: false }});
}
