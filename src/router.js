import Vue from 'vue'
import Router from 'vue-router'
import AuthLayout from './layout/AuthLayout.vue'
import DashboardLayout from '@/layout/DashboardLayout'

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
      path: '/administracao',
      redirect: 'administracao',
      component: DashboardLayout,
      meta: {
        requiresAuth: true
      },
      children: [
        {
          path: '/administracao/organizacao',
          name: 'organizacao',
          component: () => import(/* webpackChunkName: "demo" */ './views/administracao/organizacao.vue')
        },
        {
          path: '/administracao/usuarios',
          name: 'organizacao',
          component: () => import(/* webpackChunkName: "demo" */ './views/administracao/usuarios.vue')
        },
        {
          path: '/administracao/disciplina',
          name: 'organizacao',
          component: () => import(/* webpackChunkName: "demo" */ './views/administracao/disciplina.vue')
        },
        {
          path: '/administracao/area',
          name: 'organizacao',
          component: () => import(/* webpackChunkName: "demo" */ './views/administracao/area.vue')
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
  const publicPages = ['/', '/login'];

  const authRequired = !publicPages.includes(to.path);
  let loggedIn = localStorage.getItem('token');

  if (authRequired && !loggedIn) {
    return next('/login');
  }

  next();

});

export default router;
