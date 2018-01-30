'use strict'

import fs from 'fs'
import path from 'path'
import { app } from 'electron'

function deleteFolderRecursive (path) {
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach((file, index) => {
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
