<template>
  <div class="container">
    <div
      id="button-option"
      class="button"
      @click="optionToggle"
    >
      <font-awesome-icon
        :icon="optionIcon"
        transform="grow-14 down-7"
      />
      <div class="button-desc">
        {{ (HostView.optionOpen ? $t('common.close') : $t('common.option')).toUpperCase() }}
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.container {
  left: 320px;
  bottom: 0px;
  position: absolute;
  text-align: center;
  .button {
    color: #c5f7f9;
    width: 64px;
    height: 45px;
    margin: 9px 0 9px;
    position: relative;
    @include gradient-text('linear-gradient(#c5f7f9, #94d4dd, #c5f7f9)', 'dark');
  }
  .button-desc {
    font-size: 11px;
    font-weight: bold;
    letter-spacing: 0.75px;
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    text-shadow:
      -1px -1px 2px $standardBlack,
      1px -1px 2px $standardBlack,
      -1px 1px 2px $standardBlack,
      1px 1px 2px $standardBlack;
    @include gradient-text('linear-gradient(#c5f7f9, #94d4dd, #c5f7f9)', 'dark');
  }
}
</style>

<script>
import { mapState } from 'vuex'
import FontAwesomeIcon from '@fortawesome/vue-fontawesome'
import { faListAlt, faTimesCircle } from '@fortawesome/fontawesome-free-regular'

export default {
  name: 'TheSubMenuBar',
  components: {
    FontAwesomeIcon
  },
  computed: {
    ...mapState({
      HostView: 'HostView' // fetch state.HostView into this.HostView
    }),
    optionIcon () {
      return this.HostView.optionOpen ? faTimesCircle : faListAlt
    }
  },
  methods: {
    optionToggle () {
      this.$store.dispatch('HostView/UPDATE', { optionOpen: !this.HostView.optionOpen })
    }
  }
}
</script>
