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
    node.addEventListener(event, function handler (e) {
      this.removeEventListener(e.type, handler)
      return callback(e)
    }, useCapture)
  }

  /**
   * Watch and patch DOMs
   */
  function DOMWatcher () {
    const config = { childList: true, subtree: true }
    const htmlWatcher = new window.MutationObserver(mutation => {
      if (DEBUG) console.warn(now(), 'start looking for head!')
      if (document.head) {
        htmlWatcher.disconnect()
        if (DEBUG) console.warn(now(), 'head detected!')
        headWatcher.observe(document.head, config)
      }
    })
    htmlWatcher.observe(document, config)
    const headWatcher = new window.MutationObserver(mutations => {
      let regex = /(window\.innerWidth)|(^[ \t]+deviceRatio.*\n)/gm
      if (DEBUG) console.warn(now(), 'start looking for target!')
      for (let mutation of mutations) {
        if (mutation.addedNodes) {
          for (let element of mutation.addedNodes) {
            if (element.nodeName === 'SCRIPT') {
              if (regex.test(element.text)) {
                element.text = element.text.replace(regex, (match, p1, p2) => {
                  return match === p1 ? '(' + p1 + ' - 64)' : ''
                })
                if (DEBUG) console.warn(now(), 'target patched!')
                headWatcher.disconnect()
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
