'use strict'

/**
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
  if (channel === 'commit') {
    window.commit(msg.mutation, msg.payload)
  }
  if (channel === 'log') {
    console[msg.type](msg.content)
  }
  if (channel === 'injectReady') {
    webview.insertCSS('::-webkit-scrollbar{display:none}body{cursor:default}[class*=btn-]{cursor:pointer}')
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

  /* eslint-disable standard/no-callback-literal */
  require('electron').remote.session.fromPartition(window.state.GameWeb.partition)
    .webRequest.onBeforeRequest({
      urls: [(window.state.GameWeb.gameURL + '*/purchase_jssdk*')]
    }, (details, callback) => {
      webview.executeJavaScript('Game.submenu.mainView.switchCurrent(Game.submenu.mainView.state.current)')
      callback({cancel: false})
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
