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
body {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  font-family: $defaultFont;
}

</style>
