import { DEFAULT_PLUGIN_OPTIONS } from './constants';
import { tick } from './tick';
import type { ITickDirectiveOptions, ITickDirectiveOptionWithBinding } from './types';

const optionMap = new WeakMap<HTMLElement, Partial<ITickDirectiveOptions> | false>();
const globalOptions = { ...DEFAULT_PLUGIN_OPTIONS };

export default {
  mounted(el: HTMLElement, binding: ITickDirectiveOptionWithBinding) {
    optionMap.set(el, binding.value ?? {});

    el.addEventListener('pointerdown', event => {
      if (binding.value && binding.value.disabled) {
        return;
      }

      const options = optionMap.get(el);

      if (options === false) {
        return;
      }

      tick(event, el, {
        ...globalOptions,
        ...options,
      });
    });
  },
  updated(el: HTMLElement, binding: ITickDirectiveOptionWithBinding) {
    optionMap.set(el, binding.value ?? {});
  },
};
