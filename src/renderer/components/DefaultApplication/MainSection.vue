<template>
  <div id="mainSection">
    <the-option-layer/>
    <the-game-loader/>
  </div>
</template>

<script>
import TheGameLoader from './MainSection/TheGameLoader'
import TheOptionLayer from './MainSection/TheOptionLayer'

export default {
  name: 'main-section',
  components: {
    TheGameLoader,
    TheOptionLayer
  }
}
</script>
