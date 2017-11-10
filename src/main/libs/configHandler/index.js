'use strict'

import fs from 'fs'
import path from 'path'

function ConfigHandler (workDir) {
  this.workDir = workDir
  this.defaultConfig = {
    throttling: false,
    disableHardwareAcceleration: false,
    platformPadding: 0
  }
  this.config = {}
  global.Configs = {}

  this.set()

  return this.init()
}

function InputException (message) {
  this.message = message
  this.name = 'InputException'
}

ConfigHandler.prototype.init = function () {
  return new Promise((resolve, reject) => {
    try {
      fs.accessSync(path.join(this.workDir, 'config.json'))
    } catch (error) {
      console.warn(`[WARN] ConfigHandler can't find config, create one.`)
      this.save(this.defaultConfig)
    }
    this.config = Object.assign({}, this.defaultConfig)
    Object.assign(this.config, JSON.parse(fs.readFileSync(path.join(this.workDir, 'config.json'), 'utf8')))
    Object.assign(global.Configs, this.config)
    resolve()
  })
}

ConfigHandler.prototype.set = function () {
  global.Configs.set = obj => {
    if (typeof obj !== 'object') throw new InputException('the input is not an object')
    let modified = false
    console.log('config is:', this.config)
    if (Object.keys(this.config).length) {
      for (let index in obj) {
        modified = obj[index] !== this.config[index]
        if (modified) break
      }
      if (modified) {
        Object.assign(this.config, obj)
        this.save(this.config)
      }
    }
  }
}

ConfigHandler.prototype.save = function (obj) {
  fs.writeFileSync(path.join(this.workDir, 'config.json'), JSON.stringify(obj), 'utf8')
}

export default workDir => {
  return new ConfigHandler(workDir)
}
