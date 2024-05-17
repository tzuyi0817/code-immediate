export const VUE_HTML = `<div id="app">
  <h1>{{ message }}</h1>
  <input type="text" v-model="message" />
</div>
`;

export const VUE_CSS = `#app {
  font-family: sans-serif;
  border: 1px solid #eee;
  border-radius: 2px;
  padding: 20px 30px;
  margin-top: 1em;
  margin-bottom: 40px;
  user-select: none;
  overflow-x: auto;
}`;

export const VUE_JS = `import { createApp, ref } from 'vue';

createApp({
  setup() {
    const message = ref('Hello Vue!');

    return { message };
  },
}).mount('#app');
`;

export const VUE_SFC_CONTENT = `<script setup lang="ts">
import { ref } from 'vue';

const message = ref('Hello Vue!');
</script>

<template>
  <h1>{{ message }}</h1>
  <input type="text" v-model="message" />
</template>

<style lang="css">
#app {
  font-family: sans-serif;
  border: 1px solid #eee;
  border-radius: 2px;
  padding: 20px 30px;
  margin-top: 1em;
  margin-bottom: 40px;
  user-select: none;
  overflow-x: auto;
}
</style>`;

export const REACT_JS = `import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';

const rootDom = document.getElementById('root');
const root = createRoot(rootDom);

function App(props) {
  const [message, setMessage] = useState('Hello React!');

  function inputHandler(event) {
    const { value } = event.target;

    setMessage(value);
  }

  return (
    <>
      <h1>{message}</h1>
      <input
        type="text"
        value={message}
        onChange={inputHandler}
      />
    </>
  );
}

root.render(<App />);
`;

export const ANGULAR_HTML = `<div ng-app="app">
  <div ng-controller="HelloCtrl">
    <h1>{{ message }}</h1>
    <input type="text" ng-model="message" />
  </div>
</div>
`;

export const ANGULAR_JS = `const app = angular.module('app', []);

app.controller('HelloCtrl', ($scope) => {
  $scope.message = 'Hello AngularJs!';
});
`;

export const SOLID_JS = `import { createSignal, onCleanup } from 'solid-js';
import { render } from 'solid-js/web';
import h from 'solid-js/h';
import html from 'solid-js/html';

const App = () => {
  const [message, setMessage] = createSignal('Hello SolidJs!');
  const [count, setCount] = createSignal(0);
  const timer = setInterval(() => setCount(count() + 1), 1000);

  function inputHandler(event) {
    const { value } = event.target;
    setMessage(value);
  }

  onCleanup(() => clearInterval(timer));
  return [
    h('h1', message),
    h('input', { type: 'text', value: message, onInput: inputHandler }),
    h('p.count', count),
  ];
};

render(App, document.getElementById('root'));
`;

export const SOLID_CSS = `.count {
  font-family: sans-serif;
  font-size: 18px;
  font-weight: bold;
  padding: 10px;
  margin-top: 1em;
  margin-bottom: 40px;
}`;

export const RXJS_HTML = `<header>
  <img
    src="https://rxjs.dev/generated/images/marketing/home/Rx_Logo-512-512.png"
    class="logo"
  />
  <h1>RxJS Playground</h1>
</header>
`;

export const RXJS_JS =
  `import { fromEvent } from 'rxjs';
import { filter, map } from 'rxjs/operators';

fromEvent(document, 'click')
  .pipe(
    filter((_, index) => index % 2 === 0),
    map((event) => ({ x: event.x, y: event.y }))
  )
  .subscribe((position) => {
    console.log(` +
  '`x: ${position.x}, y: ${position.y}`);' +
  `
  });
`;

export const RXJS_CSS = `:root {
  --bg-color: #d81b60;
  --font-base: aliceblue;
}

html,
body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-size: 16px;
  background-color: var(--bg-color);
  color: var(--font-base);
  margin-top: 20px;
}

header {
  text-align: center;
}

.logo {
  width: 100px;
  height: 100px;
}
`;
