'use strict'

import ConfigHandler from '../../common/configHandler'
import {app, ipcMain} from 'electron'
import fs from 'fs'
import path from 'path'
import os from 'os'

function defaultPadding () {
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
    this.configFilename = 'MasterVyrn.json'
    this.defaultConfig = {
      noThrottling: false,
      disableHardwareAcceleration: false,
      platformPadding: defaultPadding()
    }
  }
  readConfig () {
    fs.accessSync(path.join(this.workDir, this.configFilename))
    return JSON.parse(fs.readFileSync(path.join(this.workDir, this.configFilename), 'utf8'))
  }
  saveConfig (obj) {
    fs.writeFileSync(path.join(this.workDir, this.configFilename), JSON.stringify(obj), 'utf8')
  }
  configApply () {
    return new Promise((resolve, reject) => {
      if (this.config.disableHardwareAcceleration) { app.disableHardwareAcceleration() }
      if (this.config.noThrottling) { app.commandLine.appendSwitch('disable-renderer-backgrounding') }
      resolve()
    })
  }
  globalRegister () {
    ipcMain.on('setMainConfig', (event, args) => {
      global.Configs.set(args)
    })
    ipcMain.on('getMainConfig', (event) => {
      event.returnValue = this.config
    })
  }
}

export default () => { return new MainConfig() }
