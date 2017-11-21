'use strict'

import util from 'util'
import defaultsDeep from 'lodash.defaultsdeep'
import clonedeep from 'lodash.clonedeep'

class ConfigHandler {
  constructor () {
    this.initialized = false
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

  // return config object
  readConfig () {
  }

  // save config object
  saveConfig (obj) {
  }

  // any method register on global place here
  globalRegister () {
  }

  // execute after save
  postProcess () {
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
      let savedConfig = this.readConfig()

      this.filterConfigs(savedConfig, this.defaultConfig)
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
    newConfig = clonedeep(newConfig)
    oldConfig = clonedeep(oldConfig)
    return new Promise((resolve) => {
      let filteredConfig = defaultsDeep(newConfig, oldConfig)
      resolve(filteredConfig)
      console.log(`config: ${util.inspect(oldConfig)}\nnew config: ${util.inspect(newConfig)}`)
      console.log('resolve with', filteredConfig)
    })
  }

  /**
   * Register global method to set config
   */
  globalMethod () {
    global.Configs.set = obj => {
      if (typeof obj !== 'object') throw new this.InputException('input is not object')

      this.filterConfigs(obj).then(result => {
        if (JSON.stringify(result) !== '{}') {
          this.config = result
          Object.assign(global.Configs, this.config)
          this.save(this.config)
          this.configApply()
        }
      })
    }
    global.Configs.get = obj => {
      return clonedeep(this.config)
    }
    global.Configs.getDefaults = obj => {
      return clonedeep(this.defaultConfig)
    }
  }

  /**
   * Convert object to JSON and save to file system
   * @param {object} obj - config object
   */
  save (obj) {
    return new Promise(resolve => {
      console.log('config saved')
      this.saveConfig(obj)
      resolve()
    })
  }
}

export default ConfigHandler
