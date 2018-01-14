const state = {
  gameURL: 'http://game.granbluefantasy.jp/',
  partition: 'persist:main',
  url: ''
}

state.userAgent = (() => {
  return navigator.userAgent.replace(
    new RegExp(`(Electron|${require('../../../../package.json').name})\\/[\\d.]+\\s`, 'g'), '')
})()

state.preloadScript = (() => {
  return process.mainModule.filename.indexOf('app.asar') !== -1
    ? `file://${require('path').resolve(__dirname, 'preload.js')}`
    : `file://${require('path').resolve(__dirname, '../../../../dist/electron/preload.js')}`
})()

export default {
  state
}
