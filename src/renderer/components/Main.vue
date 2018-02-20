<template>
  <div id="wrapper">
    <the-dashboard id="the-dashboard" :style="commonStyle"/>
    <the-sub-menu-bar id="the-sub-menu-bar" :style="commonStyle"/>
    <the-option-layer id="the-option-layer" :style="commonStyle"/>
    <the-game-loader id="the-game-loader"/>
  </div>
</template>

<style lang="scss">
body {
  overflow: hidden;
}

#the-dashboard {
  background: $standardBlack;
  width: 100%;
  min-width: 150px;
  max-width: 320px; // 1024 - 704
}
</style>

<script>
import TheGameLoader from './Main/TheGameLoader'

// prevent unexpected drag and drop event
document.addEventListener('dragover', event => event.preventDefault())
document.addEventListener('drop', event => event.preventDefault())

function lazyLoading () {
  import(
    /* webpackChunkName: "webviewSetup" */
    './Main/webviewSetup'
  )
  import(
    /* webpackChunkName: "webContentsSetup" */
    './Main/webContentsSetup'
  )
}

// lazyLoading would be too lazy to register before dom ready
switch (document.readyState) {
  case 'loading':
    // if it's really slow that page is still loading
    window.addEventListener('DOMContentLoaded', lazyLoading)
    break
  case 'interactive':
  case 'complete':
    lazyLoading()
    break
}

export default {
  name: 'Main',
  components: {
    TheGameLoader,
    TheSubMenuBar: () => import(
      /* webpackChunkName: "TheSubMenuBar" */
      './Main/TheSubMenuBar'
    ),
    TheOptionLayer: () => import(
      /* webpackChunkName: "TheOptionLayer" */
      './Main/TheOptionLayer'
    ),
    TheDashboard: () => import(
      /* webpackChunkName: "TheDashboard" */
      './Main/TheDashboard'
    )
  },
  computed: {
    commonStyle () {
      return {
        zoom: this.$store.state.GameView.zoom
      }
    }
  }
}
</script>
