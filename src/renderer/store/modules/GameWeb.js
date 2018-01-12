const state = {
  gameURL: 'http://game.granbluefantasy.jp/',
  preloadScript: 'file://' + require('path').join(__static, 'minified_preload.js'),
  partition: 'persist:main',
  url: ''
}

state.userAgent = (() => {
  return navigator.userAgent.replace(
    new RegExp(`(Electron|${require('../../../../package.json').name})\\/[\\d.]+\\s`, 'g'), '')
})()

export default {
  state
}
