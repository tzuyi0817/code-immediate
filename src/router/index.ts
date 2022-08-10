import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: '/:catchAll(.*)',
    redirect: '/index',
  },
  {
    path: '/index',
    name: 'Index',
    component: () => import('@/pages/Index.vue')
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
