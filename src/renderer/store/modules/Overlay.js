const state = {
  zoom: 1,
  covers: [],
  data: {}
}

const mutations = {
  SET_ZOOM (state, payload) {
    state.zoom = payload
  },
  CLEAN_COVER (state, payload) {
    state.covers = []
  },
  CREATE_NODE (state, payload) {
    const {id, className, data, preset, style} = payload
    if (!state.data[preset]) { state.data[preset] = {} }
    Object.assign(state.data[preset], {[id]: data})
    state.covers.push({id, className, preset, style})
  }
}

export default {
  state,
  mutations
}
