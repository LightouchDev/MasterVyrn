'use strict'

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

const registeredSet = []

/**
 * Parse and register hotkey
 * FIXME: not well implement
 * @param {String} hotkeys
 * @param {Function} callback
 */
function registerHotkey (hotkeys, callback) {
  const hotkeyGroup = { callback }
  hotkeys.split('+').forEach(key => {
    if (key === 'CommandOrControl' || key === 'CmdOrCtrl') {
      process.platform === 'darwin'
        ? key = 'Command'
        : key = 'Control'
    }
    keyTable[key] && (hotkeyGroup[keyTable[key]] = true)
    // test A-Z, 0-9
    if (/^[\dA-Z]$/.test(key)) {
      hotkeyGroup[key] = true
    } else {
      // test F1 - F12
      let parseTemp = /^F(\d+)$/.exec(key)
      if (parseTemp) {
        parseTemp = Number(parseTemp[1])
        if (parseTemp > 0 && parseTemp < 13) {
          hotkeyGroup[key] = true
        }
      }
    }
  })
  registeredSet.push(hotkeyGroup)
}

// Register on keyup event
registerHotkey.startListen = () => {
  log('Hotkeys: %j', registeredSet)
  window.onkeydown = function (event) {
    log(
      'ctrl: %s, alt: %s, meta: %s, shift: %s, key: %s',
      event.ctrlKey, event.altKey, event.metaKey, event.shiftKey, event.key
    )
    // Ensure single hotkey do not affect input box
    if (event.target.nodeName !== 'INPUT' && event.target.nodeName !== 'SELECT') {
      registeredSet.some(hotkey => {
        const result = ['ctrlKey', 'altKey', 'metaKey', 'shiftKey'].every(modifier => {
          return event[modifier] === !!hotkey[modifier]
        })
        if (result) {
          // test A-Z, 0-9, F1 - F12
          if (/^.$/.test(event.key) || /^F(\d+)$/.test(event.key)) {
            if (hotkey[event.key.toUpperCase()] === true) {
              hotkey.callback()
              return true
            }
          }
        }
        return false
      })
    }
  }
}

export default registerHotkey
