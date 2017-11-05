'use strict'

import { app, ipcMain, BrowserWindow, globalShortcut } from 'electron'
import os from 'os'
import path from 'path'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = path.join(__dirname, '/static').replace(/\\/g, '\\\\')
}

/**
 * App switch
 */
// Avoid throttling of window
app.commandLine.appendSwitch('disable-renderer-backgrounding')

// Disable hardware acceleration in Win10 for OBS window capture
// FIXME: it should ship with option, not hard-coded.
if (os.platform() === 'win32' && os.release().split('.')[0] === '10') {
  app.disableHardwareAcceleration()
}
app.on('ready', createWindow)

/**
 * Window section
 */
let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

const isSecondInstance = app.makeSingleInstance((commandLine, workingDirectory) => {
  // Someone tried to run a second instance, we should focus our window.
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore()
    mainWindow.focus()
  }
})
if (isSecondInstance) {
  app.quit()
}

app.on('window-all-closed', () => {
  app.quit()
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

/**
 * Everything in static/global.json didn't be hot-reloaded.
 * the variables of css object will be automatically imported to scss.
 */
const css = (() => {
  let {css} = JSON.parse(require('fs').readFileSync(path.join(__static, 'global.json'), 'utf8'))
  for (let rule in css) {
    if (typeof css[rule] === 'string') {
      css[rule] = /px$/.test(css[rule]) ? parseInt(css[rule]) : css[rule]
    }
  }
  return css
})()

function createWindow () {
  mainWindow = new BrowserWindow({
    height: 860,
    width: 480 + css.sidebarPadding,
    useContentSize: true,
    fullscreenable: false,
    maximizable: false
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

/**
 * mainWindow events
 */
app.on('ready', () => {
  mainWindow.on('resize', event => {
    let [winWidth, winHeight] = event.sender.getSize()
    if (winWidth - css.sidebarPadding < 320) { event.sender.setSize(320 + css.sidebarPadding, winHeight) }
    if (winWidth - css.sidebarPadding > 640) { event.sender.setSize(640 + css.sidebarPadding, winHeight) }
  })
})

/**
 * ipc message Handler
 */
app.on('ready', () => {
  ipcMain.on('resizeWindow', (event, args) => {
    let m = args < 3 ? (1 + args * 0.5) : 2
    let x = parseInt(320 * m)
    let y = mainWindow.getSize()[1]
    mainWindow.setSize(x, y)
  })
})

/**
 * Global accelerator
 */
app.on('ready', () => {
  globalShortcut.register('CommandOrControl+Alt+I', () => {
    mainWindow.webContents.send('webviewDevTools')
  })
  globalShortcut.register('CommandOrControl+Alt+O', () => {
    mainWindow.webContents.openDevTools()
  })
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
