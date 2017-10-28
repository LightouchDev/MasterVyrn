<template>
  <div id="mainSection">
    <TheHeaderBar/>
    <TheGameLoader/>
  </div>
</template>

<script>
import TheGameLoader from './MainSection/TheGameLoader'
import TheHeaderBar from './MainSection/TheHeaderBar'
export default {
  name: 'main-section',
  components: {
    TheGameLoader,
    TheHeaderBar
  }
}
</script>
