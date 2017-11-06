'use strict'

/**
 * Pass current URL to vuex
 */
function eventNav () {
  this.webview.addEventListener('did-navigate', (event) => {
    window.vue.$store.commit('CHANGE_URL', event.url)
    window.vue.$store.commit('CLEAN_CLASS')
  })
  this.webview.addEventListener('did-navigate-in-page', (event) => {
    window.vue.$store.commit('CHANGE_URL', event.url)
  })
}

export default eventNav
