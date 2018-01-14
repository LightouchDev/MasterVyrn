'use strict'

const currentWebContents = require('electron').remote.getCurrentWebContents()

export default function () {
  // Set hotkey
  window.onkeydown = event => {
    if (require('os').platform === 'darwin') {
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
      currentWebContents.openDevTools({mode: 'detach'})
    }

    // H: hide sidebar
    if (!event.ctrlKey && !event.altKey && !event.metaKey && event.code === 'KeyH') {
      window.commit('HIDE_SUB')
    }
  }

  // Set context-menu, require here instead of import to prevent vue wasn't initialized.
  const contextMenuListener = require('./contextMenu').default(currentWebContents)
  currentWebContents.on('context-menu', contextMenuListener)
}
