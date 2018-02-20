import { assign } from 'lodash'

const state = {}

const mutations = {
  UPDATE (state, payload) {
    assign(state, payload)
  }
}

export default {
  namespaced: true,
  state,
  mutations
}
