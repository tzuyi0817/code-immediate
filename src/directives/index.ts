import tick from './tick';
import type { App } from 'vue';

export default {
  install(app: App) {
    app.directive('tick', tick);
  },
};
