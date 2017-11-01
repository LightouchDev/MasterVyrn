'use strict'

import ResizeObserver from 'resize-observer-polyfill'
import eventNav from './eventNavigation'
import ipcHandler from './ipcHandler'

let WebviewInit = function () {
  this.webview = document.querySelector('webview')
  this.init()
  this.eventResize()
  this.eventNav()
  this.ipcHandler()
}

WebviewInit.prototype.init = function () {
  this.webview.addEventListener('did-navigate', () => {
    window.vue.$store.commit('CLEAN_COVER')
  })
  if (process.env.NODE_ENV === 'development') {
    this.webview.addEventListener('dom-ready', () => {
      console.log('WEBVIEW READY!')
      this.webview.openDevTools()
    })
  }
}

WebviewInit.prototype.eventResize = function () {
  this.webview.addEventListener('dom-ready', () => {
    let onetimeFalse = false
    const ro = new ResizeObserver(entry => {
      if (onetimeFalse) {
        entry[0].target.reload()
      }
      onetimeFalse = true
    })
    ro.observe(this.webview)
  })
}

WebviewInit.prototype.eventNav = eventNav
WebviewInit.prototype.ipcHandler = ipcHandler

export default () => {
  // waiting window loaded to prevent getting the empty element.
  window.addEventListener('DOMContentLoaded', () => {
    // actually, we just need to trigger constructor,
    // and return is for avoid standardjs warning.
    return new WebviewInit()
  })
}
