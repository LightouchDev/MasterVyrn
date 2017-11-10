'use strict'

import windowManager from './windowManager'

let BackgroundService = function () {
  this.globalVars()
  windowManager()
}

BackgroundService.prototype.globalVars = function () {
  global.setVar = obj => {
    Object.assign(global, obj)
    require('electron').ipcRenderer.send('globalVariable', obj)
  }
}

export default () => { return new BackgroundService() }
