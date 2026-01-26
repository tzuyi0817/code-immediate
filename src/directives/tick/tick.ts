import { MULTIPLE_NUMBER } from './constants';
import {
  createContainer,
  createTickElement,
  decrementTickCount,
  deleteTickCount,
  getDistanceToFurthestCorner,
  getRelativePointer,
  getTickCount,
  incrementTickCount,
} from './utils';
import type { ITickDirectiveOptions } from './types';

export function tick(event: PointerEvent, el: HTMLElement, options: ITickDirectiveOptions) {
  const rect = el.getBoundingClientRect();
  const computedStyles = globalThis.getComputedStyle(el);
  const { x, y } = getRelativePointer(event, rect);
  const size = MULTIPLE_NUMBER * getDistanceToFurthestCorner(x, y, rect);
  const tickContainer = createContainer(computedStyles);
  const tickEl = createTickElement(x as number, y as number, size, options);
  let originalPositionValue = '';
  let shouldDissolveTick = false;
  let token: ReturnType<typeof setTimeout> | null = null;

  function dissolveTick() {
    tickEl.style.transition = 'opacity 150ms linear';
    tickEl.style.opacity = '0';

    setTimeout(() => {
      tickContainer.remove();

      decrementTickCount(el);

      if (getTickCount(el) === 0) {
        deleteTickCount(el);

        el.style.position = originalPositionValue;
      }
    }, 150);
  }
  function releaseTick(e?: PointerEvent) {
    if (e !== undefined) {
      document.removeEventListener('pointerup', releaseTick);
      document.removeEventListener('pointercancel', releaseTick);
    }

    if (shouldDissolveTick) {
      dissolveTick();
    } else {
      shouldDissolveTick = true;
    }
  }

  function cancelTick() {
    if (token) {
      clearTimeout(token);
    }

    tickContainer.remove();
    document.removeEventListener('pointerup', cancelTick);
    document.removeEventListener('pointercancel', cancelTick);
    document.removeEventListener('pointercancel', cancelTick);
  }

  incrementTickCount(el);

  if (computedStyles.position === 'static') {
    if (el.style.position) {
      originalPositionValue = el.style.position;
    }

    el.style.position = 'relative';
  }

  tickContainer.append(tickEl);
  el.append(tickContainer);

  document.addEventListener('pointerup', releaseTick);
  document.addEventListener('pointercancel', releaseTick);
  document.addEventListener('pointercancel', cancelTick);

  token = setTimeout(() => {
    document.removeEventListener('pointercancel', cancelTick);

    requestAnimationFrame(() => {
      tickEl.style.transform = 'translate(-50%,-50%) scale(1)';
      tickEl.style.opacity = `${options.finalOpacity}`;

      setTimeout(() => releaseTick(), options.duration);
    });
  }, options.delay);
}
