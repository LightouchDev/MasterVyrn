'use strict'

import { ipcRenderer } from 'electron'

// send log to host console
function log (...content) {
  ipcRenderer.sendToHost('hostLog', content)
}

function commit (type, payload) {
  ipcRenderer.send('vuex-mutation', { type, payload })
}

export { commit, log }
export const sendToHost = ipcRenderer.sendToHost
