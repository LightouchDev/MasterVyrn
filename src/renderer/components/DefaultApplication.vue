<template>
  <div id="wrapper">
    <main-section></main-section>
  </div>
</template>

<script>
import MainSection from './DefaultApplication/MainSection'

import webviewService from '../libs/webviewService'
import webContentsSetup from '../libs/webContentsSetup'

// prevent unexpected drag and drop event
document.addEventListener('dragover', event => event.preventDefault())
document.addEventListener('drop', event => event.preventDefault())

window.addEventListener('DOMContentLoaded', () => {
  webviewService()
  webContentsSetup()
})

export default {
  name: 'default-application',
  components: {
    MainSection
  }
}
</script>

<style>
body {
  overflow: hidden;
}
</style>
