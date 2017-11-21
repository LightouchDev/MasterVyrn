<template>
  <div id="the-game-loader">
    <game-web/>
    <overlay/>
  </div>
</template>

<script>
import GameWeb from './TheGameLoader/GameWeb'
import Overlay from './TheGameLoader/Overlay'

export default {
  name: 'the-game-loader',
  components: {
    GameWeb,
    Overlay
  }
}
</script>
