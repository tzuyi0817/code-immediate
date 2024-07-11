import { createApp } from 'vue';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import registerFaIcons from '@/utils/registerFaIcons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { initMonacoEditor } from '@/monaco';
import { loadParse } from '@/utils/loadParse';
import { initTemplate } from '@/config/template';
import '@/style/index.css';
import '@/style/tailwind.css';
import App from '@/App.vue';
import router from '@/router';

const pinia = createPinia();
const app = createApp(App);

registerFaIcons();
pinia.use(piniaPluginPersistedstate);
app.use(pinia);
app.use(router);
app.component('font-awesome-icon', FontAwesomeIcon);

(async function init() {
  loadParse('babel');
  await initMonacoEditor();
  initTemplate();
  app.mount('#app');
})();
