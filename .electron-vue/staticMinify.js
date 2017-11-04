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

let noFunc = () => {}
let cssSum = {}

/**
 * Minify js in `src/static` to `static` with "uglified_" prefix.
 * css would minified (by cssnano) and stored as javascript variable (as same as filename),
 * uglifyES would replace these variable by actual content.
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
    del(path.join(__dirname,'../static/**/uglified_*'), {cwd: outputPath}).then(paths => {
      console.log('These files would be deleted:\n ', paths.join('\n  '));
      console.log('')
      resolve()
    });
  })
}

/**
 * Minify process
 * @param {callback} upResolve - Parent resolve callback
 * @param {callback} upReject  - Parent reject callback
 * @param {boolean}  dev       - Uglify debug info
 */
function minify (upResolve = noFunc, upReject = noFunc, dev = false) {

  let cssProcess = new Promise((resolve, reject) => {
    cssFiles.forEach((file, index, array) => {
      let css = fs.readFileSync(file, 'utf8')
      let basename = path.basename(file, '.css')
      processor.process(css).then(result => {
        Object.assign(cssSum, {[basename]: result.css})
        if (index === array.length - 1) { resolve() }
      })
    })
  })

  cssProcess.then(() => {
    jsFiles.forEach((file, index, array) => {
      let js = fs.readFileSync(file, 'utf8')
      let basename = 'uglified_' + path.basename(file)
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
      Object.assign(config.compress.global_defs, cssSum)
      let result = UglifyES.minify(js, config)
      console.log('Generating...', basename)
      if (dev && result.warnings) console.warn(result.warnings)
      fs.writeFileSync(path.join(outputPath, basename), result.code)
      if (index === array.length - 1) {
        console.log('Minify finished!')
        upResolve()
      }
    })
  })
}

if (require.main === module) {
  staticMinify()
} else {
  module.exports = staticMinify
}
