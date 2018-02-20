'use strict'

import './libs/deprecated'
import './libs/configHelper'
import './libs/store'
import '../common/i18n'

import { app, BrowserWindow, ipcMain, session } from 'electron'
import path from 'path'
import { DEV, err, log } from '../common/utils'

log('App start!')

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (!DEV) {
  global.__static = path.join(__dirname, '/static').replace(/\\/g, '\\\\')
}

/**
 * Init app
 */
app.isReady()
  ? createWindow()
  : app.on('ready', createWindow)
app.once('ready', () => log('App ready!'))

/**
 * Window section
 */
let mainWindow
let windowSize = {
  min: 320,
  max: 640,
  width: 480,
  autoResize: false
}

const winURL = DEV
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
  /**
   * Session setup
   */
  session.defaultSession.setUserAgent(
    session.defaultSession.getUserAgent()
      .replace(new RegExp(`(Electron|${require('../../package.json').name})\\/[\\d.]+\\s`, 'g'), '')
  )

  mainWindow = new BrowserWindow({
    width: global.state.Config.width || 480,
    height: global.state.Config.height || 870,
    useContentSize: true,
    fullscreenable: false,
    maximizable: false
  })

  if (global.state.Config.x >= 0 && global.state.Config.y >= 0) {
    mainWindow.setPosition(global.state.Config.x, global.state.Config.y)
  }

  mainWindow.on('closed', () => app.quit())

  mainWindow.loadURL(winURL)

  const delayLength = process.platform === 'darwin' ? 600 : 80

  /**
   * Resize depend on windowSize object
   */
  let delayResize = null
  mainWindow.on('resize', event => {
    clearInterval(delayResize)
    delayResize = setInterval(() => {
      const [winWidth, winHeight] = mainWindow.getSize()
      if (windowSize.autoResize) {
        // limit the minimum window width
        if (winWidth < windowSize.min) {
          mainWindow.setSize(windowSize.min, winHeight)
        }
        // limit the maximum window width
        if (winWidth > windowSize.max) {
          mainWindow.setSize(windowSize.max, winHeight)
        }
      } else {
        mainWindow.setSize(windowSize.width, winHeight)
      }
      clearInterval(delayResize)
    }, delayLength)
  })

  ipcMain.on('ChangeWindowSize', (event, obj) => {
    windowSize = obj
  })

  /**
   * Remember window position and height
   */
  let delaySavePos = null
  mainWindow.on('move', () => {
    clearTimeout(delaySavePos)
    delaySavePos = setTimeout(() => {
      const [x, y] = mainWindow.getPosition()
      global.commit('CONFIG_UPDATE', { x, y })
    }, delayLength)
  })
  let delaySaveHeight = null
  mainWindow.on('resize', () => {
    clearTimeout(delaySaveHeight)
    delaySaveHeight = setTimeout(() => {
      const [ width, height ] = mainWindow.getContentSize()
      global.commit('CONFIG_UPDATE', { width, height })
    }, delayLength)
  })

  /**
   * Register mainWindow to global
   */
  global.mainWindow = mainWindow

  /**
   * Emit 'windowCreated' event
   */
  app.emit('windowCreated')
}

/**
 * Add context menu to each webContent
 */

app.on('web-contents-created', (event, content) => {
  content.on('context-menu', require('./libs/contextMenu').default(content))
})

/**
 * Prevent outside browsing
 */

let webviewContent = null

app.on('web-contents-created', (event, contents) => {
  if (contents.getType() === 'webview') {
    contents.on('will-navigate', (event, url) => {
      if (url.indexOf(global.state.Constants.site) === -1) {
        event.preventDefault()
        const win = new BrowserWindow({
          width: 1280,
          height: 1024,
          webPreferences: {
            preload: global.state.Constants.preload,
            nodeIntegration: false
          }
        })
        webviewContent = contents
        win.once('ready-to-show', () => win.show())
        win.webContents.on('new-window', (event, url) => {
          event.preventDefault()
          if (url.indexOf(global.state.Constants.site) !== -1) {
            contents.loadURL(url)
            win.close()
          } else {
            win.loadURL(url)
          }
        })
        win.loadURL(url)
        event.newGuest = win
      }
    })
  }
})

ipcMain.on('webviewRefresh', (event, url) => {
  url
    ? webviewContent.loadURL(url)
    : webviewContent.reload()
  webviewContent = null
})

/**
 * Handle common error
 */
if (!DEV) {
  process.on('unhandledRejection', err)
  process.on('uncaughtException', err)
}

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
  if (!DEV) autoUpdater.checkForUpdates()
})
 */
