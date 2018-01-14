'use strict'
const { Menu } = require('electron').remote

const itemText = {}
;['undo', 'redo', 'cut', 'copy', 'paste', 'selectAll'].forEach((item) => {
  Object.defineProperty(itemText, item, {
    get () {
      return window.vue.$t(`contextMenu.${item}`)
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
export default function (webContents) {
  return function (event, params) {
    const { selectionText, isEditable } = params
    if (isEditable) {
      inputMenu.popup(webContents)
    } else if (selectionText && selectionText.trim() !== '') {
      selectionMenu.popup(webContents)
    }
  }
}
