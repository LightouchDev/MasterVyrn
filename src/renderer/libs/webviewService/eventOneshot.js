'use strict'

import fs from 'fs'
import path from 'path'

/**
 * # ATTENTION:
 *     These 'static/uglified_*' files is generate from 'src/static'
 *     by '.electron-vue/staticMinify.js' and has no hot-reload capabilities.
 *
 * ------------------------------------
 * # Event order between webview and host
 *
 *    Time | Instance | Event
 *       0   webview    DOMContentLoaded
 *      ~8   host       dom-ready
 *   1000+   webview    load
 *      ~1   host       did-finish-load
 *      ~1   host       did-stop=loading
 */

/**
 * Hook webview events native-likely (prevent been detected in webview)
 */
function eventOneshot () {
  getZoom.apply(this)
  getResizer.apply(this)
  cleanOverlay.apply(this)
}

/**
 * get window.deviceRatio from webview
 */
function getZoom () {
  this.webview.addEventListener('dom-ready', () => {
    let execGetZoom = fs.readFileSync(path.join(__static, 'uglified_execGetZoom.js'), 'utf8')
    this.webview.getWebContents().executeJavaScript(execGetZoom)
      .then(result => {
        window.vue.$store.commit('SET_ZOOM', result)
      })
  })
}

/**
 * Clean placeholder of overlay when page loaded
 */
function cleanOverlay () {
  this.webview.addEventListener('did-finish-load', () => {
    window.vue.$store.commit('CLEAN_ELEMENTS')
  })
}

/**
 * Get resize button element and sent to Overlay
 */
function getResizer () {
  let execGetResizer = fs.readFileSync(path.join(__static, 'uglified_execGetResizer.js'), 'utf8')
  this.webview.addEventListener('did-finish-load', () => {
    this.webview.getWebContents().executeJavaScript(execGetResizer)
      .then(result => {
        for (let msg of result) {
          window.vue.$store.commit('CREATE_NODE', msg)
        }
      })
  })
}

export default eventOneshot
