'use strict'

import fs from 'fs'
import path from 'path'

/**
 * Inject webview by javascript execution
 */

function eventInject () {
  execGetResizer.apply(this)
}

function autoResizerEnabler (style) {
  delete global.triggerFull
  let js = fs.readFileSync(path.join(__static, 'minified_execGetZoom.js'), 'utf8')
  window.webview.getWebContents().executeJavaScript(js)
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

function noPx (value) {
  return parseInt(value.replace(/px$/, ''))
}

function execGetResizer () {
  return new Promise((resolve, reject) => {
    let js = fs.readFileSync(path.join(__static, 'minified_execGetResizer.js'), 'utf8')
    this.webview.addEventListener('did-finish-load', () => {
      this.webview.getWebContents().executeJavaScript(js)
        .then(result => {
          if (global.triggerFull) autoResizerEnabler(result[3].style)
          for (let msg of result) {
            window.vue.$store.commit('CREATE_NODE', msg)
          }
        })
    })
    resolve()
  })
}

/**
 * #### ATTENTION:
 *   These 'static/minified_*' files is generate from
 *   'src/static' by '.electron-vue/staticMinify.js'
 *   and has no hot-reload capabilities.
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

export default eventInject
