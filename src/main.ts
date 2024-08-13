import { createApp } from 'vue';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { registerIcons } from '@/utils/registerIcons';
import { initMonacoEditor } from '@/monaco';
import { loadParse } from '@/utils/loadParse';
import { getTsConstructor } from '@/utils/cdn';
import '@/style/index.css';
import '@/style/tailwind.css';
import App from '@/App.vue';
import router from '@/router';

const pinia = createPinia();
const app = createApp(App);

registerIcons();
pinia.use(piniaPluginPersistedstate);
app.use(pinia);
app.use(router);
app.component('font-awesome-icon', FontAwesomeIcon);

(async function init() {
  loadParse('babel');
  await Promise.all([initMonacoEditor(), getTsConstructor()]);
  app.mount('#app');
})();
