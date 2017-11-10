'use strict'

import {ipcRenderer} from 'electron'

function ipcHandler () {
  this.webview.addEventListener('ipc-message', (event) => {
    channelAction.call(this, event.channel, event.args[0])
  })
  ipcRenderer.on('webviewDevTools', () => {
    this.webview.openDevTools()
  })
}

/**
 * Process received message from webview
 * @param {string} channel - Message type
 * @param {object} msg    - Message body
 */
function channelAction (channel, msg) {
  if (channel === 'insertCSS') { this.webview.insertCSS('::-webkit-scrollbar{display:none}') }
  if (channel === 'submenu') { global.submenuHandler(msg) }
  if (channel === 'sessionInfo') { global.sessionHandler(msg) }
  // if (channel === 'hostLog') { console.log(msg) }
}

export default ipcHandler
