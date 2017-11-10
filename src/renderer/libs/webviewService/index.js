'use strict'

import eventInject from './eventInject'
import eventNav from './eventNav'
import eventOverlay from './eventOverlay'
import ipcHandler from './ipcHandler'

let WebviewInit = function () {
  this.webview = document.querySelector('webview')
  this.init()
  this.eventInject()
  this.eventNav()
  this.eventOverlay()
  this.ipcHandler()
  window.webview = this.webview
}

WebviewInit.prototype.init = function () {
  if (process.env.NODE_ENV === 'development') {
    this.webview.addEventListener('dom-ready', () => {
      console.log('WEBVIEW READY!')
      this.webview.openDevTools()
    })
  }
}

WebviewInit.prototype.eventInject = eventInject
WebviewInit.prototype.eventNav = eventNav
WebviewInit.prototype.eventOverlay = eventOverlay
WebviewInit.prototype.ipcHandler = ipcHandler

export default () => {
  window.addEventListener('DOMContentLoaded', () => {
    // avoid standardJS warning.
    return new WebviewInit()
  })
}
