'use strict'

import { commit, log, hostLog, sendToHost } from './utils'

function extractViewInfo (content) {
  try {
    commit('VIEW_UPDATE', {
      baseWidth: window.Game.actualPexWidth / 2,
      isJssdkSideMenu: window.Game.ua.isJssdkSideMenu()
    })
  } catch (error) {}

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
    const match = /^[ \t]+deviceRatio = \(window\.outerWidth - sideMenuWidth - (\d+)\) \/ (\d+);/m.exec(content)
    if (match) {
      const sideMenuWidth = /^[ \t]+var sideMenuWidth = (.*);/m.exec(content)
      commit('VIEW_UPDATE', {
        login: true,
        autoResize: true,
        sidePadding: Number(sideMenuWidth && sideMenuWidth[1]),
        unknownPadding: Number(match[1]),
        baseSize: Number(match[2]),
        subMenuWidth: Number(match[2] - 640) // each
      })
      /* eslint-disable no-tabs */
    } else if (content.indexOf('	deviceRatio') !== -1) {
      // when view is not responsive
      commit('VIEW_RESET')
      commit('VIEW_UPDATE', {
        login: true,
        zoom: Number(/^[ \t]+deviceRatio = ([\d.]+);/m.exec(content)[1])
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
                  const submenu = document.querySelector('#submenu')
                  new window.MutationObserver(mutations => {
                    commit('VIEW_UPDATE', { subOpen: /open/.test(submenu.className) })
                  }).observe(submenu, {attributes: true})
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
