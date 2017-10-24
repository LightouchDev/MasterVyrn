<template>
  <webview
    v-bind:src="gameURL"
    v-bind:preload="preloadPath"
    allowpopups
  >
  </webview>
</template>

<script>
import addWebviewEvent from './addWebviewEvent'
addWebviewEvent()

export default {
  computed: {
    gameURL () {
      return this.$store.state.Webview.gameURL
    },
    preloadPath () {
      return this.$store.state.Webview.preloadPath
    }
  }
}
</script>

<style lang="scss" scoped>
webview {
  width: 100%;
  height: calc(100vh - #{$mainHeaderHeight});
  min-width: 320px;
  max-width: 640px;
}
</style>
