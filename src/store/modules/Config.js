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
  UPDATE (state, payload) {
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

const actions = {
  DEFAULTS ({ commit }) {
    commit('UPDATE', global.configDefaults)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
