'use strict'

import { remote } from 'electron'
import registerHotkey from './registerHotkey'

const currentWebContents = remote.getCurrentWebContents()

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
  if (window.webview !== undefined) {
    const { subOpen, subHide } = window.state.GameView
    if (!subHide && subOpen) {
      window.webview.executeJavaScript('Game.submenu.mainView.toggleSubmenu()')
    }
    window.jsonStorage.subHide = !subHide
    window.commit('VIEW_UPDATE', {
      subHide: !subHide
    })
  }
})

// hook to window.onkeyup
registerHotkey.startListen()
