'use strict'

import { forEach } from 'lodash'
import { log } from '../../common/utils'

const keyTable = {
  Command: 'metaKey',
  Cmd: 'metaKey',
  Control: 'ctrlKey',
  Ctrl: 'ctrlKey',
  Option: 'altKey',
  Alt: 'altKey',
  Shift: 'shiftKey',
  Super: 'metaKey'
}

const registeredSet = {}

function concatKeys (keyObject, lastKey) {
  let key = ''
  forEach(['ctrlKey', 'metaKey', 'altKey', 'shiftKey'], modifier => {
    if (keyObject[modifier]) {
      if (key) key += '+'
      key += modifier
    }
  })
  if (lastKey) {
    if (key) key += '+'
    key += lastKey
  }
  return key
}

/**
 * Parse and register hotkey
 * FIXME: not well implement
 * @param {String} hotkeys
 * @param {Function} callback
 */
function registerHotkey (hotkeys, callback) {
  const modifierGroup = {}
  let lastKey = ''
  forEach(hotkeys.split('+'), key => {
    if (key === 'CommandOrControl' || key === 'CmdOrCtrl') {
      process.platform === 'darwin'
        ? key = 'Command'
        : key = 'Control'
    }
    keyTable[key] && (modifierGroup[keyTable[key]] = true)
    // test A-Z, 0-9
    if (/^[\dA-Z]$/.test(key)) {
      lastKey = key
    } else {
      // test F1 - F12
      let parseTemp = /^F(\d+)$/.exec(key)
      if (parseTemp) {
        parseTemp = Number(parseTemp[1])
        if (parseTemp > 0 && parseTemp < 13) {
          lastKey = key
        }
      }
    }
  })
  registeredSet[concatKeys(modifierGroup, lastKey)] = callback
}

// Register on keyup event
registerHotkey.startListen = () => {
  log('hotkeys: %o', registeredSet)
  window.onkeydown = function (event) {
    const keys = concatKeys(event, event.key.toUpperCase())
    log('concat result: %s', keys)
    // Ensure single hotkey do not affect input box
    if (event.target.nodeName !== 'INPUT' && event.target.nodeName !== 'SELECT' && registeredSet[keys]) {
      registeredSet[keys]()
    }
  }
}

export default registerHotkey
