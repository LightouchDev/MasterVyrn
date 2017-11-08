'use strict'

const path = require('path')
const fs = require('fs')
const UglifyES = require("uglify-es")
const glob = require('glob')
const postcss = require('postcss')
const del = require('del')

const processor = postcss([require('cssnano')])

const outputPath = path.join(__dirname,'../static')
const jsFiles = glob.sync(path.join(__dirname,'../src/static/**/*.js'))
const cssFiles = glob.sync(path.join(__dirname,'../src/static/**/*.css'))

/**
 * Minify css/js in `src/static` to `static` with "minified_" prefix.
 */
function staticMinify () {
  cleanUp().then(() => {
    minify.apply(this, arguments)
  })
}

/**
 * Remove previous generate files
 */
function cleanUp () {
  return new Promise((resolve, reject) => {
    del(path.join(__dirname,'../static/**/minified_*'), {cwd: outputPath}).then(paths => {
      console.log('These files would be deleted:\n ', paths.join('\n  '));
      console.log('')
      resolve()
    });
  })
}

function cssProcess () {
  return new Promise((resolve, reject) => {
    if (cssFiles[0]) {
      cssFiles.forEach((file, index, array) => {
        let css = fs.readFileSync(file, 'utf8')
        processor.process(css).then(result => {
          let basename = 'minified_' + path.basename(file)
          console.log('Generating...', basename)
          fs.writeFileSync(path.join(outputPath, basename), result.css)
          if (index === array.length - 1) { resolve() }
        })
      })
    } else {
      resolve()
    }
  })
}

function jsProcess (dev) {
  return new Promise((resolve, reject) => {
    if (jsFiles[0]) {
      jsFiles.forEach((file, index, array) => {
        let js = fs.readFileSync(file, 'utf8')
        let config = {
          warnings: dev === true,
          compress: {
            ecma: 6,
            side_effects: false,
            global_defs: {
              DEBUG: dev === true
            }
          },
          sourceMap: dev ? {url: 'inline'} : false,
        }
        let basename = 'minified_' + path.basename(file)
        let result = UglifyES.minify(js, config)
        console.log('Generating...', basename)
        if (dev && result.warnings) console.warn(result.warnings)
        fs.writeFileSync(path.join(outputPath, basename), result.code)
        if (index === array.length - 1) { resolve() }
      })
    } else {
      resolve()
    }
  })
}

const noFunc = () => {}

/**
 * Minify process
 * @param {callback} upResolve - Parent resolve callback
 * @param {callback} upReject  - Parent reject callback
 * @param {boolean}  dev       - Uglify debug info
 */
function minify (dev = false, upResolve = noFunc, upReject = noFunc) {
  Promise.all([cssProcess(), jsProcess(dev)])
    .then(() => {
      console.log('Minify finished!')
      upResolve()
    })
    .catch(err => {
      console.error(err)
      upReject()
    })
}

if (require.main === module) {
  process.argv.slice(2)[0] === '--dev'
    ? staticMinify(true)
    : staticMinify()
} else {
  module.exports = staticMinify
}
