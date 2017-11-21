'use strict'

import ConfigHandler from '../../common/configHandler'
import {app} from 'electron'
import fs from 'fs'
import path from 'path'
import os from 'os'

function defaultOffset () {
  // Windows always sucks, even just window size report, never done things right.
  if (os.platform() === 'win32') {
    let ntVersion = /(\d+)\.(\d+)\.(\d+)/.exec(os.release())
    // Windows 7 require additional 8px
    if (ntVersion[1] === '6' && ntVersion[2] === '1') return 8
    // Windows 8/10 require additional 16px
    return 16
  }
  return 0
}

class MainConfig extends ConfigHandler {
  setDefaultConfig () {
    this.workDir = app.getPath('documents')
    this.filename = 'MasterVyrn.json'
    this.defaultConfig = {
      noThrottling: true,
      noHardwareAccel: false,
      platformOffset: defaultOffset()
    }
  }
  readConfig () {
    fs.accessSync(path.join(this.workDir, this.filename))
    let config = JSON.parse(fs.readFileSync(path.join(this.workDir, this.filename), 'utf8'))
    config.platformOffset = Math.round(config.platformOffset)
    return config
  }
  saveConfig (obj) {
    if (obj.platformOffset) Math.round(obj.platformOffset)
    fs.writeFileSync(path.join(this.workDir, this.filename), JSON.stringify(obj), 'utf8')
  }
  configApply () {
    this.config.platformOffset = Math.round(this.config.platformOffset)
    return new Promise((resolve, reject) => {
      if (this.config.noHardwareAccel) { app.disableHardwareAcceleration() }
      if (this.config.noThrottling) { app.commandLine.appendSwitch('disable-renderer-backgrounding') }
      if (this.initialized) {
        global.wm.setWidthOffset(this.config.platformOffset)
      }
      this.initialized = true
      resolve()
    })
  }
}

export default () => { return new MainConfig() }
