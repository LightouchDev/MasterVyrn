const state = {
  gameURL: 'http://game.granbluefantasy.jp/',
  preloadScript: 'file://' + require('path').join(__static, 'minified_preload.js'),
  partition: 'persist:main',
  url: ''
}

export default {
  state
}
