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

function createWindow () {
  mainWindow = new BrowserWindow({
    height: 860,
    width: 480 + gCSS.scrollbarPadding,
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
 * Everything in static/global.json didn't be hot-reloaded.
 * the variables of css object will be automatically imported to scss
 * and global both Main/Renderer.
 */
let gCSS = (() => {
  let {css} = JSON.parse(require('fs').readFileSync(path.join(__static, 'globals.json'), 'utf8'))
  for (let rule in css) {
    if (typeof css[rule] === 'string') {
      css[rule] = /px$/.test(css[rule]) ? parseInt(css[rule]) : css[rule]
    }
  }
  global.gCSS = css
  return css
})()

/**
 * mainWindow events
 */
app.on('ready', () => {
  mainWindow.on('resize', event => {
    let [winWidth, winHeight] = event.sender.getSize()
    if (winWidth < 320 + gCSS.scrollbarPadding) {
      event.sender.setSize(320 + gCSS.scrollbarPadding, winHeight)
    }
    if (winWidth > 640 + gCSS.scrollbarPadding) {
      event.sender.setSize(640 + gCSS.scrollbarPadding, winHeight)
    }
  })
})

/**
 * ipc message Handler
 */
app.on('ready', () => {
  ipcMain.on('resizeWindow', (event, args) => {
    let m = args <= 2 ? (1 + args * 0.5) : 2
    let x = parseInt(320 * m) + gCSS.scrollbarPadding
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
