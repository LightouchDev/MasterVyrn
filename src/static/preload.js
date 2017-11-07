/* global DEBUG */

(() => {
  'use strict'

  if (DEBUG) {
    var startTime = window.performance.now()
    window.console.log(startTime, 'page start!')
    var console = {
      log: window.console.log,
      warn: window.console.warn,
      error: window.console.error
    }
  }

  const {ipcRenderer} = require('electron')

  DOMWatcher()
  eventInjector()
  window.process = undefined

  if (DEBUG) {
    oneshotListener(window, 'DOMContentLoaded', () => {
      console.log(now(), 'DOM parsed')
      // recover console function
      Object.assign(window.console, console)
    })

    oneshotListener(window, 'load', () => {
      console.log(now(), 'DOM ready')
    })
  }

  function now () {
    return (window.performance.now() - startTime).toFixed(2)
  }

  /**
   * Oneshot event listener
   * @param   {object}    node        - html node
   * @param   {string}    event       - event
   * @param   {function}  callback    - callback
   * @param   {boolean}   useCapture  - useCapture
   */
  function oneshotListener (node, event, callback, useCapture) {
    node.addEventListener(event, function handler (event) {
      this.removeEventListener(event.type, handler)
      return callback(event)
    }, useCapture)
  }

  function headPre () {
    ipcRenderer.sendToHost('insertCSS')
    if (DEBUG) console.log(now(), 'css patched')
  }

  function headPost () {
    let mbgaPadding = 64
    let scrollbarPadding = 3
    setTimeout(() => {
      if (DEBUG) console.log(now(), 'replace start')
      if (document.body.className !== 'jssdk') { ipcRenderer.sendToHost('notJssdk') }
      window.displayInitialize = function () {
        let deviceRatio = (window.innerWidth - (mbgaPadding + scrollbarPadding)) / 320
        if (deviceRatio <= 1) {
          deviceRatio = 1
        } else if (deviceRatio > 2) {
          deviceRatio = 2
        }
        return deviceRatio
      }
      window.deviceRatio = window.displayInitialize()
      window.fitScreenByZoom(window.deviceRatio)
      ipcRenderer.sendToHost('setZoom', window.deviceRatio)
    })
    if (DEBUG) console.warn(now(), 'target patched!')
  }

  /**
   * Watch and patch DOMs
   */
  function DOMWatcher () {
    const config = { childList: true, subtree: true }
    let onetimeSwitch = true
    const htmlWatcher = new window.MutationObserver(mutations => {
      if (onetimeSwitch) {
        headPre()
        onetimeSwitch = false
      }
      if (DEBUG) console.warn(now(), 'start looking for head!')
      if (document.head) {
        htmlWatcher.disconnect()
        if (DEBUG) console.warn(now(), 'head detected!')
        headWatcher.observe(document.head, config)
      }
    })
    htmlWatcher.observe(document, config)
    const headWatcher = new window.MutationObserver(mutations => {
      if (DEBUG) console.warn(now(), 'start looking for target!')
      for (let mutation of mutations) {
        if (onetimeSwitch) break
        if (mutation.addedNodes) {
          for (let element of mutation.addedNodes) {
            if (element.nodeName === 'SCRIPT') {
              if (/deviceRatio/.test(element.text)) {
                headPost()
                headWatcher.disconnect()
                onetimeSwitch = true
                break
              }
            }
          }
        }
      }
    })
  }

  /**
   * Inject addEventListener to clear mute event
   * FIXME: standardize this
   */
  function eventInjector () {
    let _addEventListener = window.addEventListener
    window.addEventListener = function (event, callback) {
      let funcString = callback.toString()
      let whiteReg = /unmute/
      let blockReg = /mute/
      if (!whiteReg.test(funcString)) {
        if (blockReg.test(funcString)) {
          if (DEBUG) {
            if (!this.eventListenerBlockedList) this.eventListenerBlockedList = {}
            if (!this.eventListenerBlockedList[event]) this.eventListenerBlockedList[event] = []
            this.eventListenerBlockedList[event].push(callback)
          }
          return // do not register event listener if match
        }
      }
      _addEventListener.apply(this, arguments)
    }
  }
})()
