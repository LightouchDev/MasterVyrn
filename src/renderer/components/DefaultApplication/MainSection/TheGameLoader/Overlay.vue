<template>
  <div id="overlay">
    <div
      v-for="element in elements"
      :key="element.key"
      :id="element.id"
      :class="[element.class ? element.class : '']"
      :data-preset="element.preset ? element.preset : ''"
      :style="[element.style, zoom]"
      v-on="element.clickable ? { mouseup: eventMap } : ''"
    ></div>
  </div>
</template>

<script>
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

      if (event.type === 'mouseup') {
        size = 1 + (size * 0.5)
        global.Configs.set({
          window: { zoom: size }
        })
      }
    }
  }
}
</script>


<style lang="scss">
#overlay {
  height: 100vh;
  bottom: 0;
  z-index: 2;
  pointer-events: none;
  overflow: hidden;
  position: absolute;
  > div {
    position: absolute;
    pointer-events: auto;
  }
}
</style>
