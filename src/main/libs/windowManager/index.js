'use strict'

import {app, ipcMain} from 'electron'

function WindowManager () {
  this.service()
  this.width = 320
  this.subButtonWidth = 33
  this.min = this.subButtonWidth + this.width
  this.max = this.subButtonWidth + this.width * 2
}

/**
 * Window resize events
 */
WindowManager.prototype.service = function () {
  app.on('ready', () => {
    // prevent resize oversize
    global.mainWindow.on('resize', event => {
      let [winWidth, winHeight] = event.sender.getSize()
      if (winWidth < this.min) {
        event.sender.setSize(this.min, winHeight)
      }
      if (winWidth > this.max) {
        event.sender.setSize(this.max, winHeight)
      }
    })

    // resize events from resizers
    ipcMain.on('resizeWindow', (event, msg) => {
      // console.log(msg)
      this.min = msg.min
      this.max = msg.max
      this.width = msg.width
      this.subButtonWidth = msg.subButtonWidth

      let y = global.mainWindow.getSize()[1]
      global.mainWindow.setSize(this.width, y)
    })
  })
}

export default () => { return new WindowManager() }
