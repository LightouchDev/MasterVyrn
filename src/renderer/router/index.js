import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    /* FIXME
    {
      path: '/land',
      name: 'landing-page',
      component: require('@/components/LandingPage').default
    },
    */
    {
      path: '/',
      name: 'index',
      component: require('@/components/Index').default
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
