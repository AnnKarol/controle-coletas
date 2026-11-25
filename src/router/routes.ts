import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('@/pages/ColetasPage.vue') },
      { path: 'painel', component: () => import('@/pages/PainelPage.vue') },
    ],
  },

  // Qualquer endereço que não existe cai na página de erro
  {
    path: '/:catchAll(.*)*',
    component: () => import('@/pages/ErrorNotFound.vue'),
  },
];

export default routes;
