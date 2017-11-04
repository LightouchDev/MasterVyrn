'use strict'

import eventInject from './eventInject'
import eventNav from './eventNav'
import eventOverlay from './eventOverlay'
import eventResize from './eventResize'
import ipcHandler from './ipcHandler'

let WebviewInit = function () {
  this.webview = document.querySelector('webview')
  this.init()
  this.eventInject()
  this.eventNav()
  this.eventOverlay()
  this.eventResize()
  this.ipcHandler()
  global.webview = this.webview
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
WebviewInit.prototype.eventResize = eventResize
WebviewInit.prototype.ipcHandler = ipcHandler

export default () => {
  // waiting window loaded to prevent getting the empty element.
  window.addEventListener('DOMContentLoaded', () => {
    // actually, we just need to trigger constructor,
    // and this return is for avoiding standardJS warning.
    return new WebviewInit()
  })
}
