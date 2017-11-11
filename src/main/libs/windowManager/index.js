'use strict'

import {app, ipcMain} from 'electron'

function WindowManager () {
  let subButtonWidth = 19

  this.service()
  this.width = 320
  this.platformPadding = 0
  this.min = (subButtonWidth + this.width)
  this.max = (subButtonWidth + this.width) * 2
}

/**
 * Window resize events
 */
WindowManager.prototype.service = function () {
  app.on('ready', () => {
    // prevent resize oversize
    let delayResize = null
    global.mainWindow.on('resize', event => {
      clearTimeout(delayResize)
      delayResize = setTimeout(() => {
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

      let y = global.mainWindow.getSize()[1]
      global.mainWindow.setSize(this.width, y)
      event.sender.send('CalibrationStart')
    })

    // receive padding result
    ipcMain.on('CalibrationResult', (event, msg) => {
      this.platformPadding = msg
    })
  })
}

export default () => { return new WindowManager() }
