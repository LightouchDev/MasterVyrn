'use strict'

import ResizeObserver from 'resize-observer-polyfill'

function eventResize () {
  this.webview.addEventListener('dom-ready', () => {
    let onetimeFalse = false
    const ro = new ResizeObserver(entry => {
      if (onetimeFalse) {
        entry[0].target.reload()
      }
      onetimeFalse = true
    })
    ro.observe(this.webview)
  })
}

export default eventResize
