import { createApp } from 'vue';
import { createPinia } from "pinia";
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faPenFancy, faAngleDown, faSpinner, faCheck } from '@fortawesome/free-solid-svg-icons';
import { initMonacoEditor } from '@/utils/monacoEditor';
import { loadParse } from '@/utils/loadParse';
import '@/style/index.css';
import '@/style/tailwind.css';
import App from '@/App.vue';
import router from '@/router';

const pinia = createPinia();
const app = createApp(App);

library.add(faPenFancy, faAngleDown, faSpinner, faCheck);
app.use(pinia);
app.use(router);
app.component('font-awesome-icon', FontAwesomeIcon);

(async function init() {
  loadParse('babel');
  await initMonacoEditor();
  app.mount('#app');
})();
