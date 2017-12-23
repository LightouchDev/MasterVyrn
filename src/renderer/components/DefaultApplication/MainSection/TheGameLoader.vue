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

export default {
  name: 'the-game-loader',
  components: {
    GameWeb,
    Overlay
  },
  data () {
    return {
      view: this.$store.state.GameView,
      resizerRegistered: false
    }
  },
  methods: {
    // calculate proper zoom size
    calcZoom (zoom) {
      if (!zoom && this.view.autoResize) {
        if (this.view.login) {
          zoom =
            window.innerWidth /
            (this.view.subMenuWidth + 320 * (this.view.subOpen ? 2 : 1))
        } else {
          zoom = window.innerWidth / 320
        }
      }

      if (zoom > 2) {
        zoom = 2
      } else if (zoom < 1) {
        zoom = 1
      }
      window.commit('VIEW_UPDATE', {zoom: zoom})
      // only reload page when game is responsive
      if (zoom === undefined) { window.webview.reload() }
    },
    windowResizer () {
      if (this.resizerRegistered) {
        if (!this.view.autoResize) {
          // unregister resize event when game is not resposive
          window.onresize = null
          this.resizerRegistered = false
        }
      } else if (this.view.autoResize) {
        // register resize event when game is resposive
        let delayResize = null
        window.onresize = () => {
          clearTimeout(delayResize)
          delayResize = setTimeout(() => {
            this.calcZoom()
          }, 80)
        }
        this.resizerRegistered = true
      }
    }
  },
  computed: {
    webviewWidth () {
      return (
        this.view.baseSize * this.view.zoom +
        this.view.sidePadding +
        this.view.unknownPadding
      )
    },
    windowWidth () {
      const windowWidth = Number(
        this.view.zoom *
        (this.view.subMenuWidth + 320 * (this.view.subOpen ? 2 : 1))
      )
      if (window.screen.availWidth < windowWidth && this.view.autoResize) {
        this.calcZoom(
          window.screen.availWidth /
          (this.view.subMenuWidth + 320 * (this.view.subOpen ? 2 : 1))
        )
      }
      return windowWidth
    },
    style () {
      // setup window
      this.windowResizer()
      windowHandler({
        min: Number(this.view.subMenuWidth + 320 * (this.view.subOpen ? 2 : 1)),
        width: this.windowWidth,
        autoResize: this.view.autoResize
      })
      return {
        'width': `${this.webviewWidth}px`,
        'margin-left': this.view.isMbga ? `-${this.view.sidePadding}px` : '0px'
      }
    }
  }
}
</script>
