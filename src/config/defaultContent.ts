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

export const VUE_JS = `const { createApp, ref } = Vue;

createApp({
  setup() {
    const message = ref('Hello Vue!');

    return { message };
  },
}).mount('#app');
`;


export const REACT_JS = `const rootDom = document.getElementById('root');
const root = ReactDOM.createRoot(rootDom);
const { useState } = React;

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