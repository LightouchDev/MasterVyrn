import Vue from 'vue'
import VueI18n from 'vue-i18n'

import translations from './translations'

Vue.use(VueI18n)

const i18n = new VueI18n({
  locale: global.state.Config.language, // set locale
  fallbackLocale: 'en_US',
  messages: translations // set locale messages
})

global.i18n = i18n

export default i18n
