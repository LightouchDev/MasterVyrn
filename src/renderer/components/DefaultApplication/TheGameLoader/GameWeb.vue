<template>
  <webview
    id="game-web"
    :src="site"
    :preload="preloadPath"
    allowpopups
  >
  </webview>
</template>

<script>
export default {
  data () {
    return {
      state: this.$store.state.Constants
    }
  },
  computed: {
    site () {
      return this.state.site
    },
    preloadPath () {
      return this.state.preloadPath
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
