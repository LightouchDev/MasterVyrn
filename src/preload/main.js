'use strict'

if (location.hostname.indexOf('game.granbluefantasy.jp') !== -1) {
  require('./libs/init')
  require('./libs/domWatcher')
  window.process = undefined
}
