'use strict'

import os from 'os'
import { remote } from 'electron'

const currentWindow = remote.getCurrentWindow()

const platformPadding = (() => {
  // Windows always sucks, even just window size report, never done things right.
  if (os.platform() === 'win32') {
    let ntVersion = /(\d+)\.(\d+)\.(\d+)/.exec(os.release())
    // Windows 7/8 require additional 8px
    if (ntVersion[1] === '6') return 8
    // Windows 10 require additional 16px
    return 16
  }
  return 0
})()

let previousSize
const windowSize = {
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
  console.log(`get window size: ${require('util').inspect(size)}`)
  windowSize.min = size.min + platformPadding
  windowSize.max = size.min * 2 + platformPadding
  windowSize.width = size.width + platformPadding
  windowSize.autoResize = size.autoResize

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
