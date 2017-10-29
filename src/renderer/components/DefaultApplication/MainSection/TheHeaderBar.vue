<template>
  <div id="parent">
    <div id="icon"><img :src="favicon"></div>
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
  color: rgba($standardWhite, 0.75);
  height: $mainHeaderHeight;
  background-color: #150f0f;
  display: flex;
  align-items: center;
  pointer-events: none;
  > * {
    padding: 0 $paddingWidth;
  }
  #icon {
    img {
      vertical-align: middle;
    }
  }
  #url {
    overflow-x: hidden;
    width: 100%;
    height: $mainHeaderHeight - 2*$paddingWidth;
    margin-right: $paddingWidth;
    span {
      vertical-align: middle;
    }
  }
  #url, #icon img {
    border-style: solid;
    border-width: thin;
    border-radius: 3px;
    border-color: rgba($standardWhite, 0.75);

  }
}
</style>

