import { ipcRenderer, remote } from 'electron'
import { oneshotListener } from '../../common/utils'
import { log } from './utils'

log(`%s page start!`, window.performance.now().toFixed(2))

// prevent alert popup when resize cause frequency reload
const _alert = window.alert
window.alert = () => {}

/*
* Close child window, send URL to host when login success via non-mobage account
*/
if (remote.getCurrentWebContents().getType() !== 'webview') {
  ipcRenderer.send('webviewRefresh', window.location.href)
  window.close()
}

oneshotListener(window, 'DOMContentLoaded', () => {
  // remove scaler patch to keep image quality
  const ChromeVersion = Number(/Chrome\/(\d+)\./.exec(navigator.userAgent)[1])
  if (ChromeVersion < 61) {
    log('Chrome(%s) is less than 61, remove scaler patch.', ChromeVersion)
    const html = document.documentElement
    html.setAttribute('style', html.getAttribute('style').replace(/zoom: \d;/, ''))
  }
  log('DOM parsed')
})

oneshotListener(window, 'load', () => {
  log('DOM ready')
  // restore alert
  window.alert = _alert
})
