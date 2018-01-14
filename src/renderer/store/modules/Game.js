const state = {}

const mutations = {
  GAME_UPDATE (state, payload) {
    Object.assign(state, payload)
  }
}

export default {
  state,
  mutations
}
