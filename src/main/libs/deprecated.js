'use strict'

import fs from 'fs'
import path from 'path'
import { app } from 'electron'
import { forEach } from 'lodash'

function deleteFolderRecursive (path) {
  if (fs.existsSync(path)) {
    forEach(fs.readdirSync(path), file => {
      const curPath = path + '/' + file
      if (fs.lstatSync(curPath).isDirectory()) {
        // recursive
        deleteFolderRecursive(curPath)
      } else {
        // delete file
        fs.unlinkSync(curPath)
      }
    })
    fs.rmdirSync(path)
  }
}

// Remove old useless folder may contain sensitive data
deleteFolderRecursive(path.join(app.getPath('userData'), 'Partitions'))
