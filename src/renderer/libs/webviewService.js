'use strict'

/**
 * #### ATTENTION:
 *   These 'static/minified_*' files is generate from
 *   'src/static' by '.electron-vue/staticMinify.js'
 *   and has no hot-reload capabilities.
 *
 *   use 'node .electron-vue/staticMinify.js --dev'
 *   to apply change manually when develop.
 *
 * ------------------------------------
 * #### Event order between webview and host
 *
 * |  Time | Instance |       Event      |
 * |-------|----------|------------------|
 * |     0 |  webview | DOMContentLoaded |
 * |    ~8 |  host    | dom-ready        |
 * | 1000+ |  webview | load             |
 * |    ~1 |  host    | did-finish-load  |
 * |    ~1 |  host    | did-stop-loading |
 */

let webview

/**
 * Process received message from webview
 * @param {string} channel - Message type
 * @param {object} msg     - Message body
 */
function channelAction (channel, msg) {
  if (channel === 'insertCSS') { webview.insertCSS('::-webkit-scrollbar{display:none}body{cursor:default}[class*=btn-]{cursor:pointer}') }
  if (channel === 'submenu') {
    window.commit('VIEW_UPDATE', {
      subOpen: msg
    })
  }
}

export default () => {
  webview = document.querySelector('webview')
  window.webview = webview

  if (process.env.NODE_ENV === 'development') {
    webview.addEventListener('dom-ready', () => {
      console.log('WEBVIEW READY!')
      webview.getWebContents().openDevTools({mode: 'detach'})
    })
  }

  webview.addEventListener('dom-ready', () => {
    webview.send('AlertRecovery')
  })

  /*
  // Remove placeholder of overlay when page loaded
  webview.addEventListener('did-finish-load', () => {
    window.commit('CLEAN_ELEMENTS')
  })
  */

  // IPC message from webview
  webview.addEventListener('ipc-message', (event) => {
    channelAction(event.channel, event.args[0])
  })
}
