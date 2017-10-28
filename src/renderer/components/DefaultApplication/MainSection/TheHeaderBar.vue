<template>
  <div id="parent">
    <img id="icon" :src="favicon">
    <div id="url"><span>{{currentPath}}</span></div>
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
$paddingWidth: $mainHeaderHeight - 32px;

#parent {
  color: #f2eee2;
  height: $mainHeaderHeight;
  background-color: #150f0f;
  display: flex;
  align-items: center;
  > * {
    padding: 0 $paddingWidth;
  }
  #icon {
    vertical-align: middle;
  }
  #url {
    overflow-x: hidden;
    width: 100%;
    height: $mainHeaderHeight - 2*$paddingWidth;
    border-style: solid;
    border-width: thin;
    border-radius: 4px;
    margin-right: $paddingWidth;
    span {
      vertical-align: middle;
    }
  }
}
</style>

