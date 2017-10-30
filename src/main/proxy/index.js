'use strict'

// backup HOME path
let originHome = Object.assign({}, {HOME: process.env.HOME})

// enforce set HOME path to application userData path
process.env.HOME = require('electron').app.getPath('userData')

const AnyProxy = require('anyproxy')

// Generate certs
// FIXME: make electron to use these cert
if (!AnyProxy.utils.certMgr.ifRootCAFileExists()) {
  AnyProxy.utils.certMgr.generateRootCA((error, keyPath) => {
    if (!error) {
      const certDir = require('path').dirname(keyPath)
      console.log('The cert is generated at', certDir)
    } else {
      console.error('error when generating rootCA', error)
    }
  })
}

let options = {
  port: 8001,
  rule: require('./rules').default,
  forceProxyHttps: false,
  silent: true
}
if (process.env.NODE_ENV === 'development') {
  Object.assign(options, {
    webInterface: {
      enable: true,
      webPort: 8002,
      wsPort: 8003
    }
  })
}

const proxyInit = customOptions => {
  if (customOptions) {
    Object.assign(options, customOptions)
  }
  let proxyServer = new AnyProxy.ProxyServer(options)
  Object.assign(process.env, originHome)
  return proxyServer
}

export default proxyInit
