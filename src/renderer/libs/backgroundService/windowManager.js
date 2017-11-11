'use strict'

import {ipcRenderer} from 'electron'

class WindowManager {
  constructor () {
    this.zoom = 1.5
    this.submenuOpened = false
    this.setDefault()
    this.applyWidth()
    this.globalMethod()

    // recalculate zoom after window resize
    let delayResize = null
    window.onresize = () => {
      clearTimeout(delayResize)
      delayResize = setTimeout(() => {
        if (this.resizeContinue) {
          this.calcZoom()
        }
        this.resizeContinue = true
      }, 80)
    }

    // set to default before page loading
    window.addEventListener('load', () => {
      window.webview.addEventListener('did-navigate', () => {
        this.setDefault()
      })
    })
  }

  setDefault () {
    this.login = true
    this.padding = 64
    this.baseSize = 660
    this.subButtonWidth = 33
    this.initialized = false
    this.resizeContinue = true
  }

  setWebWidth (width) {
    let webview = window.webview.style
    let overlay = document.querySelector('#overlay').style

    webview.width = `${width}px`
    overlay.width = `${width}px`
    if (this.padding) {
      webview.marginLeft = `-${this.padding}px`
      overlay.marginLeft = `-${this.padding}px`
    } else {
      webview.marginLeft = 0
      overlay.marginLeft = 0
    }
  }

  setWindowWidth (width) {
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

  applyWidth () {
    let delayApply = null
    let preWebWidth = 0
    let preWindowWidth = 0

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

  calcZoom () {
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

  globalMethod () {
    let wm = {}
    wm.setZoom = zoom => {
      this.zoom = zoom
      this.applyWidth()
    }

    wm.sessionHandler = obj => {
      if (obj.notLogin) {
        this.login = false
        this.submenuOpened = false
        this.baseSize = obj.baseSize
        this.padding = 0
        this.subButtonWidth = 0
      }
      if (obj.noAutoResize) {
        // automatic process is in webviewService/eventInject.js
        global.triggerFull = true
        return
      }
      if (obj.padding) {
        this.padding = obj.padding
        this.baseSize = obj.baseSize
        this.subButtonWidth = obj.subButtonWidth
      }
      this.applyWidth()
    }

    wm.submenuHandler = newSubmenuOpened => {
      if (this.submenuOpened !== newSubmenuOpened) {
        this.submenuOpened = newSubmenuOpened
        this.resizeContinue = false
        if (!this.login) { this.submenuOpened = false }
        this.applyWidth()
      }
    }
    global.wm = wm
  }
}

export default () => {
  return new WindowManager()
}
