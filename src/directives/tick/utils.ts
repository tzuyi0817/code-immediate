import { RIPPLE_COUNT } from './constants';
import type { ITickDirectiveOptions } from './types';

export function createContainer({
  borderTopLeftRadius,
  borderTopRightRadius,
  borderBottomLeftRadius,
  borderBottomRightRadius,
}: CSSStyleDeclaration) {
  const tickContainer = document.createElement('div');

  tickContainer.style.top = '0';
  tickContainer.style.left = '0';
  tickContainer.style.width = '100%';
  tickContainer.style.height = '100%';
  tickContainer.style.position = 'absolute';

  tickContainer.style.borderRadius = `${borderTopLeftRadius} ${borderTopRightRadius} ${borderBottomRightRadius} ${borderBottomLeftRadius}`;
  tickContainer.style.overflow = 'hidden';
  tickContainer.style.pointerEvents = 'none';

  // Compatible with IE Apple
  tickContainer.style.webkitMaskImage = '-webkit-radial-gradient(white, black)';

  return tickContainer;
}

export function createTickElement(x: number, y: number, size: number, options: ITickDirectiveOptions) {
  const tickElement = document.createElement('div');

  tickElement.style.position = 'absolute';
  tickElement.style.width = `${size}px`;
  tickElement.style.height = `${size}px`;
  tickElement.style.top = `${y}px`;
  tickElement.style.left = `${x}px`;
  tickElement.style.background = options.color;
  tickElement.style.borderRadius = '50%';
  tickElement.style.opacity = `${options.initialOpacity}`;
  tickElement.style.transform = 'translate(-50%,-50%) scale(0)';
  tickElement.style.transition = `transform ${options.duration / 1000}s ${options.easing}, opacity ${
    options.duration / 1000
  }s ${options.easing}`;

  return tickElement;
}

export function magnitude(x1: number, y1: number, x2: number, y2: number): number {
  const deltaX = x1 - x2;
  const deltaY = y1 - y2;

  return Math.hypot(deltaX, deltaY);
}

export function getDistanceToFurthestCorner(x: number, y: number, { width, height }: DOMRect) {
  // Get the distance from the click target to the block scope boundary
  const topLeft = magnitude(x, y, 0, 0);
  const topRight = magnitude(x, y, width, 0);
  const bottomLeft = magnitude(x, y, 0, height);
  const bottomRight = magnitude(x, y, width, height);

  return Math.max(topLeft, topRight, bottomLeft, bottomRight);
}

export function getRelativePointer({ x, y }: PointerEvent, { top, left }: DOMRect) {
  return {
    x: x - left,
    y: y - top,
  };
}

function setTickCount(el: HTMLElement, count: number) {
  el.dataset[RIPPLE_COUNT] = count.toString();
}

export function getTickCount(el: HTMLElement): number {
  return Number.parseInt(el.dataset[RIPPLE_COUNT] ?? '0', 10);
}

export function incrementTickCount(el: HTMLElement): void {
  const count = getTickCount(el);

  setTickCount(el, count + 1);
}

export function decrementTickCount(el: HTMLElement): void {
  const count = getTickCount(el);

  setTickCount(el, count - 1);
}

export function deleteTickCount(el: HTMLElement): void {
  delete el.dataset[RIPPLE_COUNT];
}
