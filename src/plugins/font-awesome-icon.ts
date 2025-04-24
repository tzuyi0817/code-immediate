import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { registerIcons } from '@/utils/register-icons';
import type { App } from 'vue';

export default {
  install(app: App) {
    registerIcons();
    app.component('font-awesome-icon', FontAwesomeIcon);
  },
};
