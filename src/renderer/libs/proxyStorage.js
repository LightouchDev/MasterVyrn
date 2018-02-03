'use strict'

import { remote, ipcRenderer } from 'electron'
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
    remote.session.defaultSession.setProxy({proxyRules: args, proxyBypassRules: '<local>'}, () => {})
  },
  language (args) {
    if (window.vue && window.vue.$i18n) {
      window.vue.$i18n.locale = args
    }
  },
  subHide (args) {
    // send ipc message directly to prevent the store of current window is not initialized.
    ipcRenderer.send('vuex-mutation', {
      type: 'VIEW_UPDATE',
      payload: {
        subHide: args
      }
    })
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
