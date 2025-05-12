import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import { createApp } from 'vue';
import App from '@/App.vue';
import { initMonacoEditor } from '@/monaco';
import fontAwesomeIconPlugin from '@/plugins/font-awesome-icon';
import router from '@/router';
import { getTsConstructor } from '@/utils/cdn';
import { loadParse } from '@/utils/load-parse';
import { worker } from './mocks/browser';

import '@/styles/index.css';

worker.start();

const pinia = createPinia();
const app = createApp(App);

pinia.use(piniaPluginPersistedstate);
app.use(pinia);
app.use(router);
app.use(fontAwesomeIconPlugin);

(async function init() {
  loadParse('babel');
  getTsConstructor();
  await initMonacoEditor();
  app.mount('#app');
})();
