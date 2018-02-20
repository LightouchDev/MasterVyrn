import { assign } from 'lodash'

const state = {
  optionOpen: false
}

const mutations = {
  UPDATE (state, payload) {
    assign(state, payload)
  }
}

const actions = {
  UPDATE ({ commit }, payload) {
    commit('UPDATE', payload)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
