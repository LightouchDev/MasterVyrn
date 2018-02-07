import { assign } from 'lodash'

const state = {}

const mutations = {
  GAME_UPDATE (state, payload) {
    assign(state, payload)
  }
}

export default {
  state,
  mutations
}
