<template>
  <webview
    id="game-web"
    :src="gameURL"
    :preload="preloadScript"
    :partition="partition"
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
    }
  }
}
</script>

<style lang="scss">
/* hasHeader Setting */
.hasHeader #game-web{
  height: calc(100vh - #{$mainHeaderHeight});
}

#game-web{
  width: calc(100vw + #{$sidebarPadding});
  height: 100vh;
  min-width: 320px + $sidebarPadding;
  max-width: 640px + $sidebarPadding;
  margin-left: -$sidebarPadding;
  z-index: 1;
}
</style>
