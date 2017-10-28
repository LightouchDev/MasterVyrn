<template>
  <webview
    :src="gameURL"
    :preload="preloadScript"
    :partition="partition"
    allowpopups
  >
  </webview>
</template>

<script>
import WebviewInit from './WebviewInit'
WebviewInit()

export default {
  computed: {
    gameURL () {
      return this.$store.state.Webview.gameURL
    },
    preloadScript () {
      return this.$store.state.Webview.preloadScript
    },
    partition () {
      return this.$store.state.Webview.partition
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
