'use strict'

import fs from 'fs'
import path from 'path'
import { app, session } from 'electron'
import locale from 'os-locale'
import { log, err } from '../../common/utils'
import enhanceStorage from '../../common/enhanceStorage'

// nodejs localStorage polyfill
const storage = {}
const storageFuncLayer = {
  key (n) {
    if (typeof n !== 'number') throw new Error('Parameter is number only.')
    return Object.keys(storage)[n]
  },
  getItem (key) {
    if (typeof key !== 'string') throw new Error('Parameter is string only.')
    return storage[key]
  },
  setItem (key, value) {
    if (typeof key !== 'string') throw new Error('Parameter is string only.')
    if (typeof value === 'function') return
    if (typeof value !== 'string') value = value.toString()
    storage[key] = value
    this[key] = value
  },
  removeItem (key) {
    if (typeof key !== 'string') throw new Error('Parameter is string only.')
    delete storage[key]
    delete this[key]
  },
  length () {
    return Object.keys(storage).length
  },
  clear () {
    Object.keys(storage).forEach(key => {
      delete storage[key]
      delete this[key]
    })
  }
}

const jsonPath = path.join(app.getPath('userData'), 'MasterVyrn.json')

// import saved storage
const fd = fs.openSync(jsonPath, 'r+')
if (fd !== null) {
  try {
    const content = JSON.parse(fs.readFileSync(fd, 'utf8'))
    Object.keys(content).forEach(key => {
      storage[key] = JSON.parse(content[key])
    })
  } catch (error) {}
  fs.closeSync(fd)
}

const defaults = {
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
  },
  language (args) {
    if (global.i18n) {
      global.i18n.locale = args
    }
  }
}

const jsonStorage = enhanceStorage(storageFuncLayer, actions)
const { clear } = jsonStorage
jsonStorage.clear = () => {
  clear()
  Object.assign(jsonStorage, defaults)
}

// filter defaults
Object.assign(jsonStorage,
  Object.assign(
    Object.assign({}, defaults),
    Object.assign({}, storage)
  )
)
log('config applied!')

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

// patch actions here to prevent unsupported action executed when renderer is not ready.
Object.assign(actions, rendererActions)

// initial config when renderer is ready
app.once('windowCreated', () => setTimeout(() => {
  Object.keys(rendererActions).forEach(key => {
    rendererActions[key](jsonStorage[key])
  })
}))

global.jsonStorage = jsonStorage

// auto save storage each 10 mins
setInterval(() => {
  fs.writeFile(jsonPath, JSON.stringify(storage), (error) => {
    if (error) err(error)
  })
}, 600000)

// save config when exit gracefully
app.on('before-quit', event => {
  event.preventDefault()
  fs.writeFile(jsonPath, JSON.stringify(storage), (error) => {
    if (error) err(error)
    app.exit(0)
  })
})
