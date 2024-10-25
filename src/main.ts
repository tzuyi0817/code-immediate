import { createApp } from 'vue';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import { initMonacoEditor } from '@/monaco';
import fontAwesomeIconPlugin from '@/plugins/font-awesome-icon';
import { loadParse } from '@/utils/load-parse';
import { getTsConstructor } from '@/utils/cdn';
import '@/style/index.css';
import '@/style/tailwind.css';
import App from '@/App.vue';
import router from '@/router';

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
