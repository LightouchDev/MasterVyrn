(() => {
  'use strict'

  let startTime = new Date().getTime()
  devtronDeps()
  DOMWatcher()
  var oldconsolelog = window.console.log
  var oldconsoleerr = window.console.error
  var oldconsolewarn = window.console.warn
  eventInjector()
  window.addEventListener('DOMContentLoaded', () => {
    oldconsolelog(new Date().getTime() - startTime, 'DOM parsed')
    consoleRecover()
    windowResizer()
    // windowResizeInject()
  })
  window.addEventListener('load', () => {
    oldconsolelog(new Date().getTime() - startTime, 'DOM ready')
  })

  /**
   * Devtron deps injector
   */
  function devtronDeps () {
    if (process.env.NODE_ENV === 'development') {
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
   */
  function eventInjector () {
    let _addEventListener = window.addEventListener
    window.addEventListener = function (a, b, c) {
      let func = b.toString()
      let blockReg = /mute/
      let whiteReg = /unmute/
      if (process.env.NODE_ENV === 'development') {
        if (!whiteReg.test(func)) {
          if (blockReg.test(b.toString())) {
            if (!this.eventListenerBlockedList) this.eventListenerBlockedList = {}
            if (!this.eventListenerBlockedList[a]) this.eventListenerBlockedList[a] = []
            this.eventListenerBlockedList[a].push(b)
            return
          }
        }
      }
      _addEventListener(a, b, c)
    }
  }

  /**
   * Take back the console.log
   */
  function consoleRecover () {
    if (process.env.NODE_ENV === 'development') {
      window.console.log = oldconsolelog
      window.console.error = oldconsoleerr
      window.console.warn = oldconsolewarn
    }
  }

  /**
   * override window resizer
   */
  function windowResizer () {
    window.onresize = () => {
      document.location.reload()
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
