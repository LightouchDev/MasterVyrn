const state = {
  gameURL: 'http://game.granbluefantasy.jp/',
  notJssdk: false,
  cleanClass: true,
  preloadScript: 'file://' + require('path').join(__static, 'minified_preload.js'),
  partition: 'persist:main',
  url: ''
}

const mutations = {
  CHANGE_URL (state, payload) {
    state.url = new window.URL(payload)
  }
}

export default {
  state,
  mutations
}
