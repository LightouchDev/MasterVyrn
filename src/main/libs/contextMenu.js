'use strict'

import { forEach } from 'lodash'

const { Menu } = require('electron')

const itemText = {}
forEach(['undo', 'redo', 'cut', 'copy', 'paste', 'selectAll'], item => {
  Object.defineProperty(itemText, item, {
    get () {
      return global.i18n.t(`contextMenu.${item}`)
    }
  })
})

const selectionMenu = Menu.buildFromTemplate([
  { label: itemText.copy, role: 'copy', accelerator: 'CommandOrControl+C' },
  { type: 'separator' },
  { label: itemText.selectAll, role: 'selectall', accelerator: 'CommandOrControl+A' }
])

const inputMenu = Menu.buildFromTemplate([
  { label: itemText.undo, role: 'undo', accelerator: 'CommandOrControl+Z' },
  { label: itemText.redo, role: 'redo', accelerator: 'CommandOrControl+Y' },
  { type: 'separator' },
  { label: itemText.cut, role: 'cut', accelerator: 'CommandOrControl+X' },
  { label: itemText.copy, role: 'copy', accelerator: 'CommandOrControl+C' },
  { label: itemText.paste, role: 'paste', accelerator: 'CommandOrControl+V' },
  { type: 'separator' },
  { label: itemText.selectAll, role: 'selectall', accelerator: 'CommandOrControl+A' }
])

/**
 * Return context-menu listener for specific webContents
 * @param {Object} webContents
 * @returns {Function} - listener
 */
export default (webContents) => {
  return function (event, params) {
    const { selectionText, isEditable } = params
    if (isEditable) {
      inputMenu.popup(webContents)
    } else if (selectionText && selectionText.trim() !== '') {
      selectionMenu.popup(webContents)
    }
  }
}
