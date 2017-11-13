'use strict'

import {remote} from 'electron'
import os from 'os'

function shortcutService () {
  window.onkeydown = event => {
    if (os.platform === 'darwin') {
      // Option + Alt + I: open game view DevTools on OSX
      if (event.metaKey && event.altKey && event.code === 'KeyI') {
        window.webview.openDevTools({mode: 'detach'})
      }
    } else {
      // F12: open game view DevTools
      if (!event.ctrlKey && !event.altKey && !event.metaKey && event.code === 'F12') {
        window.webview.openDevTools({mode: 'detach'})
      }
    }

    // Ctrl + Alt + I: open host view DevTools
    if (event.ctrlKey && event.altKey && event.code === 'KeyI') {
      remote.getCurrentWebContents().openDevTools({mode: 'detach'})
    }
  }
}

export default shortcutService
