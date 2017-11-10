<template>
  <div id="the-header-bar">
    <div id="icon"><img :src="favicon"></div>
    <div id="url"><span>{{currentPath}}</span></div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      state: this.$store.state.GameWeb
    }
  },
  computed: {
    url () {
      return new window.URL(this.state.url ? this.state.url : this.state.gameURL)
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

<style lang="scss">
$paddingWidth: $mainHeaderHeight - 32px;

/* hasHeader Setting */
.hasHeader #the-header-bar{
  display:flex;
}

#the-header-bar {
  color: rgba($standardWhite, 0.75);
  height: $mainHeaderHeight;
  background-color: $standardBlack;
  display: none;
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

