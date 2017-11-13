<template>
  <div id="wrapper">
    <main-section></main-section>
  </div>
</template>

<script>
  import MainSection from './DefaultApplication/MainSection'
  import WindowManager from '../libs/windowManager'
  import WebviewService from '../libs/webviewService'
  import shortcutService from '../libs/shortcutService'

  window.addEventListener('DOMContentLoaded', () => {
    global.webviewService = new WebviewService()
  })
  global.windowManager = new WindowManager()
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
