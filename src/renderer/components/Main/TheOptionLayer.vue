<template>
  <div
    :style="zoom"
    :class="menuOpen ? 'open' : ''"
  >
    <div id="toolbar">
      <div
        id="button-option"
        class="toolbar-button"
        @click="menuToggle"
      >
        <font-awesome-icon
          :icon="optionIcon"
          transform="grow-14 down-7"
        />
        <div class="toolbar-button-desc">{{ (menuOpen ? $t('common.close') : $t('common.option')).toUpperCase() }}</div>
      </div>
    </div>
    <div id="option-page">
      <div id="container">
        <div
          id="option-language"
          class="option-group option-flex"
        >
          <div class="option-groupTitle">{{ $t('option.language.title') }}</div>
          <select
            name="option-select-language"
            v-model="config.language"
          >
            <option value="en_US">{{ $t('language.en_US') }}</option>
            <option value="zh_TW">{{ $t('language.zh_TW') }}</option>
          </select>
        </div>
        <div
          id="option-system"
          class="option-group"
        >
          <div class="option-groupTitle">{{ $t('option.system.title') }}
            <span class="warning">{{ $t('option.system.warning') }}</span>
          </div>
          <div class="option-item">
            <label for="option-item-noThrottling">
              <input
                type="checkbox"
                id="option-item-noThrottling"
                v-model="config.noThrottling"
              >{{ $t('option.system.item.noThrottling') }}
            </label>
          </div>
          <div class="option-item">
            <label for="option-item-noHardwareAccel">
              <input
                type="checkbox"
                id="option-item-noHardwareAccel"
                v-model="config.noHardwareAccel"
              >{{ $t('option.system.item.noHardwareAccel') }}
            </label>
          </div>
        </div>
        <div
          id="option-window"
          class="option-group"
        >
          <div class="option-groupTitle">{{ $t('option.window.title') }}</div>
          <div class="option-item">
            <label for="option-item-alwaysOnTop">
              <input
                type="checkbox"
                id="option-item-alwaysOnTop"
                v-model="config.alwaysOnTop"
              >{{ $t('option.window.item.alwaysOnTop') }}
            </label>
          </div>
        </div>
        <div
          id="option-proxy"
          class="option-group"
        >
          <div class="option-groupTitle">{{ $t('option.proxy.title') }}</div>
          <div class="option-item">
            <div class="option-flex">
              <select
                name="option-select-proxyType"
                v-model="proxy.protocol"
              >
                <option value="direct:">{{ $t('option.proxy.item.direct') }}</option>
                <option value="http:">HTTP</option>
                <option value="https:">HTTPS</option>
                <option value="socks:">SOCKS4</option>
                <option value="socks5:">SOCKS5</option>
              </select>
              <input
                type="text"
                id="option-item-proxyServer"
                :disabled="disableProxyOptions"
                v-model="proxy.hostname"
                :placeholder="$t('option.proxy.item.hostname')"
              >
              :
              <input
                type="number"
                id="option-item-proxyPort"
                :disabled="disableProxyOptions"
                v-model="proxy.port"
                :placeholder="$t('option.proxy.item.port')"
              >
            </div>
            <div
              id="option-userinfo"
              class="option-flex"
            >
              <input
                type="text"
                :disabled="disableProxyOptions"
                v-model="proxy.username"
                :placeholder="$t('option.proxy.item.username')"
              >
              :
              <input
                type="password"
                :disabled="disableProxyOptions"
                v-model="proxy.password"
                :placeholder="$t('option.proxy.item.password')"
              >
            </div>
          </div>
        </div>
        <div
          id="option-storage"
          class="option-group"
        >
          <div class="option-groupTitle">{{ $t('option.storage.title') }}</div>
          <div class="option-item option-flex">
            <button
              type="button"
              class="button default"
              @click="cleanStorage('login')"
            >{{ $t('option.storage.item.clearLogin') }}</button>
            <button
              type="button"
              class="button default"
              @click="cleanStorage('cache')"
            >{{ $t('option.storage.item.clearCache') }}</button>
            <div class="indent"/>
            <button
              type="button"
              class="button default"
              @click="cleanStorage('all')"
            >{{ $t('option.storage.item.clearAll') }}</button>
          </div>
        </div>
        <div
          id="option-buttons"
          class="option-group option-flex"
        >
          <button
            type="button"
            id="option-button-default"
            class="button blue"
            @click="setDefault"
          >{{ $t('option.button.default') }}</button>
          <div class="indent"/>
          <button
            type="button"
            id="option-button-apply"
            class="button green"
            @click="applyConfig"
          >{{ $t('option.button.apply') }}</button>
          <button
            type="button"
            id="option-button-close"
            class="button red"
            @click="menuToggle"
          >{{ $t('option.button.close') }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { remote } from 'electron'
import { clone } from 'lodash'
import urlParser from 'url-parser'
import FontAwesomeIcon from '@fortawesome/vue-fontawesome'
import { faListAlt, faTimesCircle } from '@fortawesome/fontawesome-free-regular'

export default {
  name: 'TheOptionLayer',
  components: {
    FontAwesomeIcon
  },
  data () {
    return {
      menuOpen: false,
      config: clone(this.$store.state.Config),
      proxy: urlParser(this.$store.state.Config.proxy)
    }
  },
  computed: {
    zoom () {
      return {zoom: this.$store.state.GameView.zoom}
    },
    optionIcon () {
      return this.menuOpen ? faTimesCircle : faListAlt
    },
    disableProxyOptions () {
      return this.proxy.protocol === 'direct:'
    }
  },
  methods: {
    menuToggle () {
      if (!this.menuOpen) {
        // refresh config
        this.config = clone(this.$store.state.Config)
        this.proxy = urlParser(this.$store.state.Config.proxy)
      }
      this.menuOpen = !this.menuOpen
    },
    cleanStorage (type) {
      if (confirm(this.$t(`option.alert.clearStorage.${type}`))) {
        if (type !== 'login') {
          remote.session.defaultSession.clearCache(() => {})
        }
        if (type !== 'cache') {
          remote.session.defaultSession.clearStorageData({ origin: 'https://www.dmm.com' })
          remote.session.defaultSession.clearStorageData({ origin: 'https://connect.mobage.jp' })
          remote.session.defaultSession.clearStorageData(
            { origin: this.$store.state.Constants.site },
            () => {
              window.webview.loadURL(this.$store.state.Constants.site)
              this.menuOpen = false
            }
          )
        }
      }
    },
    setDefault () {
      if (confirm(this.$t('option.alert.setDefault'))) {
        this.$store.dispatch('Config/DEFAULTS')
        this.menuOpen = false
        window.webview.reload()
      }
    },
    applyConfig () {
      // apply proxy
      let proxyString = ''
      if (this.proxy.protocol === 'direct:') {
        proxyString = 'direct://'
        this.proxy = urlParser('direct://')
      } else {
        // concat proxy string
        proxyString = this.proxy.protocol + '//'
        this.proxy.username && (proxyString += this.proxy.username)
        this.proxy.password && (proxyString += `:${this.proxy.password}`)
        this.proxy.username && (proxyString += '@')
        proxyString += this.proxy.hostname
        this.proxy.port > 0 && this.proxy.port < 65536 && (proxyString += `:${this.proxy.port}`)
      }
      if (proxyString !== this.config.proxy) {
        this.config.proxy = proxyString
        window.webview.reload()
      }
      this.$store.commit('Config/UPDATE', this.config)
      this.menuOpen = false
    }
  }
}
</script>

<style lang="scss" scoped>

#toolbar {
  left: 320px;
  bottom: 0px;
  position: absolute;
  text-align: center;
  .toolbar-button {
    color: #c5f7f9;
    width: 64px;
    height: 45px;
    margin: 9px 0 9px;
    position: relative;
    @include gradient-text('linear-gradient(#c5f7f9, #94d4dd, #c5f7f9)', 'dark');
  }
  .toolbar-button-desc {
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
#option-page {
  display: none;
}

.open {
  #option-page {
    top: 0;
    left: 0;
    width: 320px;
    height: 100vh;
    color: $standardWhite;
    text-shadow:
      -1px -1px 2px $standardBlack,
      1px -1px 2px $standardBlack,
      -1px 1px 2px $standardBlack,
      1px 1px 2px $standardBlack;
    background-color: rgba($standardBlack, 0.8);
    white-space: nowrap;
    position: absolute;
    z-index: 10;
    display: block;
    #container {
      margin: 0px 10px;
      .option-group {
        font-size: 12px;
        margin: 15px 0px;
        .option-groupTitle {
          margin: 4px 0px;
          font-size: 18px;
        }
        &#option-proxy {
          #option-item-proxyServer {
            width: 100%;
          }
          #option-item-proxyPort {
            width: 5em;
          }
          #option-userinfo {
            padding-top: 5px;
            > * {
              width: 100%;
            }
          }
        }
        &#option-storage {
          div {
            justify-content: flex-start;
          }
        }
        &#option-buttons {
          padding-top: 15px;
        }
      }
      .option-flex {
        display: flex;
        align-items: center;
        justify-content: space-between;
        > * {
          margin: 0px 2px;
        }
        > :first-child {
          margin-left: 0;
        }
        > :last-child {
          margin-right: 0;
        }
      }
    }
  }
}

input[type="checkbox"] {
  vertical-align: middle;
}

.warning {
  margin: 0px 4px;
  color: lighten(red, 10%);
  font-size: 10px;
  white-space: initial;
}

.desc {
  margin: 2px 0px;
  color: darken($standardWhite, 20%);
  font-size: 10px;
  white-space: initial;
}

.indent {
  width: 100%;
}

.button {
  color: $standardWhite;
  font-size: 12px;
  font-weight: bold;
  border-radius: 3px;
  border-style: solid;
  border-width: 1px;
}
$red:   #dc3545;
$green: #28a745;
$blue:  #007bff;
$gray:  #adb5bd;
.default {
  color: $standardBlack;
}
.red {
  @include setColor($red);
}
.green {
  @include setColor($green);
}
.blue {
  @include setColor($blue);
}
.gray {
  @include setColor($gray);
  color: $standardBlack;
}

</style>
