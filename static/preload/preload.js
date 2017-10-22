'use strict'

;(() => {
  var oldconsolelog = window.console.log
  var oldconsoleerr = window.console.error
  var oldconsolewarn = window.console.warn
  eventInjector()
  window.addEventListener('DOMContentLoaded', () => {
    consoleRecover()
    cssOverride()
    windowResizer()
    // windowResizeInject()
  })

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
   * Inject css rule to head
   */
  function cssOverride () {
    let cssContent = require('fs').readFileSync(require('path').join(__dirname, 'override.css'), 'utf8')
    let cssOverride = document.createElement('style')
    cssOverride.appendChild(document.createTextNode(cssContent))
    document.head.appendChild(cssOverride)
  }

  /**
   * override window resizer
   */
  function windowResizer () {
    let zoomSetter = () => {
      document.getElementById(window.Game.gameContainer.id).style.zoom = window.innerWidth / 320
    }
    let fastResizer = setInterval(zoomSetter, 0)
    setTimeout(() => {
      clearInterval(fastResizer)
    }, 1000)
    window.onresize = zoomSetter
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
