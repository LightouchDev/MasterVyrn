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
  log('DOM parsed')
})

oneshotListener(window, 'load', () => {
  log('DOM ready')
  // restore alert
  window.alert = _alert
})
