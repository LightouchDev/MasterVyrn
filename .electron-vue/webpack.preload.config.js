'use strict'

process.env.BABEL_ENV = 'preload'

const path = require('path')
const { dependencies } = require('../package.json')
const webpack = require('webpack')

const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

let preloadConfig = {
  devtool: '#cheap-module-eval-source-map',
  entry: {
    preload: path.join(__dirname, '../src/preload/main.js')
  },
  externals: [
    ...Object.keys(dependencies || {})
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        enforce: 'pre',
        exclude: /node_modules/,
        use: {
          loader: 'eslint-loader',
          options: {
            formatter: require('eslint-friendly-formatter')
          }
        }
      },
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.node$/,
        use: 'node-loader'
      }
    ]
  },
  node: {
    __dirname: process.env.NODE_ENV !== 'production',
    __filename: process.env.NODE_ENV !== 'production'
  },
  plugins: [
    new webpack.NoEmitOnErrorsPlugin()
  ],
  output: {
    filename: '[name].js',
    libraryTarget: 'commonjs2',
    path: path.join(__dirname, '../dist/electron')
  },
  resolve: {
    extensions: ['.js', '.json', '.node']
  },
  target: 'electron-main'
}

/**
 * Adjust preloadConfig for production settings
 */
if (process.env.NODE_ENV === 'production') {
  preloadConfig.devtool = ''

  preloadConfig.plugins.push(
    new UglifyJsPlugin({
      parallel: true,
      uglifyOptions: {
        ecma: 6,
        parse: {
          ecma: 8
        },
        compress : {
          passes: 4,
          toplevel: true,
          collapse_vars: false
        }
      }
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"production"'
    })
  )
  delete preloadConfig.externals
}

module.exports = preloadConfig
