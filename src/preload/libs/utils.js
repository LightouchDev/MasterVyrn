'use strict'

import { ipcRenderer } from 'electron'

// send log to host console
function log (...content) {
  ipcRenderer.sendToHost('hostLog', content)
}

function commit (...args) {
  ipcRenderer.send('vuex-mutation', args)
}

export { commit, log }
export const sendToHost = ipcRenderer.sendToHost
