'use strict'

import { assign, forEach, isUndefined } from 'lodash'

const state = {}

const isMain = typeof window === 'undefined'

if (isMain) {
  assign(state, global.importConfig())
}

const apply = {
  language (args) {
    global.i18n.locale = args
  }
}

const mutations = {
  CONFIG_UPDATE (state, payload) {
    assign(state, payload)
    forEach(apply, (value, key) => {
      if (!isUndefined(payload[key])) {
        value(payload[key])
      }
    })
    if (isMain) {
      global.applyConfig(payload)
    }
  }
}

export default {
  state,
  mutations
}
