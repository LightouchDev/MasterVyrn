'use strict'

import fs from 'fs'
import os from 'os'
import path from 'path'

const whiteListFunction = ['key', 'getItem', 'setItem', 'removeItem', 'clear', 'length']

const storage = {}
let proxyMethods = {}

function polyfill () {
  proxyMethods = {
    key (n) {
      if (typeof n !== 'number') throw new Error('Parameter is number only.')
      return Object.keys(storage)[n]
    },
    getItem (key) {
      if (typeof key !== 'string') throw new Error('Parameter is string only.')
      return storage[key] || null
    },
    setItem (key, value) {
      if (typeof key !== 'string') throw new Error('Parameter is string only.')
      if (typeof value === 'function') return
      if (typeof value !== 'string') value = value.toString()
      storage[key] = value
    },
    removeItem (key) {
      if (typeof key !== 'string') throw new Error('Parameter is string only.')
      delete storage[key]
    },
    length () {
      return Object.keys(storage).length
    },
    clear () {
      Object.keys(storage).forEach(key => delete storage[key])
    }
  }
}

export default (obj, actions) => {
  if (typeof obj !== 'object') throw new Error('Parameter is object only.')
  if (typeof window === 'undefined') {
    // nodejs polyfill
    polyfill()

    const preset = {
      path: path.join(os.homedir(), require('../../package.json').name + '.json')
    }

    // filter options
    obj = Object.assign(Object.assign({}, preset), obj)

    // import saved storage
    const fd = fs.openSync(obj.path, 'r+')
    if (fd !== null) {
      Object.assign(storage, JSON.parse(fs.readFileSync(fd, 'utf8')))
      fs.closeSync(fd)
    }

    // passing storage
    obj = storage
  } else {
    // workaround to prevent get raw json data
    proxyMethods = {
      getItem (key) {
        return this[key]
      },
      setItem (key, value) {
        this[key] = value
      }
    }
  }
  return new Proxy(obj, {
    get (target, property, receiver) {
      if (proxyMethods[property] !== undefined) {
        return proxyMethods[property].bind(receiver)
      }
      if (typeof target[property] === 'function') {
        return target[property].bind(target) // bug: nodejs/node#11629
      }
      try {
        return JSON.parse(target[property])
      } catch (error) {
        return target[property]
      }
    },
    set (target, property, value, receiver) {
      if (typeof value === 'function') {
        if (whiteListFunction.some(func => property === func)) {
          proxyMethods[property] = value
        } else {
          target[property] = value
        }
        return true
      } else {
        try {
          if (property === 'debug') return true
          target[property] = JSON.stringify(value)
          if (actions && actions[property]) actions[property](value)
          return true
        } catch (error) {
          throw error
        }
      }
    }
  })
}
