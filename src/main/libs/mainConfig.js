'use strict'

import ConfigHandler from '../../common/configHandler'
import { app } from 'electron'
import fs from 'fs'
import path from 'path'

class MainConfig extends ConfigHandler {
  setDefaultConfig () {
    this.workDir = app.getPath('documents')
    this.filename = 'MasterVyrn.json'
    this.defaultConfig = {
      noThrottling: true,
      noHardwareAccel: false
    }
  }
  readConfig () {
    fs.accessSync(path.join(this.workDir, this.filename))
    let config = JSON.parse(fs.readFileSync(path.join(this.workDir, this.filename), 'utf8'))
    return config
  }
  saveConfig (obj) {
    fs.writeFileSync(path.join(this.workDir, this.filename), JSON.stringify(obj), 'utf8')
  }
  configApply () {
    return new Promise((resolve, reject) => {
      if (this.config.noHardwareAccel) { app.disableHardwareAcceleration() }
      if (this.config.noThrottling) { app.commandLine.appendSwitch('disable-renderer-backgrounding') }
      resolve()
    })
  }
}

export default () => { return new MainConfig() }
