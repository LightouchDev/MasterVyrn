'use strict'

import { app, ipcMain, BrowserWindow, globalShortcut } from 'electron'
import os from 'os'
import path from 'path'
import configHandler from './libs/configHandler'
import windowManager from './libs/windowManager'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = path.join(__dirname, '/static').replace(/\\/g, '\\\\')
}

/**
 * Init service
 */
configHandler(app.getPath('userData')).then(() => {
  windowManager(mainWindow)
})

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

function createWindow () {
  mainWindow = new BrowserWindow({
    width: Math.round((320 + 18) * 1.5),
    height: 870,
    useContentSize: true,
    fullscreenable: false,
    maximizable: false
  })
  global.mainWindow = mainWindow

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

/**
 * ipc message Handler
 */
app.on('ready', () => {
  ipcMain.on('globalVariable', (event, args) => {
    Object.assign(global.Configs, args)
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
