'use strict'

import { clone, isEqual } from 'lodash'
import { remote, ipcRenderer } from 'electron'

let currentWindow = remote.getCurrentWindow()

// calc extra padding, and prevent window minimized when calc.
currentWindow.isMinimized() && currentWindow.showInactive()
const [windowWidth, windowHeight] = currentWindow.getSize()
const [contentWidth, contentHeight] = currentWindow.getContentSize()
const extraWidth = windowWidth - contentWidth
const extraHeight = windowHeight - contentHeight
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
    min: size.min + extraWidth,
    max: size.min * 2 + extraWidth,
    width: size.width + extraWidth,
    autoResize: size.autoResize
  }

  if (!isEqual(windowSize, previousSize)) {
    ipcRenderer.send('ChangeWindowSize', windowSize)
    currentWindow = remote.getCurrentWindow()
    // adjust window to fit monitor size
    const { availWidth, availHeight, availLeft, availTop } = window.screen
    let [x, y] = currentWindow.getPosition()
    let height = currentWindow.getContentSize()[1]
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
      height: height + extraHeight
    })
    previousSize = clone(windowSize)
  }
}
