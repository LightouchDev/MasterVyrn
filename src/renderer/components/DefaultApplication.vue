<template>
  <div id="wrapper">
    <main-section></main-section>
  </div>
</template>

<script>
  import MainSection from './DefaultApplication/MainSection'
  import windowManager from '../libs/windowManager'
  import webviewService from '../libs/webviewService'

  windowManager()
  webviewService()

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
