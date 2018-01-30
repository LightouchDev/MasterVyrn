'use strict'

import fs from 'fs'
import path from 'path'
import { app } from 'electron'
import { log, err } from '../../common/utils'
import enhanceStorage from '../../common/enhanceStorage'

const options = {
  path: path.join(app.getPath('userData'), 'MasterVyrn.json')
}

const defaults = {
  noThrottling: true,
  noHardwareAccel: false
}

const actions = {
  noThrottling (args) {
    if (args && !app.isReady()) {
      app.commandLine.appendSwitch('disable-renderer-backgrounding')
    }
  },
  noHardwareAccel (args) {
    if (args && !app.isReady()) {
      app.disableHardwareAcceleration()
    }
  }
}

const jsonStorage = enhanceStorage(options, actions)
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
  fs.writeFile(options.path, JSON.stringify(jsonStorage), (error) => {
    if (error) err(error)
    app.exit(0)
  })
})
