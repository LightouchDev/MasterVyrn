'use strict'

import { ipcRenderer, remote } from 'electron'
import { oneshotListener } from '../../common/utils'

let startTime, console, DEBUG

function init () {
  /*
  * Get webviewId, and close child window, reload host when login success via DMM account
  */
  if (remote.getCurrentWebContents().getType() !== 'webview') {
    ipcRenderer.send('webviewRefresh', window.location.href)
    window.close()
  }

  // prevent alert popup when resize cause frequency reload
  const _alert = window.alert
  window.alert = () => {}
  oneshotListener(window, 'load', () => {
    DEBUG && log('DOM ready')
    // restore alert
    window.alert = _alert
  })

  /*
  * DEBUG info
  */
  DEBUG = process.env.NODE_ENV === 'development'
  if (DEBUG) {
    console = {
      log: window.console.log,
      warn: window.console.warn,
      error: window.console.error
    }
    startTime = window.performance.now()
    console.log(startTime, 'page start!')

    DEBUG && oneshotListener(window, 'DOMContentLoaded', () => {
      log('DOM parsed')
      // recover console function
      Object.assign(window.console, console)
    })
  }
}

function log (msg, type = 'log') {
  DEBUG && console[type]((window.performance.now() - startTime).toFixed(2), msg)
}
function commit (mutation, payload) {
  ipcRenderer.sendToHost('commit', { mutation, payload })
}

// send log to host console
function hostLog (content, type = 'log') {
  ipcRenderer.sendToHost('log', { content, type })
}

export { DEBUG }
export { init, commit, log, hostLog }
export const sendToHost = ipcRenderer.sendToHost
