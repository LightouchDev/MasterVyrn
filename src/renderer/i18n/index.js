import Vue from 'vue'
import VueI18n from 'vue-i18n'

import translations from './translations'

Vue.use(VueI18n)

export default new VueI18n({
  locale: window.proxyStorage.language, // set locale
  fallbackLocale: 'en-US',
  messages: translations // set locale messages
})
