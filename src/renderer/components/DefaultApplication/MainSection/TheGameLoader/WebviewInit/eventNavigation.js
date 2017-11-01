'use strict'

function eventNavigation () {
  this.webview.addEventListener('did-navigate', (evt) => {
    window.vue.$store.commit('CHANGE_URL', {
      'url': evt.url
    })
  })
  this.webview.addEventListener('did-navigate-in-page', (evt) => {
    window.vue.$store.commit('CHANGE_URL', {
      'url': evt.url
    })
  })
}

export default eventNavigation
