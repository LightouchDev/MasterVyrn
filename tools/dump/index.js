'use strict'

const fs = require('fs-extra')
const path = require('path')
const HttpProxy = require('inspectproxy')
const urlParser = require('url-parser')

const proxy = HttpProxy.createServer()
const regex = /(?:game(?:-\w+)?\.granbluefantasy\.jp)|(?:gbf\.game(?:-\w+)?\.mbga\.jp)/

const targetFolder = process.env.targetFolder || 'collected'

// Inspect response with game content only
proxy.setResInspectCondition((clientRequest, remoteResponse) => {
  return regex.test(clientRequest.url)
})

proxy.smartListen(55688)

function promiseProcess (exists, name, ext, dir, response) {
  let append = 0
  return new Promise(resolve => {
    if (exists) {
      const filePattern = new RegExp(`${name}(?:-(\\d+))?${ext}`)
      fs.readdirSync(dir).forEach(file => {
        const result = filePattern.exec(path.basename(file))
        if (result) {
          if (fs.readFileSync(path.join(dir, file)).compare(response.body) !== 0) {
            const num = Number(result[1] || 0)
            num > append && (append = num + 1)
            resolve(append)
          }
        }
      })
    } else {
      resolve()
    }
  })
}

// get response body and save
proxy.on('getResponse', (response) => {
  let { pathname } = urlParser(response.url)
  pathname === '/' && (pathname += 'index.html')
  pathname = pathname.replace(/^\//, '')
  if (pathname.indexOf('assets/') === 0 || pathname === 'index.html') {
    const outputPath = path.resolve(targetFolder, pathname)
    const { dir, name, ext } = path.parse(outputPath)
    fs.pathExists(outputPath, (error, exists) => {
      if (error) { console.error(error) }
      promiseProcess(exists, name, ext, dir, response).then(append => {
        const fileName = append ? `${name}-${append}${ext}` : `${name}${ext}`
        if (exists && append === 0) {
          console.log('  exists:', path.join(path.dirname(pathname), fileName))
        } else {
          console.log('new file:', path.join(path.dirname(pathname), fileName))
          fs.outputFile(path.resolve(dir, fileName), response.body, (error) => {
            if (error) { console.error(error) }
          })
        }
      }).catch(reason => { console.error(reason) })
    })
  }
})

// Access port when start listening
proxy.once('listening', () => {
  console.log(`Proxy listen on ${proxy.port}`)
})
