(() => {
  'use strict'

  const {ipcRenderer} = require('electron')

  let startTime = new Date().getTime()
  let isDev = process.env.NODE_ENV === 'development'
  let console = {
    log: window.console.log,
    warn: window.console.warn,
    error: window.console.error
  }
  DOMWatcher()
  eventInjector()

  oneshotListener(window, 'DOMContentLoaded', () => {
    // reload page when resize window, FIXME: use electron api instead
    // window.onresize = () => { document.location.reload() }
    ipcRenderer.sendToHost('setZoom', window.deviceRatio)
  })

  // FIXME: use electron buildin executeJavaScript function instead
  oneshotListener(window, 'load', () => {
    windowControllExporter()
  })

  if (isDev) {
    oneshotListener(window, 'DOMContentLoaded', () => {
      // log dom parsed time
      console.log(new Date().getTime() - startTime, 'DOM parsed')
      // recover console function
      Object.assign(window.console, console)
      window.addEventListener('mousedown', event => {
        console.log(event)
      })
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
    const startTime = new Date().getTime()
    let cssContent = require('fs').readFileSync(require('path').join(__dirname, 'override.css'), 'utf8')
    const htmlWatcher = new window.MutationObserver(mutation => {
      console.warn(new Date().getTime() - startTime, 'start looking for head!')
      if (document.head) {
        console.warn(new Date().getTime() - startTime, 'head detected!')
        headWatcher.observe(document.head, config)
        // FIXME: try electron build in insertCSS function
        let cssOverride = document.createElement('style')
        cssOverride.appendChild(document.createTextNode(cssContent))
        document.head.appendChild(cssOverride)
        htmlWatcher.disconnect()
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
                console.warn(new Date().getTime() - startTime, 'target detected!')
                headWatcher.disconnect()
              }
            }
          }
        }
      }
    })
    const config = { childList: true, subtree: true }
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
          if (isDev) {
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

  // dump getClientRects() value due to it can't be send in ipc message
  const getClientRects = (element) => {
    let {top, left, width, height} = element.getClientRects()[0]
    let rect = {top, left, width, height}
    for (let rule in rect) {
      rect[rule] += 'px'
    }
    return rect
  }

  /**
   * Send current window info
   */
  function windowShadowCopy () {

  }

  /**
   * Make size button can change window size
   * FIXME: NOT IMPLEMENT
   */
  function windowControllExporter () {
    let resizeBtn = document.getElementsByClassName('btn-pc-footer-setting')
    for (let btn of resizeBtn) {
      let msg = {
        id: btn.dataset.size,
        data: btn.dataset,
        preset: 'resizer',
        style: getClientRects(btn)
      }
      console.log(msg)
      ipcRenderer.sendToHost('createNode', msg)
    }
  }
})()
