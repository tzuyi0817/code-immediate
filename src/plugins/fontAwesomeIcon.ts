import type { App } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { registerIcons } from '@/utils/registerIcons';

export default {
  install(app: App) {
    registerIcons();
    app.component('font-awesome-icon', FontAwesomeIcon);
  },
};
