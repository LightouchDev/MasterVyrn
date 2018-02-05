import Vue from 'vue'
import VueI18n from 'vue-i18n'

import translations from './translations'

Vue.use(VueI18n)

export default new VueI18n({
  locale: global.jsonStorage.language, // set locale
  fallbackLocale: 'en_US',
  messages: translations // set locale messages
})
