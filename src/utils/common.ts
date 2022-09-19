import { isArray, isObject } from "@/utils/checkType";

export function debounce(fun: Function, delay = 500) {
  let timer: NodeJS.Timeout | null = null;

  return function (this: unknown, ...args: unknown[]) {
    timer && clearTimeout(timer);
    timer = setTimeout(() => {
      fun.apply(this, args);
      timer = null;
    }, delay);
  }
}

export function throttle(fun: Function, delay = 500) {
  let timeStamp = 0;

  return function (this: unknown, ...args: unknown[]) {
    const now = Date.now();
    if (now - timeStamp <= delay) return;
    fun.apply(this, args);
    timeStamp = now;
  }
}

export function sleep(delay = 500) {
  return new Promise(resolve => setTimeout(resolve, delay));
}

export function deepClone(obj: any, hash = new WeakMap()) {
  if (obj instanceof Date) return new Date(obj);
  if (obj instanceof RegExp) return new RegExp(obj);
  if (hash.has(obj)) return hash.get(obj);

  const descriptors = Object.getOwnPropertyDescriptors(obj);
  const clone = isArray(obj) ? [] : Object.create(Object.getPrototypeOf(obj), descriptors);

  hash.set(obj, clone);
  Reflect.ownKeys(obj).forEach(key => {
    const value = obj[key];
    clone[key] = isObject(value) ? deepClone(value, hash) : value;
  });
  return clone;
}
