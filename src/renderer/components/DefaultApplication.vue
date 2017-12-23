<template>
  <div id="wrapper">
    <main-section></main-section>
  </div>
</template>

<script>
import MainSection from './DefaultApplication/MainSection'

import ipcService from '../libs/ipcService'
import WebviewService from '../libs/webviewService'
import shortcutService from '../libs/shortcutService'

window.addEventListener('DOMContentLoaded', () => {
  ipcService()
  WebviewService()
})
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
