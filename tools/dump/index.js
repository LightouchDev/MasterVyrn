'use strict'

const fs = require('fs-extra')
const path = require('path')
const exec = require('child_process').exec
const urlParser = require('url-parser')
const debug = require('debug')
const log = debug('dump:log')
// const warn = debug('dump:warn')
const err = debug('dump:err')

const proxy = require('inspectproxy').createServer()
const regex = /(?:game(?:-\w+)?\.granbluefantasy\.jp)|(?:gbf\.game(?:-\w+)?\.mbga\.jp)/

const targetFolder = process.env.targetFolder || 'collected'
const applyPrettier = process.env.applyPrettier || false

const yarn = process.platform === 'win32' ? 'yarn.cmd' : 'yarn'

// Inspect response with game content only
proxy.setResInspectCondition((clientRequest, remoteResponse) => {
  return regex.test(clientRequest.url)
})

proxy.smartListen(Number(process.env.listenPort) || 8000)

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
          }
        }
      })
      resolve(append)
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
      if (error) { err(error) }
      promiseProcess(exists, name, ext, dir, response).then(append => {
        const fileName = append ? `${name}-${append}${ext}` : `${name}${ext}`
        fs.pathExists(path.resolve(dir, fileName), (error, exists) => {
          if (error) { err(error) }
          if (exists) {
            log('  exists: %s', path.join(path.dirname(pathname), fileName))
          } else {
            log('new file: %s', path.join(path.dirname(pathname), fileName))
            fs.outputFile(path.resolve(dir, fileName), response.body, (error) => {
              if (error) { err(error) }
            })
            const extractFilename = /^assets\/\d+\/(.*)$/.exec(pathname)
            if (applyPrettier && extractFilename) {
              const extractPath = path.resolve(targetFolder, 'prettified', extractFilename[1])
              fs.outputFile(extractPath, response.body, (error) => {
                if (error) { err(error) }
                exec(`${yarn} -s prettier-standard ${extractPath}`, { windowsHide: true }, (error, stdout, stderr) => {
                  if (error) err(stderr)
                  if (stdout) log(stdout)
                })
              })
            }
          }
        })
      }).catch(reason => err(reason))
    })
  } else {
    log('  bypass: %s', pathname)
  }
})

// Access port when start listening
proxy.once('listening', () => {
  console.log(`Proxy listen on ${proxy.port}`)
  console.log('Output folder:', path.resolve(targetFolder))
})
