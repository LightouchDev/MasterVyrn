'use strict'

import fs from 'fs'
import path from 'path'
import locale from 'os-locale'
import { assign, forEach, isUndefined } from 'lodash'
import { app, session } from 'electron'
import { log, err } from '../../common/utils'

const configPath = path.join(app.getPath('userData'), 'MasterVyrn.json')

const configDefaults = {
  noThrottling: true,
  noHardwareAccel: false,
  // renderer defaults
  language: locale.sync(),
  alwaysOnTop: false,
  proxy: 'direct://',
  raids: [],
  webviewConfig: {},
  subHide: false
}
global.configDefaults = configDefaults

// check default translation exist
if (isUndefined(require('../../common/i18n/translations').default[configDefaults.language])) {
  configDefaults.language = 'en_US'
}

const actions = {
  noThrottling (args) {
    if (args && !app.isReady()) {
      app.commandLine.appendSwitch('disable-renderer-backgrounding')
      log('noThrottling is enabled!')
    }
  },
  noHardwareAccel (args) {
    if (args && !app.isReady()) {
      app.disableHardwareAcceleration()
      log('noHardwareAccel is enabled!')
    }
  }
}

const rendererActions = {
  alwaysOnTop (args) {
    global.mainWindow.setAlwaysOnTop(args)
    log('alwaysOnTop is %s', global.mainWindow.isAlwaysOnTop())
  },
  proxy (args) {
    session.defaultSession.setProxy({
      proxyRules: args,
      proxyBypassRules: '<local>'
    }, () => {})
    session.defaultSession.resolveProxy(global.state.Constants.site, (proxyString) => {
      log('proxy resolve with: %s', proxyString)
    })
  }
}

// import saved storage
global.importConfig = () => {
  const config = {}
  assign(config, configDefaults, content)
  return config
}

// apply new config
const applyConfig = (config) => {
  forEach(actions, (value, key) => {
    if (!isUndefined(config[key])) {
      value(config[key])
    }
  })
}
global.applyConfig = applyConfig

// read and apply saved config
let content
try {
  const fd = fs.openSync(configPath, 'r+')
  content = JSON.parse(fs.readFileSync(fd, 'utf8'))
  applyConfig(content)
  log('config applied!')
  fs.closeSync(fd)
} catch (error) {
  if (error.code === 'ENOENT') {
    log('no config found, apply default settings')
    applyConfig(configDefaults)
  } else {
    throw error
  }
}

assign(actions, rendererActions)

// initial config when renderer is ready
if (!isUndefined(content)) {
  app.once('windowCreated', () => setTimeout(() => {
    forEach(rendererActions, (value, key) => {
      if (!isUndefined(content[key])) {
        value(content[key])
      }
    })
  }))
}

// auto save storage each 10 mins
setInterval(() => {
  fs.writeFile(configPath, JSON.stringify(global.state.Config), (error) => {
    if (error) err(error)
  })
}, 600000)

// save config when exit gracefully
app.on('before-quit', event => {
  event.preventDefault()
  fs.writeFile(configPath, JSON.stringify(global.state.Config), (error) => {
    if (error) err(error)
    app.exit(0)
  })
})
