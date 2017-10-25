'use strict'

function addWebviewEvent () {
  window.addEventListener('DOMContentLoaded', () => {
    const webview = document.querySelector('webview')
    webview.addEventListener('dom-ready', () => {
      if (process.env.NODE_ENV === 'development') {
        console.log('WEBVIEW READY!')
        webview.openDevTools()
      }
    })
    webview.addEventListener('did-navigate', (evt) => {
      window.vue.$store.commit('CHANGE_URL', {
        'url': evt.url
      })
    })
    webview.addEventListener('did-navigate-in-page', (evt) => {
      window.vue.$store.commit('CHANGE_URL', {
        'url': evt.url
      })
    })
  })
}

export default addWebviewEvent
