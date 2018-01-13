'use strict'

import { init } from './libs/utils'
import domWatcher from './libs/domWatcher'

(() => {
  if (window.location.hostname.indexOf('game.granbluefantasy.jp') !== -1) {
    init()
    domWatcher()
    window.process = undefined
  }
})()
