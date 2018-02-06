import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'default-application',
      component: () => import(
        /* webpackChunkName: "DefaultApplication" */
        '@/components/DefaultApplication'
      )
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
