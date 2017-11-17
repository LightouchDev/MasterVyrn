/* global DEBUG */
// FIXME: gather page information from preload script, not from webview API.

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
  }

  function headPost (content) {
    let match = /^[ \t]+var sideMenuWidth = (.*);$[\n \t]+deviceRatio = \(window\.outerWidth - sideMenuWidth - (\d+)\) \/ (\d+);$/m.exec(content)
    let isMbga = /^[ \t]+isMbga.*\n[ \t]+return (.*);$/m.exec(content)
    let response = {url: window.location.href}
    log(`match is ${match}`)
    // FIXME use Electron session instead
    if (/^[ \t]+Game.userId = 0;$/m.test(content)) {
      Object.assign(response, {
        notLogin: true,
        baseSize: /^[ \t]+deviceRatio = window\.innerWidth \/ (\d+);$/m.exec(content)[1]
      })
    } else if (window.location.pathname === '/maintenance') {
      Object.assign(response, {
        notLogin: true,
        baseSize: /^[ \t]+var deviceRatio = window\.innerWidth \/ (\d+);$/m.exec(content)[1]
      })
      setTimeout(() => {
        window.fitScreenByZoom(window.displayInitialize())
      })
    } else if (match) {
      Object.assign(response, {
        isMbga: isMbga[1] === 'true',
        padding: Math.round(match[1]),
        unknownPadding: Math.round(match[2]),
        baseSize: Math.round(match[3])
      })
    } else {
      Object.assign(response, {
        noAutoResize: true
      })
    }
    ipcRenderer.sendToHost('sessionInfo', response)
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
      log('start looking for head!', 'warn')
      if (onetimeSwitch) {
        headPre()
        onetimeSwitch = false
      }
      if (document.head) {
        log('head detected!', 'warn')
        htmlWatcher.disconnect()
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
