'use strict'

import { remote } from 'electron'
import registerHotkey from '../../libs/registerHotkey'

const currentWebContents = remote.getCurrentWebContents()

function webviewDevTools () {
  window.webview.openDevTools({mode: 'detach'})
}

function webviewRefresh () {
  window.webview.reload()
}

function webviewRefreshIgnoringCache () {
  window.webview.reloadIgnoringCache()
}

// Set hotkey
if (process.platform === 'darwin') {
  // Command + Option + I: open game view DevTools on OSX
  registerHotkey('Command+Option+I', webviewDevTools)
  // Command + R: refresh game view on OSX
  registerHotkey('Command+R', webviewRefresh)
  // Command + Shift + R: refresh game view and ignores cache on OSX
  registerHotkey('Command+Shift+R', webviewRefreshIgnoringCache)
} else {
  // F12: open game view DevTools
  registerHotkey('F12', webviewDevTools)
  // F5: refresh game view
  registerHotkey('F5', webviewRefresh)
  // Ctrl + R: refresh game view
  registerHotkey('Ctrl+R', webviewRefresh)
  // Shift + F5: refresh game view and ignores cache
  registerHotkey('Shift+F5', webviewRefreshIgnoringCache)
  // Ctrl + Shift + R: refresh game view and ignores cache
  registerHotkey('Ctrl+Shift+R', webviewRefreshIgnoringCache)
}

// Ctrl + Alt + I: open host view DevTools
registerHotkey('Ctrl+Alt+I', () => {
  currentWebContents.openDevTools({mode: 'detach'})
})

// H: hide submenu
registerHotkey('H', () => {
  if (window.webview !== undefined) {
    const { subOpen } = window.state.GameView
    const { subHide } = window.state.Config
    if (!subHide && subOpen) {
      window.webview.executeJavaScript('Game.submenu.mainView.toggleSubmenu()')
    }
    window.commit('CONFIG_UPDATE', {
      subHide: !subHide
    })
  }
})

registerHotkey.startListen()
