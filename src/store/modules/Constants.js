const state = {
  site: 'http://game.granbluefantasy.jp'
}

// run only once in main
if (typeof window === 'undefined') {
  state.preload = process.mainModule.filename.indexOf('app.asar') !== -1
    ? require('path').resolve(__dirname, 'preload.js')
    : require('path').resolve(__dirname, '../../../dist/electron/preload.js')
}

export default {
  state
}
