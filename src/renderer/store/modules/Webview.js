const state = {
  gameURL: 'http://game.granbluefantasy.jp/',
  url: '',
  preloadScript: 'file://' + require('path').join(__static, 'preload/index.js')
}

const mutations = {
  CHANGE_URL (state, payload) {
    state.url = new window.URL(payload.url)
  }
}

export default {
  state,
  mutations
}
