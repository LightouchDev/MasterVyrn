'use strict'

const whiteListFunction = ['key', 'getItem', 'setItem', 'removeItem', 'clear', 'length']
const whiteListProperty = ['debug']

let proxyMethods = {
  getItem (key) {
    return this[key]
  },
  setItem (key, value) {
    this[key] = value
  }
}

export default (storage, actions) => {
  if (typeof storage !== 'object') throw new Error('Parameter is object only.')
  return new Proxy(storage, {
    get (target, property, receiver) {
      if (proxyMethods[property] !== undefined) {
        return proxyMethods[property].bind(receiver)
      }
      if (typeof target[property] === 'function') {
        return target[property].bind(target) // bug: nodejs/node#11629
      }
      try {
        return JSON.parse(target.getItem(property))
      } catch (error) {}
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
          if (whiteListProperty.some(prop => property === prop)) return true
          target.setItem(property, JSON.stringify(value))
          if (actions && actions[property]) actions[property](value)
          return true
        } catch (error) {
          throw error
        }
      }
    }
  })
}
