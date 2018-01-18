'use strict'

import { ipcRenderer, remote } from 'electron'
import { oneshotListener, log } from '../../common/utils'

function init () {
  log('%s page start!', window.performance.now())

  // prevent alert popup when resize cause frequency reload
  const _alert = window.alert
  window.alert = () => {}

  /*
  * Get webviewId, and close child window, reload host when login success via DMM account
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

// send log to host console
function hostLog (content) {
  ipcRenderer.sendToHost(content)
}

export { init, commit, log, hostLog }
export const sendToHost = ipcRenderer.sendToHost
