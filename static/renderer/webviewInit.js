window.addEventListener('DOMContentLoaded', () => {
  const webview = document.querySelector('webview')
  webview.addEventListener('dom-ready', (evt) => {
    if (process.env.NODE_ENV === 'development') {
      console.log('WEBVIEW READY!')
      webview.openDevTools()
    }
    window.dataProxy.header.url = webview.getURL()
  })
  webview.addEventListener('did-navigate-in-page', (evt) => {
    window.dataProxy.header.url = evt.url
  })
})
