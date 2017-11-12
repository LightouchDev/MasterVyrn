'use strict'

import fs from 'fs'
import path from 'path'

function noPx (value) {
  return Math.round(value.replace(/px$/, ''))
}

function readStatic (filename) {
  return fs.readFileSync(path.join(__static, filename), 'utf8')
}

class WebviewInit {
  constructor () {
    this.webview = document.querySelector('webview')
    this.init()
    this.getResizer()
    window.webview = this.webview

    // Clean up webview before page start loading
    this.webview.addEventListener('did-navigate', (event) => {
      window.vue.$store.commit('CLEAN_CLASS')
    })

    // Send URL to vue
    this.webview.addEventListener('did-navigate', (event) => {
      window.vue.$store.commit('CHANGE_URL', event.url)
    })
    this.webview.addEventListener('did-navigate-in-page', (event) => {
      window.vue.$store.commit('CHANGE_URL', event.url)
    })

    // Restore to default state before page start loading
    this.webview.addEventListener('did-navigate', () => {
      window.vue.$store.commit('DEFAULT_ELEMENTS')
    })

    // Remove placeholder of overlay when page loaded
    this.webview.addEventListener('did-finish-load', () => {
      window.vue.$store.commit('CLEAN_ELEMENTS')
    })

    // IPC message event
    this.webview.addEventListener('ipc-message', (event) => {
      this.channelAction(event.channel, event.args[0])
    })
  }

  init () {
    if (process.env.NODE_ENV === 'development') {
      this.webview.addEventListener('dom-ready', () => {
        console.log('WEBVIEW READY!')
        this.webview.getWebContents().openDevTools({mode: 'detach'})
      })
    }
  }

  /**
   * Automatically click 'Full' to get auto resize ability
   * @param {object} style - button css style
   */
  autoResizerEnabler (style) {
    delete global.triggerFull
    let js = readStatic('minified_execGetZoom.js')
    this.webview.getWebContents().executeJavaScript(js)
      .then(zoom => {
        let x = (noPx(style.left) + noPx(style.width) / 2) * zoom
        let y = (noPx(style.top) + noPx(style.height) / 2) * zoom
        setTimeout(() => {
          window.webview.sendInputEvent({ type: 'mouseDown', x: x, y: y })
          setTimeout(() => {
            window.webview.sendInputEvent({ type: 'mouseUp', x: x, y: y })
          })
        }, 500)
      })
  }

  /**
   * Get footer resizers
   */
  getResizer () {
    let js = readStatic('minified_execGetResizer.js')
    this.webview.addEventListener('did-finish-load', () => {
      this.webview.getWebContents().executeJavaScript(js)
        .then(result => {
          if (global.triggerFull) this.autoResizerEnabler(result[3].style)
          for (let msg of result) {
            window.vue.$store.commit('CREATE_NODE', msg)
          }
        })
    })
  }

  /**
   * Process received message from webview
   * @param {string} channel - Message type
   * @param {object} msg     - Message body
   */
  channelAction (channel, msg) {
    if (channel === 'insertCSS') { this.webview.insertCSS('::-webkit-scrollbar{display:none}body{cursor:default}[class*=btn-]{cursor:pointer}') }
    if (channel === 'submenu') { global.wm.submenuHandler(msg) }
    if (channel === 'sessionInfo') { global.wm.sessionHandler(msg) }
    // if (channel === 'hostLog') { console.log(msg) }
  }
}

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

export default () => {
  window.addEventListener('DOMContentLoaded', () => {
    return new WebviewInit()
  })
}
