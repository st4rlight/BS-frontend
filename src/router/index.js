import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import LogReg from '@/components/LogReg'
import Login from '@/components/Login'
import Reg from '@/components/Reg'
import Plan from '@/components/Plan'
import Recite from '@/components/Recite'
import Review from '@/components/Review'
import Exam from '@/components/Exam'
import Personal from '@/components/Personal'
import Favorite from '@/components/Favorite'
import Help from '@/components/Help'
import Empty from '@/components/Empty'

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
      component: Home
    },
    {
      path: '/plan',
      name: 'plan',
      component: Plan
    },
    {
      path: '/recite',
      name: 'recite',
      component: Recite
    },
    {
      path: '/review',
      name: 'review',
      component: Review
    },
    {
      path: '/exam',
      name: 'exam',
      component: Exam
    },
    {
      path: '/personal',
      name: 'personal',
      component: Personal
    },
    {
      path: '/favorite',
      name: 'favorite',
      component: Favorite
    },
    {
      path: '/help',
      name: 'help',
      component: Help
    },
    {
      path: '/empty',
      name: 'empty',
      component: Empty
    },
    {
      path: '/log_reg',
      name: 'log_reg',
      component: LogReg,
      children: [
        {
          path: 'login',
          name: 'login',
          component: Login
        },
        {
          path: 'reg',
          name: 'reg',
          component: Reg
        },

      ]

    }
  ]
})
