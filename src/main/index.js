'use strict'

import { app, ipcMain, BrowserWindow, globalShortcut } from 'electron'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

/**
 * App switch
 */
// Avoid throttling of window
app.commandLine.appendSwitch('disable-renderer-backgrounding')

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
    height: 860,
    width: 480,
    useContentSize: true
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

/**
 * ipc message Handler
 */
ipcMain.on('resizeWindow', (event, args) => {
  let m = args < 3 ? (1 + args * 0.5) : 2
  let x = parseInt(320 * m)
  let y = mainWindow.getSize()[1]
  mainWindow.setSize(x, y)
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
