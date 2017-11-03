/* global DEBUG, webviewOverride */

(() => {
  'use strict'

  if (DEBUG) {
    var startTime = new Date().getTime()
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
      // log dom parsed time
      console.log(new Date().getTime() - startTime, 'DOM parsed')
      // recover console function
      Object.assign(window.console, console)
    })

    oneshotListener(window, 'load', () => {
      // log dom loaded time
      console.log(new Date().getTime() - startTime, 'DOM ready')
    })
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
      if (DEBUG) console.warn(new Date().getTime() - startTime, 'start looking for head!')
      if (document.head) {
        if (DEBUG) console.warn(new Date().getTime() - startTime, 'head detected!')
        htmlWatcher.disconnect()
        let cssElement = document.createElement('style')
        cssElement.type = 'text/css'
        cssElement.innerHTML = webviewOverride
        document.head.appendChild(cssElement)
        headWatcher.observe(document.head, config)
      }
    })
    const headWatcher = new window.MutationObserver(mutations => {
      let regex = /^[ \t]+deviceRatio.*\n/gm
      for (let mutation of mutations) {
        if (mutation.addedNodes) {
          for (let element of mutation.addedNodes) {
            if (element.nodeName === 'SCRIPT') {
              if (regex.test(element.text)) {
                element.text = element.text.replace(regex, '')
                if (DEBUG) console.warn(new Date().getTime() - startTime, 'target detected!')
                headWatcher.disconnect()
              }
            }
          }
        }
      }
    })
    htmlWatcher.observe(document, config)
  }

  /**
   * Inject addEventListener to clear mute event
   * FIXME: standardize this
   */
  function eventInjector () {
    let _addEventListener = window.addEventListener
    window.addEventListener = function (event, callback, ...options) {
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
      _addEventListener(event, callback, options)
    }
  }
})()