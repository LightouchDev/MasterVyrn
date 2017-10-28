'use strict'

import EventNav from './EventNavigation'

let WebviewInit = function () {}

WebviewInit = function () {
  this.webview = document.querySelector('webview')
  this.Init()
  this.EventNav()
}

WebviewInit.prototype.Init = function () {
  if (process.env.NODE_ENV === 'development') {
    this.webview.addEventListener('dom-ready', () => {
      console.log('WEBVIEW READY!')
      this.webview.openDevTools()
    })
  }
}

WebviewInit.prototype.EventNav = EventNav

export default () => {
  // waiting window loaded to prevent getting the empty element.
  window.addEventListener('DOMContentLoaded', () => {
    // actually, we just need to trigger constructor,
    // and return is for avoid standardjs warning.
    return new WebviewInit()
  })
}
