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
  },
  NOT_JSSDK (state) {
    state.cleanClass = false
    state.notJssdk = true
  },
  CLEAN_CLASS (state) {
    state.cleanClass = true
  }
}

export default {
  state,
  mutations
}
