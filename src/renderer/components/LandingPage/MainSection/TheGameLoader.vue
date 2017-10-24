<template>
  <webview
    v-bind:src="gameURL"
    v-bind:preload="preloadPath"
    allowpopups
  >
  </webview>
</template>

<<script>
export default {
  data () {
    return {
      gameURL: 'http://game.granbluefantasy.jp/',
      preloadPath: 'file://' + require('path').join(__static, 'preload/preload.js')
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
