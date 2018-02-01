'use strict'

import { remote, ipcRenderer } from 'electron'

let currentWindow = remote.getCurrentWindow()

// calc extra padding, and prevent window minimized when calc.
currentWindow.isMinimized() && currentWindow.showInactive()
const platformPadding = currentWindow.getSize()[0] - currentWindow.getContentSize()[0]
currentWindow = null

let previousSize
let windowSize = {
  min: 320,
  max: 640,
  width: 480,
  autoResize: false
}

export default (size) => {
  windowSize = {
    min: size.min + platformPadding,
    max: size.min * 2 + platformPadding,
    width: size.width + platformPadding,
    autoResize: size.autoResize
  }

  if (JSON.stringify(windowSize) !== JSON.stringify(previousSize)) {
    ipcRenderer.send('ChangeWindowSize', windowSize)
    currentWindow = remote.getCurrentWindow()
    // adjust window to fit monitor size
    const { availWidth, availHeight, availLeft, availTop } = window.screen
    let { x, y, height } = currentWindow.getBounds()
    const remainX = availWidth - windowSize.width + availLeft
    if (x > remainX) {
      x = remainX > 0 ? remainX : 0
    }
    const remainY = availHeight - height + availTop
    if (y > remainY) {
      y = remainY > 0 ? remainY : 0
    }
    if (height > availHeight) { height = availHeight }
    currentWindow.setBounds({
      x,
      y,
      width: windowSize.width,
      height
    })
    previousSize = Object.assign({}, windowSize)
  }
}
