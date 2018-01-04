'use strict'

import { remote } from 'electron'

const currentWindow = remote.getCurrentWindow()

const platformPadding = currentWindow.getSize()[0] - currentWindow.getContentSize()[0]

let previousSize
let windowSize = {
  min: 320,
  max: 640,
  width: 480,
  autoResize: false
}

currentWindow.on('resize', event => {
  const [winWidth, winHeight] = currentWindow.getSize()
  if (windowSize.autoResize) {
    // limit the minimum window width
    if (winWidth < windowSize.min) {
      currentWindow.setSize(windowSize.min, winHeight)
    }
    // limit the maximum window width
    if (winWidth > windowSize.max) {
      currentWindow.setSize(windowSize.max, winHeight)
    }
  } else {
    currentWindow.setSize(windowSize.width, winHeight)
  }
})

export default (size) => {
  windowSize = {
    min: size.min + platformPadding,
    max: size.min * 2 + platformPadding,
    width: size.width + platformPadding,
    autoResize: size.autoResize
  }

  if (JSON.stringify(windowSize) !== JSON.stringify(previousSize)) {
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
