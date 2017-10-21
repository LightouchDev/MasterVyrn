<template>
  <div id="headerBar">
    <div class="tr">
      <div class="td" id="section">
        <img v-bind:src="favicon">
      </div>
      <div class="td" id="currentPath">{{currentPath}}</div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      header: window.dataProxy.header
    }
  },
  computed: {
    url () {
      return new URL(this.header.url)
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
#headerBar {
  display: table;
  color: #f2eee2;
  position: relative;
  width: 100%;
  height: $mainHeaderHeight;
  background-color: #150f0f;
  font-family: $headerFont;
  .td {
    vertical-align: middle;
    &#section {
      width: 40px;
      img {
        display: block;
        margin: auto;
      }
    }
    &#currentPath {
      padding: 0 10px;
      letter-spacing: 1px;
    }
  }
}
</style>

