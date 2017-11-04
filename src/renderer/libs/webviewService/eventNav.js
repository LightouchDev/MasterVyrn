'use strict'

/**
 * Pass current URL to vuex
 */
function eventNav () {
  this.webview.addEventListener('did-navigate', (event) => {
    window.vue.$store.commit('CHANGE_URL', {
      'url': event.url
    })
  })
  this.webview.addEventListener('did-navigate-in-page', (event) => {
    window.vue.$store.commit('CHANGE_URL', {
      'url': event.url
    })
  })
}

export default eventNav
