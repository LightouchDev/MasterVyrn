'use strict'

import {app, ipcMain} from 'electron'

class WindowManager {
  constructor () {
    let subButtonWidth = 19

    this.width = 320
    this.platformPadding = 0
    this.delayResize = null
    this.min = (subButtonWidth + this.width)
    this.max = (subButtonWidth + this.width) * 2

    // prevent resize oversize
    global.mainWindow.on('resize', event => {
      clearTimeout(this.delayResize)
      this.delayResize = setTimeout(() => {
        let [winWidth, winHeight] = event.sender.getSize()
        if (winWidth < this.min) {
          event.sender.setSize(this.min, winHeight)
        }
        if (winWidth > this.max) {
          event.sender.setSize(this.max, winHeight)
        }
      })
    })

    // resize events from resizers
    ipcMain.on('resizeWindow', (event, msg) => {
      this.min = msg.min + this.platformPadding
      this.max = msg.max + this.platformPadding
      this.width = msg.width + this.platformPadding

      let {x, y, height} = global.mainWindow.getBounds()
      if (x > msg.availWidth - this.width) {
        x = msg.availWidth - this.width > 0
          ? msg.availWidth - this.width
          : 0
      }
      if (y > msg.availHeight - height) {
        y = msg.availHeight - height > 0
          ? msg.availHeight - height
          : 0
      }
      if (height > msg.availHeight) { height = msg.availHeight }
      global.mainWindow.setBounds({
        x: x,
        y: y,
        width: this.width,
        height: height
      })
      event.sender.send('CalibrationStart', msg.width)
    })

    // apply platform padding and re-apply window size
    ipcMain.on('CalibrationResult', (event, msg) => {
      this.platformPadding = msg
      event.sender.send('Re-applyWindowWidth')
    })
  }
}

export default () => {
  app.on('ready', () => {
    return new WindowManager()
  })
}
