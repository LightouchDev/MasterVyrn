'use strict'

import { remote } from 'electron'
import debug from 'debug'
import { DEV, oneshotListener, log } from '../../common/utils'

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
const hostLog = debug('mastervyrn:webview')

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
    hostLog(msg)
  }
  if (channel === 'injectReady') {
    webview.insertCSS('::-webkit-scrollbar{display:none}body{cursor:default}[class*=btn-]{cursor:pointer}')
  }
}

export default () => {
  webview = document.querySelector('webview')
  window.webview = webview
  webview.session = remote.session.fromPartition(webview.partition)

  webview.session.setProxy({proxyRules: global.Configs.proxy}, () => {})

  oneshotListener(webview, 'dom-ready', () => {
    log('WEBVIEW READY!')
    const currentWebContents = webview.getWebContents()

    DEV && currentWebContents.openDevTools({mode: 'detach'})

    // Set context-menu, require here instead of import to prevent vue wasn't initialized.
    const contextMenuListener = require('./contextMenu').default(currentWebContents)
    currentWebContents.on('context-menu', contextMenuListener)

    /* eslint-disable standard/no-callback-literal */
    // Open submenu when purchase page show up.
    webview.session.webRequest.onBeforeRequest({
      urls: [(window.state.GameWeb.gameURL + '*/purchase_jssdk*')]
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
}
