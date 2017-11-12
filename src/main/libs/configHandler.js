'use strict'

import {app} from 'electron'
import fs from 'fs'
import path from 'path'

function InputException (message) {
  this.message = message
  this.name = 'InputException'
}

class ConfigHandler {
  constructor () {
    this.workDir = app.getPath('documents')
    this.configFilename = 'MasterVyrn.json'
    this.defaultConfig = {
      throttling: false,
      disableHardwareAcceleration: false,
      platformPadding: 0
    }

    this.config = {}
    global.Configs = {}

    this.globalMethod()
    return this.init()
  }

  /**
   * Config initialize process
   * FIXME: it's totally ugly.
   */
  init () {
    return new Promise((resolve) => {
      try {
        fs.accessSync(path.join(this.workDir, this.configFilename))
        resolve()
      } catch (error) {
        console.warn(`[WARN] ConfigHandler can't find config, create one.`)
        this.save(this.defaultConfig).then(() => { resolve() })
      }
    }).then(() => {
      this.config = Object.assign({}, this.defaultConfig)
      let savedConfig = JSON.parse(fs.readFileSync(path.join(this.workDir, this.configFilename), 'utf8'))

      this.filterConfigs(savedConfig)
        .then(result => {
          Object.assign(this.config, result)
          Object.assign(global.Configs, this.config)
          return this.configApply()
        })
    })
  }

  /**
   * Apply configs
   */
  configApply () {
    return new Promise((resolve, reject) => {
      if (this.config.disableHardwareAcceleration) { app.disableHardwareAcceleration() }
      if (this.config.throttling) { app.commandLine.appendSwitch('disable-renderer-backgrounding') }
      resolve()
    })
  }

  /**
   * filter all unexpected config out,
   * resolve all diff configs
   */
  filterConfigs (newConfig, oldConfig = this.config) {
    return new Promise((resolve) => {
      let filteredConfig = {}
      let configNumber = Object.keys(newConfig).length

      for (let index in newConfig) {
        configNumber--
        if (oldConfig[index] !== undefined) {
          if (oldConfig[index] !== newConfig[index]) {
            Object.assign(filteredConfig, {[index]: newConfig[index]})
          }
        }
        if (!configNumber) {
          resolve(filteredConfig)
          console.log('resolve with', filteredConfig)
        }
      }
    })
  }

  /**
   * Register global method to set config
   */
  globalMethod () {
    global.Configs.set = obj => {
      if (typeof obj !== 'object') throw new InputException('input is not object')
      console.log(`config is: ${this.config}\nnew config: ${obj}`)

      this.filterConfigs(obj).then(result => {
        if (JSON.stringify(result) !== '{}') {
          Object.assign(this.config, result)
          Object.assign(global.Configs, this.config)
          this.save(this.config)
        }
      })
    }
  }

  /**
   * Convert object to JSON and save to file system
   * @param {object} obj - config object
   */
  save (obj) {
    return new Promise((resolve) => {
      console.log('save config:', obj)
      fs.writeFileSync(path.join(this.workDir, this.configFilename), JSON.stringify(obj), 'utf8')
      resolve()
    })
  }
}

export default () => { return new ConfigHandler() }
