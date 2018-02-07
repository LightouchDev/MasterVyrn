// steal from https://github.com/vuejs/vuex/issues/92#issuecomment-212012430
import Vue from 'vue'
import Vuex from 'vuex'
import { BrowserWindow, ipcMain } from 'electron'
import { log } from '../../common/utils'

import modules from '../../common/store/modules'

Vue.use(Vuex)

const clients = []

const store = new Vuex.Store({
  modules,
  strict: process.env.NODE_ENV !== 'production'
})

store.subscribe((mutation, state) => {
  clients.forEach(client => {
    client.send('vuex-apply-mutation', mutation)
  })
})

ipcMain.on('vuex-connect', (event) => {
  let winId = BrowserWindow.fromWebContents(event.sender).id
  log('vuex-connect: %s', winId)

  clients[winId] = event.sender
  event.returnValue = store.state
})

ipcMain.on('vuex-mutation', (event, {type, payload}) => {
  log('vuex-mutation: %s\npayload: %o', type, payload)
  store.commit(type, payload)
})

global.state = store.state
global.commit = store.commit
