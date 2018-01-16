'use strict'

import {app, BrowserWindow} from 'electron'
import path from 'path'
import mainConfig from './libs/MainConfig'

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
mainConfig().then(() => {
  app.isReady()
    ? createWindow()
    : app.on('ready', createWindow)
})

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
    width: 480,
    height: 870,
    useContentSize: true,
    fullscreenable: false,
    maximizable: false
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  mainWindow.loadURL(winURL)
}

/**
 * Prevent outside browsing
 */
function createNewWindow (url, session) {
  const win = new BrowserWindow({
    width: 1280,
    height: 1024,
    webPreferences: {
      session,
      nodeIntegration: false
    }
  })
  win.once('ready-to-show', () => win.show())
  win.loadURL(url)
}

app.on('web-contents-created', (event, contents) => {
  if (contents.getType() === 'webview') {
    const strictUrl = 'http://game.granbluefantasy.jp'
    contents.on('will-navigate', (event, url) => {
      if (url.indexOf(strictUrl) === -1) {
        event.preventDefault()
        createNewWindow(url, contents.session)
      }
    })
    contents.on('new-window', (event, url) => {
      if (url.indexOf(strictUrl) !== -1) {
        contents.loadURL(url)
      } else {
        event.preventDefault()
        createNewWindow(url, contents.session)
      }
    })
  }
})

/**
 * Handle common error
 */
function printError (error) {
  process.env.NODE_ENV === 'development' && console.warn(error)
}
process.on('unhandledRejection', printError)
process.on('uncaughtException', printError)

/**
 * Auto Updater
 *
 * Un-comment the following code below and install `electron-updater` to
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
