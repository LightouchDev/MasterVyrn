'use strict'

import util from 'util'

class ConfigHandler {
  constructor () {
    this.config = {}
    global.Configs = {}

    this.setDefaultConfig()
    this.globalRegister()
    this.globalMethod()
    return this.init()
  }

  InputException (message = '') {
    this.message = message
    this.name = 'InputException'
  }

  setDefaultConfig () {
  }

  readConfig () {
  }

  saveConfig () {
  }

  globalRegister () {
  }

  configApply () {
    return new Promise((resolve, reject) => {
      resolve()
    })
  }

  /**
   * Config initialize process
   * FIXME: it's totally ugly.
   */
  init () {
    return new Promise((resolve) => {
      try {
        this.readConfig()
        resolve()
      } catch (error) {
        console.warn(`[WARN] ConfigHandler can't find config, create one.`)
        this.save(this.defaultConfig).then(() => { resolve() })
      }
    }).then(() => {
      this.config = Object.assign({}, this.defaultConfig)
      let savedConfig = this.readConfig()

      this.filterConfigs(savedConfig)
        .then(result => {
          Object.assign(this.config, result)
          Object.assign(global.Configs, this.config)
          return this.configApply()
        })
    })
  }

  /**
   * filter all unexpected config out,
   * and resolve all diff configs
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
      if (typeof obj !== 'object') throw new this.InputException('input is not object')
      console.log(`current config: ${util.inspect(this.config)}\nnew config: ${util.inspect(obj)}`)

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
    return new Promise(resolve => {
      console.log('save config:', obj)
      this.saveConfig(obj)
      resolve()
    })
  }
}

export default ConfigHandler
