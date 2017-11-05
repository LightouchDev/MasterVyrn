<template>
  <div id="overlay">
    <div
      v-for="element in elements"
      :key="element.key"
      :id="element.id"
      :class="[element.class ? element.class : '']"
      :data-preset="element.preset ? element.preset : ''"
      :style="[element.style, zoom]"
      v-on="element.clickable ? { mousedown: eventMap, mouseup: eventMap } : ''"
    ></div>
  </div>
</template>

<script>
import {ipcRenderer} from 'electron'

export default {
  data () {
    return {
      state: this.$store.state.Overlay
    }
  },
  computed: {
    elements () {
      return this.state.elements
    },
    zoom () {
      return {zoom: this.state.zoom}
    }
  },
  methods: {
    // map event according to data-preset
    eventMap: function (event) {
      let thisPreset = event.target.dataset.preset
      const data = this.state.data[thisPreset]
      return this[thisPreset](event, data)
    },
    resizer: function (event, data) {
      let {size} = data[event.target.id]
      let {clientX, clientY} = event

      if (event.type === 'mousedown') { ipcRenderer.send('resizeWindow', size) }

      global.webview.sendInputEvent({
        type: event.type === 'mousedown' ? 'mouseDown' : 'mouseUp',
        x: clientX + 64,
        // FIXME: should add padding for Headerbar
        y: clientY
      })
    }
  }
}
</script>


<style lang="scss" scoped>
.hasHeader {
  height: calc(100vh - #{$mainHeaderHeight});
}

div {
  position: absolute;
  pointer-events: auto;
}
#overlay {
  width: calc(100vw + #{$sidebarPadding});
  height: 100vh;
  bottom: 0;
  z-index: 2;
  margin-left: -$sidebarPadding;
  pointer-events: none;
  overflow: hidden;
}
</style>
