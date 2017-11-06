<template>
  <div id="wrapper">
    <main-section></main-section>
  </div>
</template>

<script>
  import MainSection from './DefaultApplication/MainSection'
  import backgroundService from '../libs/backgroundService'
  import webviewService from '../libs/webviewService'

  backgroundService()
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
