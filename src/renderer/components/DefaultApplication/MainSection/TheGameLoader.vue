<template>
  <div>
    <webview/>
    <overlay/>
  </div>
</template>

<script>
import Webview from './TheGameLoader/Webview'
import Overlay from './TheGameLoader/Overlay'

export default {
  name: 'the-game-loader',
  components: {
    Webview,
    Overlay
  }
}
</script>
