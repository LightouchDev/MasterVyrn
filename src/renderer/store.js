import Vue from 'vue'
import Vuex from 'vuex'
import debug from 'debug'
import { ipcRenderer } from 'electron'
import { log, err } from '../common/utils'

import modules from '../store/modules'

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

const { commit } = store

store.commit = (...args) => {
  const [ type, payload ] = args
  vux('commit: %o\npayload: %O', type, payload)
  ipcRenderer.send('vuex-mutation', args)
}

store.dispatch = (...args) => {
  const [ content, payload ] = args
  // nextTick hack to simulate dispatch behavior
  Vue.nextTick(() => {
    vux('dispatch: %o\npayload: %O', content, payload)
    ipcRenderer.send('vuex-action', args)
  })
}

ipcRenderer.on('vuex-apply-mutation', (event, {type, payload}) => {
  vux('mutation recv: %s', type)
  commit(type, payload)
})

ipcRenderer.on('vuex-error', (event, error) => console.error(error))

// export to global
window.commit = store.commit
window.state = store.state

export default store
