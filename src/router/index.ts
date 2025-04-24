import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Home from '@/pages/home/index.vue';

export const routes: Array<RouteRecordRaw> = [
  {
    path: '/:catchAll(.*)',
    redirect: '/',
  },
  {
    path: '/:id?',
    name: 'Home',
    component: Home,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
