(function () {
  const consoleProxy = new Proxy(console, {
    get(target, prop, receiver) {
      const value = Reflect.get(...arguments);

      return function (...args) {
        const data = args.reduce((result, arg) => result + ` ${formatMessage(arg)}`, '');
        postMessageToParent({ type: prop, data });
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
      function: () => {
        const [statement, args, ...msg] = message.toString().split(/[)(]/);
        const [fun, variable] = statement.split(' ');
        const argsDom = args.split(',').filter(Boolean).reduce((dom, arg, index) => {
          const comma = index === 0 ? '' : ', ';
          return dom + `${comma}<span class="def">${arg.trim()}</span>`;
        }, '');
        return `<span class="key">${fun}</span>` +
          `<span class="def"> ${variable}</span>` +
          `(${argsDom}) ` +
          `<span>${msg.join('')}</span>`;
      },
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
