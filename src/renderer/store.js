import Vue from 'vue'
import Vuex from 'vuex'
import debug from 'debug'
import { ipcRenderer } from 'electron'
import { log, err } from '../common/utils'

import modules from '../common/store/modules'

const vux = debug('MasterVyrn:vux')

Vue.use(Vuex)

const store = new Vuex.Store({
  modules,
  strict: process.env.NODE_ENV !== 'production'
})

// import master state
try {
  store.replaceState(ipcRenderer.sendSync('vuex-connect'))
  log('master state imported!')
} catch (error) {
  err('import master state failed: %s', error)
}

const _commit = store.commit

store.commit = function (...args) {
  vux('commit: %s\npayload: %O', ...args)
  ipcRenderer.send('vuex-mutation', args)
}

ipcRenderer.on('vuex-apply-mutation', (event, {type, payload}) => {
  vux('mutation recv: %s', type)
  _commit(type, payload)
})

// export to global
window.commit = store.commit
window.state = store.state

export default store
