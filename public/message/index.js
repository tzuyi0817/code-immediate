(function () {
  // self.onerror = function (event, source, lineno, colno, error) {
  //   window.parent.postMessage('error');
  // }

  const consoleProxy = new Proxy(console, {
    get(target, prop, receiver) {
      const value = Reflect.get(...arguments);

      return function (...args) {
        self.parent.postMessage({
          type: prop,
          data: formatMessage(args[0]),
        });
        return value.apply(target, args);
      }
    },
  });

  self.console = consoleProxy;
  self.addEventListener('message', ({ data: { value, type } }) => {
    const typeMap = {
      command() {
        postMessageToParent({ type: 'echo', data: value });
        try {
          console.log(Function(`"use strict";return ${value}`)());
        } catch (error) {
          console.error(error);
        }
      },
    };
    typeMap[type]();
  });

  function postMessageToParent({ type, data }) {
    self.parent.postMessage({ type, data });
  }

  function formatMessage(message) {
    const messageType = Object.prototype.toString.call(message).slice(8, -1).toLowerCase();
    const messageTypeMap = {
      null: 'null',
      undefined: 'undefined',
      // array: message.reduce((result, value) => {
      //   return `<pre class=""></pre>`
      // }, ''),
    };
    return {
      messageType,
      message: messageTypeMap[messageType] ?? message.toString(),
    };
  }
})();
