'use strict'

import {ipcRenderer} from 'electron'

function ipcHandler () {
  this.webview.addEventListener('ipc-message', (event) => {
    channelAction(event.channel, event.args[0])
  })
  ipcRenderer.on('webviewClick', (event, args) => {
    this.webview.sendInputEvent(args)
  })
}

/**
 * About message channel and args
 *
 *   type: createNode
 *   body: {
 *           id:      (String), - the id of the node.
 *           data:    (Object), - it should work with preset.
 *           preset:  (String), - the preset process thay want to apply.
 *           style: {           - CSS rules.
 *             top: (number),
 *             ... etc
 *           },
 *           js: {callback}        - not implemented
 *         }
 */

/**
 * Process recieved message
 * @param {string} channel - Message type
 * @param {object} args    - Message body
 */

function channelAction (channel, msg) {
  if (channel === 'createNode') {
    window.vue.$store.commit('CREATE_NODE', msg)
  } else if (channel === 'hostLog') {
    console.log(msg)
  }
}

export default ipcHandler
