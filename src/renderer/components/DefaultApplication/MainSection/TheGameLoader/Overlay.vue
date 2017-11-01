<template>
  <div id="overlay">
    <div
      v-for="cover in covers"
      :key="cover.key"
      :id="cover.id"
      :class="[cover.class ? cover.class : cover.preset]"
      :data-preset="cover.preset ? cover.preset : cover.class"
      :style="[cover.style, zoom]"
      v-on="{ mousedown: eventMap, mouseup: eventMap }"
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
    covers () {
      return this.state.covers
    },
    zoom () {
      return {zoom: this.state.zoom}
    }
  },
  methods: {
    // map event according to dom class
    eventMap: function (event) {
      let thisPreset = event.target.dataset.preset
      const data = this.state.data[thisPreset]
      return this[thisPreset](event, data)
    },
    resizer: function (event, data) {
      let {size} = data[event.target.id]
      let {clientX, clientY} = event
      ipcRenderer.send('messageProxy', {
        channel: 'webviewClick',
        args: {
          type: event.type === 'mousedown' ? 'mouseDown' : 'mouseUp',
          x: clientX,
          // remove the padding of header bar
          y: clientY - 40
        }
      })
      ipcRenderer.send('resizeWindow', size)
    }
  }
}
</script>

<style lang="scss" scoped>
div {
  position: absolute;
  transform-origin: 0 0;
  pointer-events: auto;
}
#overlay {
  width: 100%;
  height: calc(100vh - #{$mainHeaderHeight});
  bottom: 0;
  z-index: 2;
  pointer-events: none;
  transform: none;
  overflow: hidden;
}
</style>
