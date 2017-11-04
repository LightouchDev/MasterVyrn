<template>
  <div id="wrapper">
    <main-section></main-section>
  </div>
</template>

<script>
  import MainSection from './DefaultApplication/MainSection'
  import webviewService from './libs/webviewService'

  webviewService()

  export default {
    name: 'default-application',
    components: {
      MainSection
    }
  }
</script>

<style>
</style>
