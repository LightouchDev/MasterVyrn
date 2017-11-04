(() => {
  'use strict'
  return new Promise(resolve => {
    resolve(window.deviceRatio)
  }).then(result => {
    return result
  })
})()
