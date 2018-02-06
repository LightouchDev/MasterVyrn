import Vue from 'vue'

import App from './App'
import router from './router'
import store from './store'
import i18n from '../common/i18n'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.config.productionTip = false

window.vue = new Vue({
  components: { App },
  i18n,
  router,
  store,
  template: '<App/>'
}).$mount('#app')
