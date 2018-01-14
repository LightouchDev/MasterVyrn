'use strict'

import { ipcRenderer } from 'electron'
import { oneshotListener } from '../../common/utils'

let startTime, console, DEBUG

function init () {
  DEBUG = process.env.NODE_ENV === 'development'
  if (DEBUG) {
    console = {
      log: window.console.log,
      warn: window.console.warn,
      error: window.console.error
    }
    startTime = window.performance.now()
    console.log(startTime, 'page start!')

    // prevent alert popup when resize cause frequency reload
    const _alert = window.alert
    window.alert = () => {}

    DEBUG && oneshotListener(window, 'DOMContentLoaded', () => {
      log('DOM parsed')
      // recover console function
      Object.assign(window.console, console)
    })

    oneshotListener(window, 'load', () => {
      DEBUG && log('DOM ready')
      // restore alert
      window.alert = _alert
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
