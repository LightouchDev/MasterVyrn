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
    ipcRenderer.sendToHost('insertCSS')
    log('css patched')
  }

  function headPost (content) {
    let match = /^[ \t]+var sideMenuWidth = (.*);$[\n \t]+deviceRatio = \(window.outerWidth - sideMenuWidth - (\d+)\) \/ (\d+);$/m.exec(content)
    // FIXME use Electron session instead
    if (/^[ \t]+Game.userId = 0;$/m.test(content)) {
      ipcRenderer.sendToHost('sessionInfo', {
        notLogin: true,
        baseSize: parseInt(/^[ \t]+deviceRatio = window.innerWidth \/ (\d+);$/m.exec(content)[1])
      })
    } else if (match) {
      ipcRenderer.sendToHost('sessionInfo', {
        padding: parseInt(match[1]),
        subButtonWidth: parseInt(match[2]),
        baseSize: parseInt(match[3])
      })
    } else {
      ipcRenderer.sendToHost('sessionInfo', {
        noAutoResize: true
      })
    }
    log('target passed!', 'warn')

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
    let onetimeSwitch = true
    const htmlWatcher = new window.MutationObserver(mutations => {
      if (onetimeSwitch) {
        headPre()
        onetimeSwitch = false
      }
      log('start looking for head!', 'warn')
      if (document.head) {
        htmlWatcher.disconnect()
        log('head detected!', 'warn')
        headWatcher.observe(document.head, config)
      }
    })
    htmlWatcher.observe(document, config)

    const headWatcher = new window.MutationObserver(mutations => {
      log('start looking for target!', 'warn')
      for (let mutation of mutations) {
        if (onetimeSwitch) break
        if (mutation.addedNodes) {
          for (let element of mutation.addedNodes) {
            if (element.nodeName === 'SCRIPT') {
              if (/deviceRatio/.test(element.text)) {
                log('target found!')
                headPost(element.text)
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
