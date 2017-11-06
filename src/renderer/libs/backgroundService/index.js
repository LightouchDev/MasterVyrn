'use strict'

let BackgroundService = function () {
  this.globalVals()
}

BackgroundService.prototype.globalVals = function () {
  let {css} = JSON.parse(require('fs').readFileSync(require('path').join(__static, 'globals.json'), 'utf8'))
  for (let rule in css) {
    if (typeof css[rule] === 'string') {
      css[rule] = /px$/.test(css[rule]) ? parseInt(css[rule]) : css[rule]
    }
  }
  global.gCSS = css
}

export default () => {
  return new BackgroundService()
}
