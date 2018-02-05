import Vue from 'vue'
import Vuex from 'vuex'
import { ipcRenderer } from 'electron'
import { log } from '../common/utils'

import modules from '../common/modules'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: ipcRenderer.sendSync('vuex-connect'),
  modules,
  strict: process.env.NODE_ENV !== 'production'
})

const _commit = store.commit

store.commit = function (type, payload) {
  // Stolen from vuejs/vuex
  if (typeof type === 'object' && type.type && arguments.length === 1) {
    payload = type.payload
    type = type.type
  }

  log('committing: %s\npayload: %O', type, payload)
  ipcRenderer.send('vuex-mutation', { type, payload })
}

ipcRenderer.on('vuex-apply-mutation', (event, {type, payload}) => {
  log('vuex-apply-mutation: %s', type)
  _commit(type, payload)
})

export default store
