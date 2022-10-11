(function () {
  const consoleProxy = new Proxy(console, {
    get(target, prop, receiver) {
      const value = Reflect.get(...arguments);

      return function (...args) {
        postMessageToParent({ type: prop, data: formatMessage(args[0]) });
        return value.apply(target, args);
      }
    },
  });

  self.console = consoleProxy;
  self.onerror = function (event) {
    console.error(`${event} at ${self.parent.origin}`);
  };

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
      throwError: () => console.error(value),
    };
    typeMap[type]();
  });

  function postMessageToParent({ type, data }) {
    self.parent.postMessage({ type, data });
  }

  function formatMessage(message) {
    const messageType = Object.prototype.toString.call(message).slice(8, -1).toLowerCase();
    const messageTypeMap = {
      string: () => `<span class="${messageType}">"${message}"</span>`,
      null: () => '<span class="atom">null<span>',
      undefined: () => '<span class="atom">undefined</span>',
      boolean: () => `<span class="atom">${message}</span>`,
      symbol: () => `<span class="atom">Symbol(${formatMessage(message.description)})</span>`,
      array: () => {
        const assemble = message.reduce((result, value, index) => {
          const comma = index === message.length - 1 ? '' : ',';
          return result + formatMessage(value) + comma;
        }, '');
        return `[${assemble}]`;
      },
      object: () => {
        const assemble = Reflect.ownKeys(message).reduce((result, key) => {
          return result + `  <span class="key">${key}:</span> ${formatMessage(message[key])}` + '\n';
        }, '');
        return `{\n${assemble}}`;
      }
    };
    return messageTypeMap[messageType]?.() ?? `<span class="${messageType}">${message}</span>`;
  }
})();
