/**
 * Hook webview events native-likely (prevent been detected in webview)
 */
'use strict'

import fs from 'fs'
import path from 'path'

function eventOneshot () {
  // inject stylesheet to webview
  let cssContent = fs.readFileSync(path.join(__static, 'override.css'), 'utf8')
  this.webview.addEventListener('dom-ready', () => {
    this.webview.insertCSS(cssContent)
  })

  // get window.deviceRatio from webview
  this.webview.addEventListener('dom-ready', () => {
    this.webview.getWebContents().executeJavaScript(`
    (() => {
      return new Promise (resolve => {
        resolve(window.deviceRatio)
      }).then(result => {
        return result
      })
    })()
    `).then(result => {
      window.vue.$store.commit('SET_ZOOM', result)
    })
  })

  // get resize button element and sent to Overlay
  let execResizerExporter = fs.readFileSync(path.join(__static, 'execResizerExporter.js'), 'utf8')
  this.webview.addEventListener('did-finish-load', () => {
    this.webview.getWebContents().executeJavaScript(execResizerExporter)
      .then(result => {
        for (let msg of result) {
          window.vue.$store.commit('CREATE_NODE', msg)
        }
      })
  })
}

/**
 * Event order between webview and host
 *
 *      0 webview DOMContentLoaded
 *     ~8 host    dom-ready
 *  1000+ webview load
 *     ~1 host    did-finish-load
 *     ~1 host    did-stop=loading
 */

export default eventOneshot
