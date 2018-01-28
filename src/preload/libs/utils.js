'use strict'

import { ipcRenderer } from 'electron'

// send log to host console
function log (...content) {
  ipcRenderer.sendToHost('hostLog', content)
}

function commit (mutation, payload) {
  ipcRenderer.sendToHost('commit', { mutation, payload })
}

export { commit, log }
export const sendToHost = ipcRenderer.sendToHost
