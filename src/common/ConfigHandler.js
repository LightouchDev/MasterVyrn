'use strict'

import util from 'util'

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
    newConfig = Object.assign({}, newConfig)
    oldConfig = Object.assign({}, oldConfig)
    return new Promise((resolve) => {
      let filteredConfig = Object.assign(newConfig, oldConfig)
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
      if (typeof obj !== 'object') throw new Error('input is not object')

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
      return Object.assign({}, this.config)
    }
    global.Configs.getDefaults = obj => {
      return this.defaultConfig
    }
    global.Configs.setDefaults = () => {
      this.config = Object.assign({}, this.defaultConfig)
      this.save(this.defaultConfig)
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
