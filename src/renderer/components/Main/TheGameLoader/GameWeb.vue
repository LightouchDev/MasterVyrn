<template>
  <webview
    id="game-web"
    :src="Constants.site"
    :preload="'file://' + Constants.preload"
    allowpopups
  />
</template>

<script>
import { mapState } from 'vuex'
export default {
  computed: mapState({
    Constants: 'Constants' // fetch state.Constants into this.state
  })
}
</script>

<style lang="scss">
#game-web{
  height: 100vh;
  z-index: 1;
}
</style>
