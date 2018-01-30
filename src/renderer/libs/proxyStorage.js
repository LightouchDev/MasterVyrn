'use strict'

import { remote } from 'electron'
import enhanceStorage from '../../common/enhanceStorage'

const defaults = {
  alwaysOnTop: false,
  proxy: 'direct://',
  language: navigator.languages[0] || navigator.language,
  subHide: false,
  raids: [],
  webviewConfig: {}
}

const actions = {
  alwaysOnTop (args) {
    remote.getCurrentWindow().setAlwaysOnTop(args)
  },
  proxy (args) {
    if (window.webview && window.webview.session) {
      window.webview.session.setProxy({proxyRules: args}, () => {})
    }
  },
  language (args) {
    if (window.vue && window.vue.$i18n) {
      window.vue.$i18n.locale = args
    }
  }
}

const proxyStorage = enhanceStorage(window.localStorage, actions)
const { clear } = proxyStorage
proxyStorage.clear = () => {
  clear()
  Object.assign(proxyStorage, defaults)
}

// filter defaults
Object.assign(proxyStorage,
  Object.assign(
    Object.assign({}, defaults),
    Object.assign({}, proxyStorage)
  )
)

window.proxyStorage = proxyStorage
