(function () {
  const consoleProxy = new Proxy(console, {
    get(target, prop, receiver) {
      const value = Reflect.get(...arguments);

      return function (...args) {
        const message = args.join(' ');

        if (message.includes('You are running a development build of Vue')) return;
        if (message.includes('You are running the esm-bundler build of Vue')) return;

        const html = args.reduce((result, arg) => result + `${formatMessage(arg)} `, '');

        postMessageToParent({ type: prop, html, message });
        return value.apply(target, args);
      }
    },
  });

  self.console = consoleProxy;
  self.onerror = function (message) {
    console.error(`${message} at ${self.parent.origin}`);
  };

  self.addEventListener('unhandledrejection', error => {
    console.error(`Uncaught (in promise) ${error.reason} at ${self.parent.origin}`);
  });

  self.addEventListener('message', ({ data: { value, type } }) => {
    const typeMap = {
      command() {
        postMessageToParent({ type: 'echo', html: value, message: value });
        try {
          console.log(Function(`"use strict";return ${value}`)());
        } catch (error) {
          console.error(error);
        }
      },
      throwError: () => console.error(value),
    };
    if (!typeMap[type]) return;
    typeMap[type]();
  });

  function postMessageToParent(data) {
    self.parent.postMessage(data);
  }

  function formatMessage(message, deep = 0) {
    const originType = Object.prototype.toString.call(message).slice(8, -1).toLowerCase();
    const isHtmlElement = /^html.*element/.test(originType);
    const messageType = isHtmlElement ? 'html' : originType;
    const messageTypeMap = {
      string: () => `<span class="${messageType}">${message.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</span>`,
      null: () => '<span class="atom">null<span>',
      undefined: () => '<span class="atom">undefined</span>',
      boolean: () => `<span class="atom">${message}</span>`,
      symbol: () => `<span class="atom">Symbol(${formatMessage(message.description)})</span>`,
      function: () => {
        const stringifyMessage = message.toString();
        const argStart = stringifyMessage.indexOf('(');
        const argEnd = stringifyMessage.indexOf(')');
        const statement = stringifyMessage.slice(0, argStart);
        const args = stringifyMessage.slice(argStart + 1, argEnd);
        const msg = stringifyMessage.slice(argEnd + 1);
        const [fun, variable] = statement.split(' ');
        const argsDom = args?.split(',').filter(Boolean).reduce((dom, arg, index) => {
          const comma = index === 0 ? '' : ', ';
          return dom + `${comma}<span class="key">${arg.trim()}</span>`;
        }, '');
        return `<span class="var">${fun}</span>` +
          `<span class="def"> ${variable}</span>` +
          `(${argsDom})` +
          `<span>${msg}</span>`;
      },
      array: () => {
        const assemble = message.reduce((result, value, index) => {
          const comma = index === message.length - 1 ? '' : ',';
          return result + formatMessage(value) + comma;
        }, '');
        return `[${assemble}]`;
      },
      object: () => {
        const keys = Object.keys(message);
        const tab = '&nbsp&nbsp'.repeat(deep + 1);
        const assemble = keys.reduce((result, key, index) => {
          const comma = index === keys.length - 1 ? '' : ',';
          return result + `${tab}<span class="key">${key}:</span> ${formatMessage(message[key], deep + 1)}${comma}` + '\n';
        }, '');
        return `{\n${assemble}${'&nbsp&nbsp'.repeat(deep)}}`;
      },
      html: () => `<span class="html">${formatHtml(message)}</span>`,
    };
    return messageTypeMap[messageType]?.() ?? `<span class="${messageType}">${message}</span>`;
  }

  function formatHtml(html, deep = 0) {
    const { localName, attributes, children, textContent } = html;
    const tab = '&nbsp&nbsp'.repeat(deep);
    const isHasChildren = children.length;

    return `${tab}<span class="symbol"><</span>` +
      `<span class="tag">${localName}</span>` +
      formatHtmlAttributes(Array.from(attributes)) +
      '<span class="symbol">></span>' +
      (isHasChildren ? formatHtmlChild(children, deep) : textContent) +
      `${isHasChildren ? `\n${tab}` : ''}<span class="symbol">&lt/</span>` +
      `<span class="tag">${localName}</span>` +
      '<span class="symbol">></span>';
  }

  function formatHtmlAttributes(attributes) {
    return attributes.reduce((result, { localName, nodeValue }) => {
      return result + ` <span class="attribute">${localName}</span>=<span class="string">"${nodeValue}"</span>`;
    }, '');
  }

  function formatHtmlChild(children, deep) {
    return `\n${Array.from(children).map(child => formatHtml(child, deep + 1)).join('\n')}`;
  }
})();
