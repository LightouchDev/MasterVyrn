'use strict'

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
  window.onkeydown = function (event) {
    // Ensure single hotkey do not affect input box
    if (event.target.nodeName !== 'INPUT' && event.target.nodeName !== 'SELECT') {
      let notFound = true
      registeredSet.forEach(hotkey => {
        if (notFound) {
          let result = true
          ;['ctrlKey', 'altKey', 'metaKey', 'shiftKey'].forEach(modifier => {
            if (result) {
              result = event[modifier] === !!hotkey[modifier]
            }
          })
          // test A-Z, 0-9, F1 - F12
          if (/^[\dA-Z]$/.test(event.key) || /^F(\d+)$/.test(event.key)) {
            result = !!hotkey[event.key]
          }
          if (result) {
            hotkey.callback()
            notFound = false
          }
        }
      })
    }
  }
}

export default registerHotkey
