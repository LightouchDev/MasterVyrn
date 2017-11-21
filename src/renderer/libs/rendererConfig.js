'use strict'

import ConfigHandler from '../../common/configHandler'
import {remote} from 'electron'

class RendererConfig extends ConfigHandler {
  setDefaultConfig () {
    this.defaultConfig = {
      window: {
        alwaysOnTop: false,
        lockWindowSize: false,
        zoom: 1.5
      },
      proxy: {
        type: 'DIRECT',
        server: '',
        port: ''
      },
      language: navigator.languages[0] || navigator.language
    }
  }
  readConfig () {
    let config = JSON.parse(window.localStorage.getItem('configure'))
    if (config) {
      return config
    } else {
      throw new this.InputException()
    }
  }
  saveConfig (obj) {
    window.localStorage.setItem('configure', JSON.stringify(obj))
  }
  configApply () {
    return new Promise((resolve, reject) => {
      remote.getCurrentWindow().setAlwaysOnTop(this.config.window.alwaysOnTop)
      remote.getCurrentWindow().setResizable(!this.config.window.lockWindowSize)
      if (this.initialized) {
        global.wm.setZoom(this.config.window.zoom)
        window.vue.$i18n.locale = this.config.language
        global.wvs.applyProxy()
      }
      this.initialized = true
      resolve()
    })
  }
  globalRegister () {
    Object.assign(global.Configs, {proxyAddress: () => {
      let config = global.Configs.proxy
      let proxy = `${config.type}://`
      if (global.Configs.proxy.type !== 'direct') {
        proxy += `${config.server}:${config.port}`
      }
      return proxy
    }})
  }
}

export default () => { return new RendererConfig() }
