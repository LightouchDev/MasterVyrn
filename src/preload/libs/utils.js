'use strict'

import { ipcRenderer, remote } from 'electron'
import { oneshotListener } from '../../common/utils'

// send log to host console
function log (content) {
  ipcRenderer.sendToHost('hostLog', content)
}

function init () {
  log(`page start! ${window.performance.now().toFixed(2)}`)

  // prevent alert popup when resize cause frequency reload
  const _alert = window.alert
  window.alert = () => {}

  /*
  * Close child window, send URL to host when login success via non-mobage account
  */
  if (remote.getCurrentWebContents().getType() !== 'webview') {
    ipcRenderer.send('webviewRefresh', window.location.href)
    window.close()
  }

  oneshotListener(window, 'load', () => {
    log('DOM ready')
    // restore alert
    window.alert = _alert
  })

  oneshotListener(window, 'DOMContentLoaded', () => {
    log('DOM parsed')
  })
}

function commit (mutation, payload) {
  ipcRenderer.sendToHost('commit', { mutation, payload })
}

export { init, commit, log }
export const sendToHost = ipcRenderer.sendToHost
