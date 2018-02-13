<template>
  <div :style="style">
    <game-web/>
    <overlay/>
  </div>
</template>

<script>
import GameWeb from './TheGameLoader/GameWeb'
import windowHandler from './TheGameLoader/windowHandler'

let delayResize = null
const delayLength = process.platform === 'darwin' ? 600 : 80

export default {
  name: 'TheGameLoader',
  components: {
    GameWeb,
    Overlay: () => import(
      /* webpackChunkName: "Overlay" */
      './TheGameLoader/Overlay'
    )
  },
  data () {
    return {
      view: this.$store.state.GameView
    }
  },
  computed: {
    webviewWidth () {
      return (
        Math.trunc(this.view.baseSize * this.view.zoom) +
        this.view.sidePadding +
        this.view.unknownPadding
      )
    },
    windowWidth () {
      const windowWidth = Math.trunc(this.view.zoom * this.windowBase)
      if (window.screen.availWidth < windowWidth && this.view.autoResize) {
        this.calcZoom(window.screen.availWidth / this.windowBase)
      }
      return windowWidth
    },
    windowBase () {
      return ((this.$store.state.Config.subHide && !this.view.subOpen) ? 0 : this.view.subMenuWidth) +
        this.view.baseWidth * (this.view.subOpen ? 2 : 1)
    },
    style () {
      this.setupWindow() // setup window when dom changed every time.
      return {
        'width': `${this.webviewWidth}px`,
        'margin-left': (this.view.isJssdkSideMenu && this.view.platformName === 'mobage') ? `-${this.view.sidePadding}px` : '0px'
      }
    }
  },
  methods: {
    // calculate proper zoom size
    calcZoom (zoom) {
      if (!zoom && this.view.autoResize) {
        zoom = window.innerWidth / this.windowBase
      }

      zoom > 2 && (zoom = 2)
      zoom < 1 && (zoom = 1)

      this.$store.dispatch('VIEW_UPDATE', { zoom: zoom })
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
          }, delayLength)
        }
      }
      // setup browser window size
      windowHandler({
        min: this.windowBase,
        width: this.windowWidth,
        autoResize: this.view.autoResize
      })
    }
  }
}
</script>
