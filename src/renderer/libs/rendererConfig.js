'use strict'

import ConfigHandler from '../../common/configHandler'

class RendererConfig extends ConfigHandler {
  setDefaultConfig () {
    this.defaultConfig = {
      window: {
        alwaysOnTop: false,
        lockWindowSize: false,
        zoom: 1.5
      },
      proxy: {
        type: 'Direct',
        server: '',
        port: 65535
      }
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
}

export default () => { return new RendererConfig() }
