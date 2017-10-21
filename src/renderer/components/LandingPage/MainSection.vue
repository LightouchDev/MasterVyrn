<template>
  <div id="mainSection">
    <header-bar></header-bar>
    <game-loader></game-loader>
  </div>
</template>

<script>
import GameLoader from './MainSection/GameLoader'
import HeaderBar from './MainSection/HeaderBar'
export default {
  name: 'main-section',
  components: {
    GameLoader,
    HeaderBar
  }
}
</script>
