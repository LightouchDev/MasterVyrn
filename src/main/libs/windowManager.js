'use strict'

import {ipcMain} from 'electron'

class WindowManager {
  constructor () {
    let subButtonWidth = 18

    this.width = 320
    this.platformOffset = global.Configs.platformOffset || 0
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
      this.min = msg.min + this.platformOffset
      this.max = msg.max + this.platformOffset
      this.width = msg.width + this.platformOffset

      // move or adjust window to fit monitor size
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
      // event.returnValue = 0
      if (msg.calibration) event.sender.send('CalibrationStart')
    })

    // apply platform padding and re-apply window size
    ipcMain.on('CalibrationResult', (event, offset) => {
      this.platformOffset = this.platformOffset + offset
      global.Configs.set({platformOffset: this.platformOffset})
      event.sender.send('ApplyWindowWidth')
    })

    global.wm = {
      setWidthOffset: (offset) => {
        this.platformOffset = offset
      }}
  }
}

export default () => { return new WindowManager() }
