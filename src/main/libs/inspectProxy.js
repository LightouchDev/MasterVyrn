'use strict'

import HttpProxy from 'inspectproxy'

export default function (browserWindow) {
  const proxy = HttpProxy.createServer()
  proxy.decompress = false

  // Inspect response with html and json content only
  proxy.setResInspectCondition((clientRequest, remoteResponse) => {
    const contentType = remoteResponse.headers['content-type']
    if (contentType) {
      if (
        contentType.indexOf('text/html') !== -1 ||
        contentType.indexOf('application/json') !== -1
      ) {
        return true
      }
    }
    return false
  })
  // Inspect all request
  proxy.setReqInspectCondition(() => { return true })

  proxy.smartListen()

  // Generate PAC content dynamically
  function generatePAC () {
    return `
      function FindProxyForURL (url, host) {
        if (host === 'game.granbluefantasy.jp' || host === 'whatismyipaddress.com') {
          return 'PROXY localhost:${proxy.port}'
        }
        return 'DIRECT'
      }
    `
  }

  // Host a PAC file for this proxy
  proxy.on('httpService', (request, response) => {
    // Connection is 'keep-alive' by default, but we don't need it.
    response.setHeader('Connection', 'close')

    if (request.url === '/proxy.pac') {
      response.setHeader('Content-Type', 'application/x-ns-proxy-autoconfig')
      response.end(generatePAC())
    } else {
      response.end('Service OK!')
    }
  })

  proxy.on('getRequest', (request) => browserWindow.webContents.send('HTTPContent', 'request', request))
  proxy.on('getResponse', (response) => browserWindow.webContents.send('HTTPContent', 'response', response))

  return proxy
}
