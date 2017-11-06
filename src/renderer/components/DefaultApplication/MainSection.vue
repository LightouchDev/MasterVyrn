<template>
  <div
    id="mainSection"
    :class="cleanClass ? '' : notJssdk ? 'notJssdk' : ''"
  >
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
  },
  computed: {
    cleanClass () {
      return this.$store.state.GameWeb.cleanClass
    },
    notJssdk () {
      return this.$store.state.GameWeb.notJssdk
    }
  }
}
</script>
