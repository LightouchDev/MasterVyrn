'use strict'

import registerHotkey from './registerHotkey'

const currentWebContents = require('electron').remote.getCurrentWebContents()

function webviewDevTools () {
  window.webview.openDevTools({mode: 'detach'})
}

// Set hotkey
if (process.platform === 'darwin') {
  // Command + Option + I: open game view DevTools on OSX
  registerHotkey('Command+Option+I', webviewDevTools)
} else {
  // F12: open game view DevTools
  registerHotkey('F12', webviewDevTools)
}

// Ctrl + Alt + I: open host view DevTools
registerHotkey('Ctrl+Alt+I', () => {
  currentWebContents.openDevTools({mode: 'detach'})
})

// H: hide submenu
registerHotkey('H', () => {
  window.commit('HIDE_SUB')
})

// hook to window.onkeyup
registerHotkey.startListen()

// Set context-menu, require here instead of import to prevent vue wasn't initialized.
currentWebContents.on('context-menu', require('./contextMenu').default(currentWebContents))
