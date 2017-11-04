'use strict'
/**
 * Overlay associate event go here
 */
function eventOverlay () {
  // Restore to default state when page start loading
  this.webview.addEventListener('did-navigate', () => {
    window.vue.$store.commit('DEFAULT_ELEMENTS')
  })

  // Clean placeholder of overlay when page loaded
  this.webview.addEventListener('did-finish-load', () => {
    window.vue.$store.commit('CLEAN_ELEMENTS')
  })
}

export default eventOverlay
