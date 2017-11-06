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
 * @param {object} args    - Message body
 */
function channelAction (channel, msg) {
  if (channel === 'setZoom') { window.vue.$store.commit('SET_ZOOM', msg) }
  if (channel === 'notJssdk') { window.vue.$store.commit('NOT_JSSDK', true) }
  if (channel === 'insertCSS') { this.webview.insertCSS(this.css) }
  if (channel === 'hostLog') { console.log(msg) }
}

export default ipcHandler
