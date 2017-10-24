<template>
  <div id="parent">
    <img id="icon" :src="favicon">
    <div id="url">{{currentPath}}</div>
  </div>
</template>

<script>
export default {
  computed: {
    url () {
      if (this.$store.state.Webview.url) {
        return new window.URL(this.$store.state.Webview.url)
      }
      return new window.URL(this.$store.state.Webview.gameURL)
    },
    currentPath () {
      return this.url.pathname + this.url.hash
    },
    favicon () {
      return this.url.origin + '/favicon.ico'
    }
  }
}
</script>

<style lang="scss" scoped>
#parent {
  color: #f2eee2;
  height: $mainHeaderHeight;
  background-color: #150f0f;
  font-family: $headerFont;
  display: flex;
  align-items: center;
  > * {
    padding: 0 $mainHeaderHeight - 32px;
  }
  #icon {
    vertical-align: middle;
  }
  #url {
    overflow-x: hidden;
  }
}
</style>

