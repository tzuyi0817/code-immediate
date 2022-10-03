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

export const VUE_JS = `const { createApp } = Vue;

createApp({
  setup() {
    const message = 'Hello Vue!';

    return { message };
  },
}).mount('#app');
`;