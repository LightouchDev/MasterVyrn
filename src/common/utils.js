'use strict'

import debug from 'debug'

/**
 * Oneshot event listener
 * @param   {object}    element     - html element
 * @param   {string}    event       - event
 * @param   {function}  callback    - callback
 * @param   {boolean}   useCapture  - useCapture
 */
function oneshotListener (element, event, callback, useCapture) {
  element.addEventListener(event, function handler (event) {
    this.removeEventListener(event.type, handler)
    return callback(event)
  }, useCapture)
}

const DEV = process.env.NODE_ENV === 'development'
const log = debug('MasterVyrn:log')
const err = debug('MasterVyrn:err')

export { DEV }
export { oneshotListener, log, err }
