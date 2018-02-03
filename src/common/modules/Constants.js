const state = {
  site: 'http://game.granbluefantasy.jp',
  url: ''
}

state.preloadPath = process.mainModule.filename.indexOf('app.asar') !== -1
  ? `file://${require('path').resolve(__dirname, 'preload.js')}`
  : `file://${require('path').resolve(__dirname, '../../../dist/electron/preload.js')}`

export default {
  state
}
