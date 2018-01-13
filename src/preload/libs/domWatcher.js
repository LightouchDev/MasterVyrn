'use strict'

import { commit, log, hostLog, DEBUG, sendToHost } from './utils'

function extractViewInfo (content) {
  if (window.location.pathname === '/') {
    // Setup view when not log in
    if (window.Game.userId === 0) {
      hostLog('not login')
      commit('VIEW_RESET')
      commit('VIEW_UPDATE', {
        login: false,
        baseSize: /^[ \t]+deviceRatio = window\.innerWidth \/ (\d+);$/m.exec(content)[1]
      })
      return
    }
    // Setup view when login
    const match = /^[ \t]+var sideMenuWidth = (.*);$[\n \t]+deviceRatio = \(window\.outerWidth - sideMenuWidth - (\d+)\) \/ (\d+);/m.exec(content)
    if (match) {
      commit('VIEW_UPDATE', {
        login: true,
        autoResize: true,
        isMbga: window.Game.ua.isMbga(),
        sidePadding: Number(match[1]),
        unknownPadding: Number(match[2]),
        baseSize: Number(match[3]),
        subMenuWidth: Number(match[3] - 640) // each
      })
      /* eslint-disable no-tabs */
    } else if (content.indexOf('	deviceRatio') !== -1) {
      // when view is not responsive
      commit('VIEW_RESET')
      commit('VIEW_UPDATE', {
        login: true,
        zoom: Number(/^[ \t]+deviceRatio = ([\d.]+);/m.exec(content)[1]),
        isMbga: window.Game.ua.isMbga()
      })
      commit('VIEW_PRESET')
    } else {
      hostLog(`can't extract info.`, 'warn')
    }
  }
  if (window.location.pathname === '/maintenance') {
    commit('VIEW_RESET')
    commit('VIEW_UPDATE', {
      maintenance: true,
      login: false,
      autoResize: true,
      baseSize: /^[ \t]+var deviceRatio = window\.innerWidth \/ (\d+);$/m.exec(content)[1]
    })
  }
}

/**
 * Watch DOMs
 */
function domWatcher () {
  const watcherConfig = { childList: true, subtree: true }
  // Initial a watcher to get head ready
  const htmlWatcher = new window.MutationObserver(() => {
    if (document.head) {
      log('head detected!', 'warn')
      sendToHost('injectReady')
      log('dom ready for patching')
      if (DEBUG) document.onmousedown = e => console.log(e)

      // Initial a watcher to get target ready
      const headWatcher = new window.MutationObserver(mutations => {
        mutations.forEach(mutation => {
          mutation.addedNodes.forEach(node => {
            if (node.nodeName === 'SCRIPT' && node.innerText.indexOf('window.displayInitialize') !== -1) {
              // brutely extract info from DOM
              let found
              const findHead = setInterval(() => {
                if (!found && window.displayInitialize) {
                  found = true
                  extractViewInfo(window.displayInitialize.toString())
                  commit('GAME_UPDATE', window.Game)
                  log('ViewInfo found')
                } else if (document.querySelector('#submenu')) {
                  new window.MutationObserver(mutations => {
                    mutations.forEach(mutation => {
                      commit('VIEW_UPDATE', { subOpen: /open/.test(mutation.target.className) })
                    })
                  }).observe(document.querySelector('#submenu'), {attributes: true})
                  clearInterval(findHead)
                }
              }, 0)
              headWatcher.disconnect()
            }
          })
        })
      })
      headWatcher.observe(document.head, watcherConfig)
      htmlWatcher.disconnect()
    }
  })
  htmlWatcher.observe(document, watcherConfig)
}

export default domWatcher
