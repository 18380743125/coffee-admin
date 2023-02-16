import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import('@/views/layout/Layout.vue'),
    redirect: '/member',
    children: [
      {
        path: 'member',
        name: 'member',
        component: () => import('@/views/member/Member.vue')
      },
      {
        path: 'coffee',
        name: 'coffee',
        component: () => import('@/views/coffee/Coffee.vue')
      },
      {
        path: 'order',
        name: 'order',
        component: () => import('@/views/order/Order.vue')
      }
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/Login.vue')
  },
  {
    path: '/:catchAll(.*)',
    redirect: '/member'
  }
]

export default createRouter({
  history: createWebHistory(),
  routes
})