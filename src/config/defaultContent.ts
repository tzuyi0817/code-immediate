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

  return (
    <h1>{message}</h1>
  );
}

root.render(<App />);
`;