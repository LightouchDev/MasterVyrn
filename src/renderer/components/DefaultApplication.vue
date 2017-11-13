<template>
  <div id="wrapper">
    <main-section></main-section>
  </div>
</template>

<script>
  import MainSection from './DefaultApplication/MainSection'
  import windowManager from '../libs/windowManager'
  import webviewService from '../libs/webviewService'
  import shortcutService from '../libs/shortcutService'

  window.addEventListener('DOMContentLoaded', () => {
    global.webviewService = new webviewService()
  })
  global.windowManager = new windowManager()
  shortcutService()

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
