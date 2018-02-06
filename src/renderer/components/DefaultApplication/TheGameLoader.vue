<template>
  <div id="the-game-loader" :style="style">
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
  name: 'the-game-loader',
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
  methods: {
    // calculate proper zoom size
    calcZoom (zoom) {
      const shouldReload = !zoom
      if (!zoom && this.view.autoResize) {
        zoom = window.innerWidth / this.windowBase
      }

      zoom > 2 && (zoom = 2)
      zoom < 1 && (zoom = 1)

      window.commit('VIEW_UPDATE', {zoom: zoom})

      // only reload page when zoom is manually set.
      shouldReload && window.webview.reload()
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
        'margin-left': (this.view.isJssdkSideMenu && this.view.platformName === 'mobage') ? `-${this.view.sidePadding}px` : '0px'
      }
    }
  }
}
</script>
