<template>
  <div id="wrapper">
    <the-dashboard id="the-dashboard" :style="[commonStyle, dashStyle]"/>
    <the-sub-menu-bar id="the-sub-menu-bar" :style="[commonStyle, subBarStyle]"/>
    <the-option-layer id="the-option-layer" :style="commonStyle"/>
    <the-game-loader id="the-game-loader"/>
  </div>
</template>

<style lang="scss">
body {
  overflow: hidden;
}

#wrapper {
  display: flex;
  > div {
    flex-shrink: 0;
  }
}

#the-dashboard {
  background: $standardBlack;
}
</style>

<script>
import { mapState } from 'vuex'
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
    ...mapState({
      HostView: 'HostView', // fetch state.HostView into this.HostView
      GameView: 'GameView'  // fetch state.GameView into this.GameView
    }),
    commonStyle () {
      return {
        zoom: this.GameView.zoom
      }
    },
    dashStyle () {
      return {
        width: this.HostView.dashWidth + 'px'
      }
    },
    subBarStyle () {
      return {
        left: this.GameView.baseWidth + (this.HostView.dashOpen ? this.HostView.dashWidth : 0) + 'px'
      }
    }
  }
}
</script>
