<template>
  <div id="wrapper">
    <the-option-layer/>
    <the-game-loader/>
  </div>
</template>

<script>
import TheGameLoader from './Main/TheGameLoader'

// prevent unexpected drag and drop event
document.addEventListener('dragover', event => event.preventDefault())
document.addEventListener('drop', event => event.preventDefault())

function lazyLoading () {
  import(
    /* webpackChunkName: "webviewSetup" */
    './Main/webviewSetup'
  )
  import(
    /* webpackChunkName: "webContentsSetup" */
    './Main/webContentsSetup'
  )
}

// lazyLoading would be too lazy to register before dom ready
switch (document.readyState) {
  case 'loading':
    // if it's really slow that page is still loading
    window.addEventListener('DOMContentLoaded', lazyLoading)
    break
  case 'interactive':
  case 'complete':
    lazyLoading()
    break
}

export default {
  name: 'default-application',
  components: {
    TheGameLoader,
    TheOptionLayer: () => import(
      /* webpackChunkName: "TheOptionLayer" */
      './Main/TheOptionLayer'
    )
  }
}
</script>

<style>
body {
  overflow: hidden;
}
</style>
