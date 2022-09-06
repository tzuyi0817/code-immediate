export function debounce(fun: Function, delay = 500) {
  let timer: NodeJS.Timeout | null = null;

  return function (this: Function, ...args: unknown[]) {
    timer && clearTimeout(timer);
    timer = setTimeout(() => {
      fun.apply(this, args);
      timer = null;
    }, delay);
  }
}

export function throttle(fun: Function, delay = 500): Function {
  let timeStamp = 0;

  return function (this: Function, ...args: unknown[]) {
    const now = Date.now();
    if (now - timeStamp <= delay) return;
    fun.apply(this, args);
    timeStamp = now;
  }
}
