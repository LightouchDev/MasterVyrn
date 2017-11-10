'use strict'

import {ipcRenderer} from 'electron'

function WindowManager () {
  this.zoom = 1.5
  this.submenuOpened = false
  this.setDefault()
  this.padding = 64
  this.subButtonWidth = 33
  this.applyWidth()
  this.zoomHandler()
  this.sessionHandler()
  this.submenuHandler()
  this.resizeTrigger()
  this.navigationCleanUp()
}

WindowManager.prototype.setDefault = function () {
  this.login = true
  this.padding = 0
  this.baseSize = 660
  this.subButtonWidth = 0
  this.initialized = false
  this.resizeContinue = true
}

WindowManager.prototype.setWebWidth = function (width) {
  window.webview.style.width = `${width}px`
  document.querySelector('#overlay').style.width = `${width}px`
  if (this.padding) {
    window.webview.style.marginLeft = `-${this.padding}px`
    document.querySelector('#overlay').style.marginLeft = `-${this.padding}px`
  } else {
    window.webview.style.marginLeft = 0
    document.querySelector('#overlay').style.width = 0
  }
}

WindowManager.prototype.setWindowWidth = function (width) {
  let max = this.submenuOpened
    ? 2 * this.baseSize
    : this.subButtonWidth + 2 * 320
  let min = this.submenuOpened
    ? this.baseSize
    : this.subButtonWidth + 320

  ipcRenderer.send('resizeWindow', {
    min: min,
    max: max,
    width: parseInt(width),
    subButtonWidth: this.subButtonWidth
  })
}

let preWebWidth = 0
let preWindowWidth = 0
let delayApply = null

WindowManager.prototype.applyWidth = function () {
  clearTimeout(delayApply)
  delayApply = setTimeout(() => {
    let webWidth = this.baseSize * this.zoom + this.subButtonWidth
    webWidth += this.login ? this.padding : 0
    if (preWebWidth !== webWidth) {
      this.setWebWidth(webWidth)
      preWebWidth = webWidth
    }

    let windowWidth = this.submenuOpened
      ? this.baseSize * this.zoom
      : 320 * this.zoom + this.subButtonWidth
    if (preWindowWidth !== windowWidth) {
      this.setWindowWidth(windowWidth)
      preWindowWidth = windowWidth
    }
  }, 80)
}

WindowManager.prototype.calcZoom = function () {
  if (this.login) {
    this.zoom = this.submenuOpened
      ? window.innerWidth / this.baseSize
      : (window.innerWidth - this.subButtonWidth) / 320
  } else {
    this.zoom = window.innerWidth / 320
  }

  if (this.zoom > 2) {
    this.zoom = 2
  } else if (this.zoom < 1) {
    this.zoom = 1
  }
  this.applyWidth()
  window.vue.$store.commit('SET_ZOOM', this.zoom)
}

WindowManager.prototype.zoomHandler = function () {
  global.setZoom = zoom => {
    this.zoom = zoom
    this.applyWidth()
  }
}

WindowManager.prototype.sessionHandler = function () {
  global.sessionHandler = obj => {
    if (obj.notLogin) {
      this.login = false
      this.submenuOpened = false
      this.baseSize = obj.baseSize
    }
    if (obj.noAutoResize) {
      // automatic process is in webviewService/eventInject.js
      global.triggerFull = true
    }
    if (obj.padding) {
      this.padding = obj.padding
      this.baseSize = obj.baseSize
      this.subButtonWidth = obj.subButtonWidth
    }
    this.applyWidth()
  }
}

WindowManager.prototype.submenuHandler = function () {
  global.submenuHandler = newSubmenuOpened => {
    if (this.submenuOpened !== newSubmenuOpened) {
      this.submenuOpened = newSubmenuOpened
      this.resizeContinue = false
      if (!this.login) { this.submenuOpened = false }
      this.applyWidth()
    }
  }
}

let delayResize = null
WindowManager.prototype.resizeTrigger = function () {
  window.onresize = () => {
    clearTimeout(delayResize)
    delayResize = setTimeout(() => {
      if (this.resizeContinue) {
        this.calcZoom()
      }
      this.resizeContinue = true
    }, 80)
  }
}

WindowManager.prototype.navigationCleanUp = function () {
  window.addEventListener('load', () => {
    window.webview.addEventListener('did-navigate', () => {
      this.setDefault()
    })
  })
}

export default () => {
  return new WindowManager()
}
