/* global DEBUG */

(() => {
  'use strict'

  const {ipcRenderer} = require('electron')

  if (DEBUG) {
    var console = {
      log: window.console.log,
      warn: window.console.warn,
      error: window.console.error
    }
    var startTime = window.performance.now()
    console.log(startTime, 'page start!')
  }
  DOMWatcher()
  // eventInjector()
  window.process = undefined

  // prevent alert popup when resize cause frequency reload
  let _alert = window.alert
  window.alert = () => {}
  ipcRenderer.once('AlertRecovery', () => {
    window.alert = _alert
  })

  if (DEBUG) {
    oneshotListener(window, 'DOMContentLoaded', () => {
      log('DOM parsed')
      // recover console function
      Object.assign(window.console, console)
    })

    oneshotListener(window, 'load', () => {
      log('DOM ready')
    })
  }

  function log (msg, type = 'log') {
    if (DEBUG) console[type]((window.performance.now() - startTime).toFixed(2), msg)
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
    if (DEBUG) document.onmousedown = e => { console.log(e) }

    ipcRenderer.sendToHost('insertCSS')
    log('css patched')

    let submenuWatcher = setInterval(() => {
      if (document.querySelector('#submenu')) {
        new window.MutationObserver(mutations => {
          mutations.forEach(mutation => {
            ipcRenderer.sendToHost('submenu', /open/.test(mutation.target.className))
          })
        }).observe(document.querySelector('#submenu'), {attributes: true})
        clearInterval(submenuWatcher)
      }
    }, 160)
  }

  /**
   * Watch and patch DOMs
   */
  function DOMWatcher () {
    const config = { childList: true, subtree: true }
    const htmlWatcher = new window.MutationObserver(mutations => {
      log('start looking for head!', 'warn')
      if (document.head) {
        headPre()
        log('head detected!', 'warn')
        htmlWatcher.disconnect()
      }
    })
    htmlWatcher.observe(document, config)
  }

  /**
   * Inject addEventListener to clear mute event
   * FIXME: standardize this
   */
  /*
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
  */
})()
