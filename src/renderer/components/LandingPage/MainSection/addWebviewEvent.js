function addWebviewEvent () {
  window.addEventListener('DOMContentLoaded', () => {
    const webview = document.querySelector('webview')
    webview.addEventListener('dom-ready', (evt) => {
      if (process.env.NODE_ENV === 'development') {
        console.log('WEBVIEW READY!')
        webview.openDevTools()
      }
      window.vue.$store.commit('CHANGE_URL', {
        'url': webview.getURL()
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
