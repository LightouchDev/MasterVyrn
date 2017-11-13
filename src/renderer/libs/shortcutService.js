'use strict'

import {remote} from 'electron'

function shortcutService () {
  window.onkeydown = event => {
    // Meta + Alt + I: open game view DevTools
    if (event.metaKey && event.altKey && event.code === 'KeyI') {
      window.webview.openDevTools({mode: 'detach'})
    }

    // Meta + Alt + O: open host view DevTools
    if (event.metaKey && event.altKey && event.code === 'KeyO') {
      remote.getCurrentWebContents().openDevTools({mode: 'detach'})
    }
  }
}

export default shortcutService
