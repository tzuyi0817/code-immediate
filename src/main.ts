import { createApp } from 'vue';
import { createPinia } from "pinia";
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faPenFancy } from '@fortawesome/free-solid-svg-icons';
import '@/index.css';
import App from '@/App.vue';
import router from '@/router';

const pinia = createPinia();
const app = createApp(App);

library.add(faPenFancy);
app.use(pinia);
app.use(router);
app.component('font-awesome-icon', FontAwesomeIcon);
app.mount('#app');
