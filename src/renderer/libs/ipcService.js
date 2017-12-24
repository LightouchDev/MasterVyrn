'use strict'

import { remote, ipcRenderer } from 'electron'
import { gunzipSync, inflateRawSync } from 'zlib'
import urlParser from 'url-parser'

function inspectCondition (type, message) {
  if (type === 'request' && message.body.toString() !== '') return true
  if (type === 'response') {
    const url = urlParser(message.url)
    if (url.pathname === '/') return true
  }
}

function contentProcessor (type, message) {
  const path = urlParser(message.url).pathname
  if (type === 'response') {
    const content = message.body.toString()
    if (path === '/') {
      // Setup view when not log in
      if (/^[ \t]+Game.userId = 0;$/m.test(content)) {
        console.log('not login')
        window.commit('VIEW_RESET')
        window.commit('VIEW_UPDATE', {
          login: false,
          baseSize: /^[ \t]+deviceRatio = window\.innerWidth \/ (\d+);$/m.exec(content)[1]
        })
        return
      }
      // Setup view when login
      const match = /^[ \t]+var sideMenuWidth = (.*);$[\n \t]+deviceRatio = \(window\.outerWidth - sideMenuWidth - (\d+)\) \/ (\d+);/m.exec(content)
      const isMbga = /^[ \t]+isMbga.*\n[ \t]+return (.*);$/m.exec(content)
      if (match) {
        window.commit('VIEW_UPDATE', {
          login: true,
          autoResize: true,
          isMbga: isMbga[1] === 'true',
          sidePadding: Number(match[1]),
          unknownPadding: Number(match[2]),
          baseSize: Number(match[3]),
          subMenuWidth: Number(match[3] - 640) // each
        })
        /* eslint-disable no-tabs */
      } else if (content.indexOf('	deviceRatio') !== -1) {
        // when view is not responsive
        window.commit('VIEW_RESET')
        window.commit('VIEW_UPDATE', {
          login: true,
          zoom: Number(/^[ \t]+deviceRatio = ([\d.]+);/m.exec(content)[1]),
          isMbga: isMbga[1] === 'true'
        })
        window.commit('VIEW_PRESET')
      } else {
        console.warn(`can't extract info.`)
      }
    }

    // Setup view when maintenance
    if (path === '/maintenance') {
      window.commit('VIEW_RESET')
      window.commit('VIEW_UPDATE', {
        maintenance: true,
        login: false,
        autoResize: true,
        baseSize: /^[ \t]+var deviceRatio = window\.innerWidth \/ (\d+);$/m.exec(content)[1]
      })
    }
  }

  if (type === 'request') {
    // open submenu when purchase page popup
    if (/purchase_jssdk/.test(message.url)) {
      if (!window.state.GameView.subOpen) window.webview.executeJavaScript('Game.submenu.mainView.showChat()')
    }
  }
}

export default () => {
  // Setup session
  const currentSession = remote.session.fromPartition(window.state.GameWeb.partition)

  currentSession
    .setProxy({pacScript: `http://localhost:${remote.getGlobal('proxy').port}/proxy.pac`}, () => {
      currentSession
        .resolveProxy(window.state.GameWeb.gameURL, proxy => {
          console.log(`${window.performance.now()} resolve proxy: ${proxy}`)
        })
    })

  ipcRenderer.on('HTTPContent', (event, type, message) => {
    if (typeof type !== 'string' && typeof message !== 'object') throw new Error(`'HTTPContent' got wrong`)

    if (inspectCondition(type, message)) {
      if (message.header['content-encoding'] === 'gzip') {
        message.body = gunzipSync(message.body)
      } else if (message.header['content-encoding'] === 'deflate') {
        message.body = inflateRawSync(message.body)
      }
      contentProcessor(type, message)
    }
  })
}
