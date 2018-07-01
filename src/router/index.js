import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/home',
    },
    {
      path: '/home',
      name: 'home',
      component: resolve => require(['./../components/Home'], resolve)
    },
    {
      path: '/plan',
      name: 'plan',
      component: resolve => require(['./../components/Plan'], resolve)
    },
    {
      path: '/recite',
      name: 'recite',
      component: resolve => require(['./../components/Recite'], resolve)
    },
    {
      path: '/review',
      name: 'review',
      component: resolve => require(['./../components/Review'], resolve)
    },
    {
      path: '/exam',
      name: 'exam',
      component: resolve => require(['./../components/Exam'], resolve)
    },
    {
      path: '/personal',
      name: 'personal',
      component: resolve => require(['./../components/Personal'], resolve)
    },
    {
      path: '/favorite',
      name: 'favorite',
      component: resolve => require(['./../components/Favorite'], resolve)
    },
    {
      path: '/help',
      name: 'help',
      component: resolve => require(['./../components/Help'], resolve)
    },
    {
      path: '/empty',
      name: 'empty',
      component: resolve => require(['./../components/Empty'], resolve)
    },
    {
      path: '/log_reg',
      name: 'log_reg',
      component: resolve => require(['./../components/LogReg'], resolve),
      children: [
        {
          path: 'login',
          name: 'login',
          component: resolve => require(['./../components/Login'], resolve),
        },
        {
          path: 'reg',
          name: 'reg',
          component: resolve => require(['./../components/Reg'], resolve),
        },

      ]

    }
  ]
})
