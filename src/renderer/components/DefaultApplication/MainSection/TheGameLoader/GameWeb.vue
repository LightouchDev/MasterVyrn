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

.notJssdk #game-web {
  width: 100vw;
  margin-left: 0;
}

#game-web{
  width: calc(100vw + #{$mbgaPadding});
  height: 100vh;
  min-width: 320px + $webviewPadding;
  max-width: 640px + $webviewPadding;
  margin-left: -$mbgaPadding;
  z-index: 1;
}
</style>
