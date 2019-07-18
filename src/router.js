import Vue from 'vue'
import Router from 'vue-router'
import AuthLayout from './layout/AuthLayout.vue'
import DashboardLayout from '@/layout/DashboardLayout'
import Register from '@/views/Register'
import firebase from 'firebase'

Vue.use(Router)

const router = new Router({
  linkExactActiveClass: 'active',
  routes: [
    {
      path: '/login',
      redirect: 'login',
      component: AuthLayout,
      children: [
        {
          path: '/login',
          name: 'login',
          component: () => import('./views/Login.vue')
        }
      ]
    },
    {
      path: '/',
      redirect: 'inventario',
      component: DashboardLayout,
      meta: {
        requiresAuth: true
      },
      children: [
        // {
        //   path: '/dashboard',
        //   name: 'dashboard',
        //   // route level code-splitting
        //   // this generates a separate chunk (about.[hash].js) for this route
        //   // which is lazy-loaded when the route is visited.
        //   component: () => import(/* webpackChunkName: "demo" */ './views/Dashboard.vue')
        // },
        {
          path: '/icons',
          name: 'icons',
          component: () => import(/* webpackChunkName: "demo" */ './views/Icons.vue')
        },
        {
          path: '/profile',
          name: 'profile',
          component: () => import(/* webpackChunkName: "demo" */ './views/UserProfile.vue')
        },
        {
          path: '/maps',
          name: 'maps',
          component: () => import(/* webpackChunkName: "demo" */ './views/Maps.vue')
        },
        {
          path: '/tables',
          name: 'tables',
          component: () => import(/* webpackChunkName: "demo" */ './views/Tables.vue')
        },
        {
          path: '/register',
          name: 'register',
          component: () => import(/* webpackChunkName: "demo" */ './views/Register.vue')
        },
        {
          path: '/perguntas',
          name: 'perguntas',
          component: () => import(/* webpackChunkName: "demo" */ './views/Perguntas.vue')
        },
        {
          path: '/respostas',
          name: 'respostas',
          component: () => import(/* webpackChunkName: "demo" */ './views/Relatorio.vue')
        },
        {
          path: '/inventario',
          name: 'inventario',
          component: () => import(/* webpackChunkName: "demo" */ './views/Inventario.vue')
        }
      ]
    },
  ]
});

router.beforeEach((to, from, next) => {
  const currentUser = firebase.auth().currentUser;
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)

  if(requiresAuth && !currentUser) next('login');
  else if (!requiresAuth && currentUser) next('dashboard');
  else next();
});

export default router;
