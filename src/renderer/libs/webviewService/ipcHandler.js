'use strict'

import {ipcRenderer} from 'electron'

function ipcHandler () {
  this.webview.addEventListener('ipc-message', (event) => {
    channelAction(event.channel, event.args[0])
  })
  ipcRenderer.on('webviewClick', (event, args) => {
    this.webview.sendInputEvent(args)
  })
  ipcRenderer.on('webviewDevTools', () => {
    this.webview.openDevTools()
  })
}

/**
 * Process received message from webview
 * @param {string} channel - Message type
 * @param {object} args    - Message body
 */

function channelAction (channel, msg) {
  if (channel === 'hostLog') {
    console.log(msg)
  }
}

export default ipcHandler
