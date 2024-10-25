import { strFromU8, strToU8, zlibSync } from 'fflate';
import { isArray, isObject } from '@/utils/check-type';

export function debounce<T extends (...args: Parameters<T>) => ReturnType<T>>(fun: T, delay = 500) {
  if (typeof fun !== 'function') throw new Error('The first argument must be a function');
  let timer: NodeJS.Timeout | null = null;

  return function (this: void, ...args: Parameters<T>) {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      fun.apply(this, args);
      timer = null;
    }, delay);
  };
}

export function throttle<T extends (...args: Parameters<T>) => ReturnType<T>>(fun: T, delay = 500) {
  if (typeof fun !== 'function') throw new Error('The first argument must be a function');
  let timeStamp = 0;

  return function (this: void, ...args: Parameters<T>) {
    const now = Date.now();

    if (now - timeStamp <= delay) return;
    fun.apply(this, args);
    timeStamp = now;
  };
}

export function sleep(delay = 500) {
  return new Promise(resolve => setTimeout(resolve, delay));
}

export function deepClone<T extends object>(obj: T, hash = new WeakMap()): T {
  if (obj instanceof Date || obj instanceof RegExp) return obj;
  if (hash.has(obj)) return hash.get(obj);

  const descriptors = Object.getOwnPropertyDescriptors(obj);
  const clone = isArray(obj) ? [] : Object.create(Object.getPrototypeOf(obj), descriptors);

  hash.set(obj, clone);
  Reflect.ownKeys(obj).forEach(key => {
    const value = obj[key as keyof T];
    clone[key] = isObject(value) ? deepClone(value, hash) : value;
  });
  return clone;
}

export function utoa(str: string) {
  const buffer = strToU8(str);
  const compressed = zlibSync(buffer, { level: 9 });
  const binary = strFromU8(compressed, true);

  return btoa(binary);
}
