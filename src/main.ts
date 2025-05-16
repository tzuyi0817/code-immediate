import { createApp } from 'vue';
import router from '@/router';
import App from './App.vue';
import { initMonacoEditor } from './monaco';
import fontAwesomeIconPlugin from './plugins/font-awesome-icon';
import { createPinia } from './store';
import { getTsConstructor } from './utils/cdn';
import { loadParse } from './utils/load-parse';
import './styles/index.css';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);
app.use(fontAwesomeIconPlugin);

(async function init() {
  loadParse('babel');
  getTsConstructor();
  await initMonacoEditor();
  app.mount('#app');
})();
