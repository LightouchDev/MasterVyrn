<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  // prevent unexpected drag and drop event
  document.addEventListener('dragover', event => event.preventDefault())
  document.addEventListener('drop', event => event.preventDefault())

  export default {
    name: 'mastervyrn'
  }
</script>

<style lang="scss">
#app {
  overflow: hidden;
}
</style>
