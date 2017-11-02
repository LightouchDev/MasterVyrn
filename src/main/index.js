'use strict'

import { app, ipcMain, BrowserWindow } from 'electron'
// mport proxyInit from './proxy'

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

/**
 * Internal proxy section
 */
/*
const internalProxy = proxyInit()

internalProxy.start()
internalProxy.on('ready', () => {
  app.on('ready', () => {
    session
      .fromPartition('persist:main', {cache: true})
      .setProxy({proxyRules: '127.0.0.1:8001'}, () => {})
    createWindow()
  })
})
*/
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
ipcMain.on('messageProxy', (event, args) => {
  event.sender.send(args.channel, args.args)
})
ipcMain.on('resizeWindow', (event, args) => {
  let m = args < 3 ? (1 + args * 0.5) : 2
  let x = parseInt(320 * m)
  let y = mainWindow.getSize()[1]
  mainWindow.setSize(x, y)
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
