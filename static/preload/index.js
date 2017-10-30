(() => {
  'use strict'

  let startTime = new Date().getTime()
  let isDev = process.env.NODE_ENV === 'development'
  let console = {
    log: window.console.log,
    warn: window.console.warn,
    error: window.console.error
  }
  devtronDeps()
  DOMWatcher()
  eventInjector()

  oneshotListener(window, 'DOMContentLoaded', () => {
    // reload page when resize window
    window.onresize = () => { document.location.reload() }
  })

  if (isDev) {
    oneshotListener(window, 'DOMContentLoaded', () => {
      console.log(new Date().getTime() - startTime, 'DOM parsed')
      // recover console function
      Object.assign(window.console, console)
    })

    oneshotListener(window, 'load', () => {
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
   * Devtron deps injector
   */
  function devtronDeps () {
    if (isDev) {
      window.__devtron = {require: require, process: process}
    }
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

  /**
   * Make size button can change window size
   * FIXME: NOT IMPLEMENT
   */
  function windowControllInject () {
    let resizeBtn = document.getElementsByClassName('btn-pc-footer-setting')
    for (let index in resizeBtn) {
      if (resizeBtn.hasOwnProperty(index)) {
        resizeBtn[index].addEventListener('click', (evt) => {
          window.alert('Zoom:' + (evt.target.dataset.size * 0.5 + 1) * 320)
        })
      }
    }
  }
})()
