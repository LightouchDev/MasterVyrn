'use strict'

import fs from 'fs'
import path from 'path'
import { app } from 'electron'
import { forEach } from 'lodash'

function deleteRecursive (path) {
  if (fs.existsSync(path)) {
    if (fs.lstatSync(path).isDirectory()) {
      forEach(fs.readdirSync(path), file => {
        const curPath = path + '/' + file
        if (fs.lstatSync(curPath).isDirectory()) {
          // recursive
          deleteRecursive(curPath)
        } else {
          // delete file
          fs.unlinkSync(curPath)
        }
      })
      fs.rmdirSync(path)
    } else {
      fs.unlinkSync(path)
    }
  }
}

// Remove old useless folder may contain sensitive data
deleteRecursive(path.join(app.getPath('userData'), 'Partitions/main'))

// Remove old config
deleteRecursive(path.join(app.getPath('documents'), 'MasterVyrn.json'))
