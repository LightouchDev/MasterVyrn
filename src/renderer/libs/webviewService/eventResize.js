'use strict'

import ResizeObserver from 'resize-observer-polyfill'

/**
 * Reload webview when webview resized.
 * FIXME: ResizeObserver is bugged.
 */
function eventResize () {
  let notJssdk = false
  this.webview.addEventListener('ipc-message', (event) => {
    if (event.channel === 'notJssdk') { notJssdk = true }
  })

  let onetimeFalse = false
  const ro = new ResizeObserver(entry => {
    if (onetimeFalse) {
      entry[0].target.reload()
    }
    onetimeFalse = true
  })

  this.webview.addEventListener('did-finish-load', () => {
    notJssdk
      ? ro.disconnect()
      : ro.observe(this.webview)
  })
}

export default eventResize
