'use strict'

import fs from 'fs'
import path from 'path'
import { app } from 'electron'
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
  Object.assign(storage, JSON.parse(fs.readFileSync(fd, 'utf8')))
  Object.assign(storageFuncLayer, storage)
  fs.closeSync(fd)
}

const defaults = {
  noThrottling: true,
  noHardwareAccel: false
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
    Object.assign({}, jsonStorage)
  )
)
log('config applied!')

global.jsonStorage = jsonStorage

app.on('before-quit', event => {
  event.preventDefault()
  fs.writeFile(jsonPath, JSON.stringify(storage), (error) => {
    if (error) err(error)
    app.exit(0)
  })
})
