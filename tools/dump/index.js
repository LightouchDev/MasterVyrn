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
const threads = process.env.threads || require('os').cpus().length - 1
const versionFile = path.resolve(targetFolder, 'version.txt')

const yarn = process.platform === 'win32' ? 'yarn.cmd' : 'yarn'
const queue = {}
const task = {}
let assetVersion = 0
let fsIsReady = true

try {
  assetVersion = Number(fs.readFileSync(versionFile, 'utf8'))
} catch (error) {}

function taskRunner () {
  if (fsIsReady && Object.keys(task).length < threads && queue[assetVersion] && queue[assetVersion].length) {
    // if queue is not empty and running task is lower than logic cpu count
    const child = exec(
      `${yarn} -s prettier-standard ${queue[assetVersion].shift()}`,
      { windowsHide: true },
      (error, stdout, stderr) => {
        if (error) err(stderr)
        if (stdout) log(stdout)
      }
    )

    task[child.pid] = {
      version: assetVersion,
      kill: child.kill
    }

    child.once('exit', () => {
      // Remove current task and re-run taskRunner after task finished
      delete task[child.pid]
      taskRunner()
    })
    // self fill all task slot
    taskRunner()
  }
}

function checkAssets (pathname) {
  return new Promise(resolve => {
    const extractFilename = /^assets\/(\d+)\/(.*)$/.exec(pathname)
    if (extractFilename) {
      const outputPath = path.resolve(targetFolder, 'currentAssets', extractFilename[2])
      const currentVersion = Number(extractFilename[1])
      if (assetVersion < currentVersion) {
        // close all new incoming task
        fsIsReady = false
        // if new version pending, then clean all current assets, but not include static assets.
        fs.emptyDirSync(path.resolve(targetFolder, 'currentAssets', 'js'))
        fs.emptyDirSync(path.resolve(targetFolder, 'currentAssets', 'css'))
        fs.emptyDirSync(path.resolve(targetFolder, 'prettified'))
        // clean all pending queue and kill all current running task that belong to old version.
        Object.keys(queue).forEach(version => {
          if (version && version !== currentVersion) {
            delete queue[version]
          }
        })
        Object.keys(task).forEach(pid => {
          if (pid && pid.version !== currentVersion) {
            pid.kill()
            delete task[pid]
          }
        })
        // update version info
        assetVersion = currentVersion
        fs.writeFile(versionFile, currentVersion, error => { if (error) err(error) })
        // file system is ready
        fsIsReady = true
      }
      resolve({
        extractFilename,
        outputPath,
        currentVersion
      })
    } else {
      resolve({
        outputPath: path.resolve(targetFolder, pathname.replace(/^assets\//, 'currentAssets/'))
      })
    }
  })
}

// Inspect response with game content only
proxy.setResInspectCondition((clientRequest, remoteResponse) => {
  return regex.test(clientRequest.url)
})

proxy.smartListen(Number(process.env.listenPort) || 8000)

// get response body and save
proxy.on('getResponse', (response) => {
  let { pathname } = urlParser(response.url)
  pathname === '/' && (pathname += 'index.html')
  pathname = pathname.replace(/^\//, '')
  if (response.body.length && (pathname.indexOf('assets/') === 0 || pathname === 'index.html')) {
    checkAssets(pathname).then(result => {
      fs.pathExists(result.outputPath, (error, exists) => {
        if (error) { err(error) }
        if (exists && fs.readFileSync(result.outputPath).compare(response.body) === 0) {
          log('Exists: %s', pathname)
        } else {
          log('Create: %s', pathname)
          fs.outputFile(result.outputPath, response.body, (error) => {
            if (error) { err(error) }
          })
          if (applyPrettier && result.extractFilename && /^js\/|^css\//.test(result.extractFilename[2])) {
            const extractPath = path.resolve(targetFolder, 'prettified', result.extractFilename[2])
            fs.outputFile(extractPath, response.body, (error) => {
              if (error) { err(error) }
              if (queue[result.currentVersion] === undefined) {
                queue[result.currentVersion] = []
              }
              queue[result.currentVersion].push(extractPath)
              taskRunner()
            })
          }
        }
      })
    })
  } else {
    log('Bypass: %s', pathname)
  }
})

// Access port when start listening
proxy.once('listening', () => {
  console.log(`Proxy listen on ${proxy.port}`)
  console.log('Output folder:', path.resolve(targetFolder))
})
