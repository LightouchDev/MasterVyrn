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
  data () {
    return {
      state: this.$store.state.Webview
    }
  },
  computed: {
    gameURL () {
      return this.state.gameURL
    },
    preloadScript () {
      return this.state.preloadScript
    },
    partition () {
      return this.state.partition
    }
  }
}
</script>

<style lang="scss" scoped>
webview{
  width: 100%;
  height: calc(100vh - #{$mainHeaderHeight});
  min-width: 320px;
  max-width: 640px;
  z-index: 1;
}
</style>
