'use strict'

import eventNav from './eventNavigation'
import eventResize from './eventResize'
import eventOneshot from './eventOneshot'
import ipcHandler from './ipcHandler'

let WebviewInit = function () {
  this.webview = document.querySelector('webview')
  this.init()
  this.eventOneshot()
  this.eventResize()
  this.eventNav()
  this.ipcHandler()
}

WebviewInit.prototype.init = function () {
  this.webview.addEventListener('did-navigate', () => {
    window.vue.$store.commit('CLEAN_ELEMENTS')
  })
  if (process.env.NODE_ENV === 'development') {
    this.webview.addEventListener('dom-ready', () => {
      console.log('WEBVIEW READY!')
      this.webview.openDevTools()
    })
  }
}

WebviewInit.prototype.eventOneshot = eventOneshot
WebviewInit.prototype.eventNav = eventNav
WebviewInit.prototype.eventResize = eventResize
WebviewInit.prototype.ipcHandler = ipcHandler

export default () => {
  // waiting window loaded to prevent getting the empty element.
  window.addEventListener('DOMContentLoaded', () => {
    // actually, we just need to trigger constructor,
    // and this return is for avoiding standardjs warning.
    return new WebviewInit()
  })
}
