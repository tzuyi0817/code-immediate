import { createApp } from 'vue';
import { createPinia } from "pinia";
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import {
  faPenFancy,
  faAngleDown,
  faSpinner,
  faCheck,
  faXmark,
  faGear,
  faMagnifyingGlass,
  faBarsStaggered,
  faCloudArrowUp,
  faSheetPlastic,
  faAngleLeft,
  faAngleRight,
  faTrash,
  faFileCirclePlus,
  faArrowRightFromBracket,
} from '@fortawesome/free-solid-svg-icons';
import { faEye } from '@fortawesome/free-regular-svg-icons';
import { faGithub, faCentos } from '@fortawesome/free-brands-svg-icons';
import { initMonacoEditor } from '@/utils/monacoEditor';
import { loadParse } from '@/utils/loadParse';
import { initTemplate } from '@/config/template';
import '@/style/index.css';
import '@/style/tailwind.css';
import App from '@/App.vue';
import router from '@/router';

const pinia = createPinia();
const app = createApp(App);

library.add(
  faPenFancy,
  faAngleDown,
  faSpinner,
  faCheck,
  faXmark,
  faGear,
  faMagnifyingGlass,
  faBarsStaggered,
  faCloudArrowUp,
  faSheetPlastic,
  faFileCirclePlus,
  faAngleLeft,
  faAngleRight,
  faTrash,
  faEye,
  faGithub,
  faCentos,
  faArrowRightFromBracket,
);
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
