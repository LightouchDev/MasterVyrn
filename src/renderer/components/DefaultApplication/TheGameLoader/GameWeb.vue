<template>
  <webview
    id="game-web"
    :src="gameURL"
    :preload="preloadScript"
    :partition="partition"
    :useragent="userAgent"
    allowpopups
  >
  </webview>
</template>

<script>
export default {
  data () {
    return {
      state: this.$store.state.GameWeb
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
    },
    userAgent () {
      return this.state.userAgent
    }
  }
}
</script>

<style lang="scss">
#game-web{
  height: 100vh;
  z-index: 1;
}
</style>
