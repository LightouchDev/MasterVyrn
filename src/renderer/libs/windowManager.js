'use strict'

import {ipcRenderer} from 'electron'

class WindowManager {
  constructor () {
    this.zoom = 1.5
    this.submenuOpened = false
    this.delayApply = null
    this.preWindowWidth = 0
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

    // platform-specific calibration
    ipcRenderer.on('CalibrationStart', (event, msg) => {
      let platformPadding = msg - window.innerWidth
      if (platformPadding) {
        event.sender.send('CalibrationResult', platformPadding)
      } else {
        this.resizeContinue = true
      }
    })

    // re-apply window width
    ipcRenderer.on('Re-applyWindowWidth', () => {
      this.setWindowWidth(this.preWindowWidth)
    })
  }

  setDefault () {
    this.login = true
    this.Mbga = false
    this.padding = 64
    this.baseSize = 660
    this.unknownPadding = 33
    this.subButtonWidth = 18
    this.initialized = false
    this.resizeContinue = true
  }

  setWebWidth (width) {
    console.log(this)
    let webview = window.webview.style
    let overlay = document.querySelector('#overlay').style

    if (/game.granbluefantasy.jp/.test(window.webview.getURL())) {
      webview.width = `${width}px`
      overlay.width = `${width}px`
    } else {
      webview.width = `${window.innerWidth}px`
      overlay.width = `${window.innerWidth}px`
    }
    if (this.isMbga) {
      webview.marginLeft = `-${this.padding}px`
      overlay.marginLeft = `-${this.padding}px`
    } else {
      webview.marginLeft = 0
      overlay.marginLeft = 0
    }
  }

  setWindowWidth (width) {
    let min = Math.round(this.subButtonWidth + 320 * (this.submenuOpened ? 2 : 1))
    this.resizeContinue = false
    ipcRenderer.send('resizeWindow', {
      min: min,
      max: min * 2,
      width: width,
      availWidth: window.screen.availWidth,
      availHeight: window.screen.availHeight
    })
  }

  applyWidth () {
    clearTimeout(this.delayApply)
    this.delayApply = setTimeout(() => {
      let webWidth = this.baseSize * this.zoom + this.padding + this.unknownPadding
      this.setWebWidth(webWidth)

      let windowWidth = Math.round(this.zoom * (this.subButtonWidth + 320 * (this.submenuOpened ? 2 : 1)))
      if (window.screen.availWidth < windowWidth) {
        this.calcZoom(window.screen.availWidth / (this.subButtonWidth + 320 * (this.submenuOpened ? 2 : 1)))
      } else {
        this.setWindowWidth(windowWidth)
        this.preWindowWidth = windowWidth
      }
    }, 80)
  }

  calcZoom (zoom) {
    if (zoom) {
      this.zoom = zoom
    } else if (this.login) {
      this.zoom = window.innerWidth / (this.subButtonWidth + 320 * (this.submenuOpened ? 2 : 1))
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
      this.calcZoom(zoom)
    }

    wm.sessionHandler = obj => {
      this.baseSize = obj.baseSize
      this.padding = 0
      this.unknownPadding = 0
      this.subButtonWidth = 0
      this.submenuOpened = false

      if (obj.notLogin) {
        this.login = false
        console.log('notlogin')
      }
      if (obj.noAutoResize) {
        // automatic process is in webviewService/eventInject.js
        global.triggerFull = true
        console.log('no autosize')
      }
      if (obj.padding) {
        this.isMbga = obj.isMbga
        this.padding = obj.padding
        this.unknownPadding = obj.unknownPadding
        this.subButtonWidth = 18
        console.log('logined')
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
