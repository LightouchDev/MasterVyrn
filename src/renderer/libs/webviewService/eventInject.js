'use strict'

import fs from 'fs'
import path from 'path'

/**
 * Inject webview by javascript execution
 */

function eventInject () {
  Promise.all([cssOverride.apply(this), execGetZoom.apply(this), execGetResizer.apply(this)])
    .then(() => {
      console.log('[INFO] Event injected!')
    })
}

// Inject CSS overrides
function cssOverride () {
  return new Promise((resolve, reject) => {
    let css = fs.readFileSync(path.join(__static, 'minified_webviewOverride.css'), 'utf8')
    this.webview.addEventListener('dom-ready', () => {
      this.webview.insertCSS(css)
    })
    resolve()
  })
}

function execGetZoom () {
  return new Promise((resolve, reject) => {
    let js = fs.readFileSync(path.join(__static, 'minified_execGetZoom.js'), 'utf8')
    this.webview.addEventListener('dom-ready', () => {
      this.webview.getWebContents().executeJavaScript(js)
        .then(result => {
          window.vue.$store.commit('SET_ZOOM', result)
        })
    })
    resolve()
  })
}

function execGetResizer () {
  return new Promise((resolve, reject) => {
    let js = fs.readFileSync(path.join(__static, 'minified_execGetResizer.js'), 'utf8')
    this.webview.addEventListener('did-finish-load', () => {
      this.webview.getWebContents().executeJavaScript(js)
        .then(result => {
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
