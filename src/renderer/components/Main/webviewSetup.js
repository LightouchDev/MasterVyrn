'use strict'

import debug from 'debug'
import { oneshotListener } from '../../../common/utils'

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

/**
 * Process received message from webview
 * @param {string} channel - Message type
 * @param {object} msg     - Message body
 */
function channelAction (channel, msg) {
  if (channel === 'hostLog') {
    hostLog(...msg)
  }
  if (channel === 'injectReady') {
    webview.insertCSS('::-webkit-scrollbar{display:none}body{cursor:default}[class*=btn-]{cursor:pointer}')
  }
}

const hostLog = debug('MasterVyrn:web')

const webview = document.querySelector('webview')
window.webview = webview

oneshotListener(webview, 'dom-ready', () => {
  const currentWebContents = webview.getWebContents()

  /* eslint-disable standard/no-callback-literal */
  // Open submenu when purchase page show up.
  currentWebContents.session.webRequest.onBeforeRequest({
    urls: [(window.state.Constants.site + '/*/purchase_jssdk*')]
  }, (details, callback) => {
    if (!window.state.GameView.subOpen) {
      webview.executeJavaScript('Game.submenu.mainView.switchCurrent(Game.submenu.mainView.state.current)')
    }
    callback({cancel: false})
  })
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
