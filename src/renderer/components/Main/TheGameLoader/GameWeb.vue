<template>
  <webview
    id="game-web"
    :src="state.site"
    :preload="state.preloadPath"
    allowpopups
  />
</template>

<script>
export default {
  data () {
    return {
      state: this.$store.state.Constants
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
