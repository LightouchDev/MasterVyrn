<template>
  <div id="the-game-loader" :style="style">
    <game-web/>
    <overlay/>
  </div>
</template>

<script>
import GameWeb from './TheGameLoader/GameWeb'
import Overlay from './TheGameLoader/Overlay'
import windowHandler from './TheGameLoader/windowHandler'

let delayResize = null

export default {
  name: 'the-game-loader',
  components: {
    GameWeb,
    Overlay
  },
  data () {
    return {
      view: this.$store.state.GameView
    }
  },
  methods: {
    // calculate proper zoom size
    calcZoom (zoom) {
      if (!zoom && this.view.autoResize) {
        zoom = window.innerWidth / this.view.login ? this.windowBase : this.view.baseWidth
      }

      zoom > 2 && (zoom = 2)
      zoom < 1 && (zoom = 1)

      window.commit('VIEW_UPDATE', {zoom: zoom})

      // only reload page when zoom ism't manually set.
      zoom === undefined && window.webview.reload()
    },
    setupWindow () {
      if (window.onresize) {
        if (!this.view.autoResize) {
          // unregister resize event when game is not resposive
          window.onresize = null
          delayResize = null
        }
      } else if (this.view.autoResize) {
        // register resize event when game is resposive
        window.onresize = () => {
          clearTimeout(delayResize)
          delayResize = setTimeout(() => {
            this.calcZoom()
          }, 80)
        }
      }
      // setup browser window size
      windowHandler({
        min: this.windowBase,
        width: this.windowWidth,
        autoResize: this.view.autoResize
      })
    }
  },
  computed: {
    webviewWidth () {
      return (
        Number(this.view.baseSize * this.view.zoom) +
        this.view.sidePadding +
        this.view.unknownPadding
      )
    },
    windowWidth () {
      const windowWidth = Number(this.view.zoom * this.windowBase)
      if (window.screen.availWidth < windowWidth && this.view.autoResize) {
        this.calcZoom(window.screen.availWidth / this.windowBase)
      }
      return windowWidth
    },
    windowBase () {
      return ((this.view.subHide && !this.view.subOpen) ? 0 : this.view.subMenuWidth) +
        this.view.baseWidth * (this.view.subOpen ? 2 : 1)
    },
    style () {
      this.setupWindow()
      return {
        'width': `${this.webviewWidth}px`,
        'margin-left': this.view.isJssdkSideMenu ? `-${this.view.sidePadding}px` : '0px'
      }
    }
  }
}
</script>
