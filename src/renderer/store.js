import Vue from 'vue'
import Vuex from 'vuex'
import debug from 'debug'
import { ipcRenderer } from 'electron'

import modules from '../common/modules'

const vux = debug('MasterVyrn:vux')

Vue.use(Vuex)

// import master state
const remoteState = ipcRenderer.sendSync('vuex-connect')
Object.keys(modules).forEach(store => {
  Object.assign(modules[store].state, remoteState[store])
})

const store = new Vuex.Store({
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

  vux('commit: %s\npayload: %O', type, payload)
  ipcRenderer.send('vuex-mutation', { type, payload })
}

ipcRenderer.on('vuex-apply-mutation', (event, {type, payload}) => {
  vux('mutation recv: %s', type)
  _commit(type, payload)
})

// export to global
window.commit = store.commit
window.state = store.state

export default store
