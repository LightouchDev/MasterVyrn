'use strict'

const state = {}

const isMain = typeof window === 'undefined'

if (isMain) {
  Object.assign(state, global.importConfig())
}

const apply = {
  language (args) {
    global.i18n.locale = args
  }
}

const mutations = {
  CONFIG_UPDATE (state, payload) {
    Object.assign(state, payload)
    Object.keys(apply).forEach(key => {
      if (payload[key] !== undefined) {
        apply[key](payload[key])
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
