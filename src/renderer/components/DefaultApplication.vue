<template>
  <div id="wrapper">
    <the-option-layer/>
    <the-game-loader/>
  </div>
</template>

<script>
import TheGameLoader from './DefaultApplication/TheGameLoader'
import TheOptionLayer from './DefaultApplication/TheOptionLayer'

// prevent unexpected drag and drop event
document.addEventListener('dragover', event => event.preventDefault())
document.addEventListener('drop', event => event.preventDefault())

window.addEventListener('DOMContentLoaded', () => {
  require('../libs/webviewService')
  require('../libs/webContentsSetup')
})

export default {
  name: 'default-application',
  components: {
    TheGameLoader,
    TheOptionLayer
  }
}
</script>

<style>
body {
  overflow: hidden;
}
</style>
