<template>
  <div id="the-option-layer" :style="zoom" :class="open ? 'open' : ''">
    <div id="option-button" @click="menuToggle"><font-awesome-icon :icon="open ? faTimes : faCog" /></div>
    <div id="option-page">
      <div id="option-titleBar">
        <div id="option-tab-preference" @click="changeTab('Preference')">{{ $t('option.tab.preference') }}</div>
        <div id="option-tab-advanced" @click="changeTab('Advanced')">{{ $t('option.tab.advanced') }}</div>
      </div>
      <div id="container">
        <div id="option-tabPage-preference" v-if="tabName === 'Preference'">
          <div id="option-language" class="option-group option-flex">
            <div class="option-groupTitle">{{ $t('option.language.title') }}</div>
            <select name="option-select-language" v-model="config.language">
              <option value="en-US">{{ $t('language.en-US') }}</option>
              <option value="zh-TW">{{ $t('language.zh-TW') }}</option>
            </select>
          </div>
          <div id="option-window" class="option-group">
            <div class="option-groupTitle">{{ $t('option.window.title') }}</div>
            <div class="option-item">
              <input type="checkbox" id="option-item-alwaysOnTop" v-model="config.window.alwaysOnTop">
              <label
                for="option-item-alwaysOnTop"
                v-t="'option.window.item.alwaysOnTop'"
              ></label>
            </div>
            <div class="option-item">
              <input type="checkbox" id="option-item-lockWindowSize" v-model="config.window.lockWindowSize">
              <label
                for="option-item-lockWindowSize"
                v-t="'option.window.item.lockWindowSize'"
              ></label>
            </div>
          </div>
          <div id="option-zoom" class="option-group">
            <div class="option-groupTitle">{{ $t('option.zoom.title') }}</div>
            <div class="option-item option-flex">
              <button type="button" class="button default" @click="setInitZoom(1.0)">x1.0</button>
              <button type="button" class="button default" @click="setInitZoom(1.5)">x1.5</button>
              <button type="button" class="button default" @click="setInitZoom(2.0)">x2.0</button>
              <div>
                {{ $t('option.zoom.item.initialRatio') }}
                <input type="number" id="option-item-zoom" step="0.1" min="1" max="2" v-model="config.window.zoom">
              </div>
            </div>
          </div>
        </div>
        <div id="option-tabPage-advanced" v-else-if="tabName === 'Advanced'">
          <div id="option-system" class="option-group">
            <div class="option-groupTitle">{{ $t('option.system.title') }}
              <span class="warning">{{ $t('option.system.warning') }}</span>
            </div>
            <div class="option-item">
              <input type="checkbox" id="option-item-noThrottling" v-model="system.noThrottling">
              <label
                for="option-item-noThrottling"
                v-t="'option.system.item.noThrottling'"
              ></label>
            </div>
            <div class="option-item">
              <input type="checkbox" id="option-item-noHardwareAccel" v-model="system.noHardwareAccel">
              <label
                for="option-item-noHardwareAccel"
                v-t="'option.system.item.noHardwareAccel'"
              ></label>
            </div>
          </div>
          <div id="option-fix" class="option-group">
            <div class="option-groupTitle">{{ $t('option.fix.title') }}</div>
            <div id="option-widthOffset" class="option-item option-flex">
              <span>{{ $t('option.fix.item.widthOffset.title') }}</span>
              <input type="number" id="option-item-widthOffset" min="-50" max="50" step="1" v-model="system.platformOffset" @change="changeWidthOffset">
              <span>px</span>
              <div class="indent"></div>
              <button type="button" id="option-button-calibration" class="button gray" @click="autoCalibration">{{ $t('option.fix.item.autoCalibration') }}</button>
            </div>
            <div id="option-item-widthOffset-desc" class="desc">{{ $t('option.fix.item.widthOffset.desc') }}</div>
          </div>
          <div id="option-proxy" class="option-group">
            <div class="option-groupTitle">{{ $t('option.proxy.title') }}</div>
            <div class="option-item">
              <div class="option-flex">
                <select name="option-select-proxyType" v-model="config.proxy.type">
                  <option value="DIRECT">{{ $t('option.proxy.item.direct') }}</option>
                  <option value="PROXY">HTTP</option>
                  <option value="HTTPS">HTTPS</option>
                  <option value="SOCKS">SOCKS4</option>
                  <option value="SOCKS5">SOCKS5</option>
                </select>
                <input type="text" id="option-item-proxyServer" :disabled="config.proxy.type === 'DIRECT'" v-model="config.proxy.server" :placeholder="$t('option.proxy.item.server')">
                :
                <input type="number" id="option-item-proxyPort" :disabled="config.proxy.type === 'DIRECT'" v-model="config.proxy.port" :placeholder="$t('option.proxy.item.port')">
              </div>
            </div>
          </div>
          <div id="option-storage" class="option-group">
            <div class="option-groupTitle">{{ $t('option.storage.title') }}</div>
            <div class="option-item option-flex">
              <button type="button" class="button default" @click="cleanStorage('login')">{{ $t('option.storage.item.clearLogin') }}</button>
              <button type="button" class="button default" @click="cleanStorage('cache')">{{ $t('option.storage.item.clearCache') }}</button>
              <div class="indent"></div>
              <button type="button" class="button default" @click="cleanStorage('all')">{{ $t('option.storage.item.clearAll') }}</button>
            </div>
          </div>
        </div>
        <div id="option-buttons" class="option-group option-flex">
          <button type="button" id="option-button-default" class="button blue" @click="setDefault">{{ $t('option.button.default') }}</button>
          <div class="indent"></div>
          <button type="button" id="option-button-apply" class="button green" @click="applyConfig">{{ $t('option.button.apply') }}</button>
          <button type="button" id="option-button-close" class="button red" @click="menuToggle">{{ $t('option.button.close') }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import FontAwesomeIcon from '@fortawesome/vue-fontawesome'
import faCog from '../../../libs/fontawesome-pro-regular/faCog'
import faTimes from '../../../libs/fontawesome-pro-regular/faTimes'

let mainConfigs = require('electron').remote.getGlobal('Configs')

export default {
  data () {
    return {
      faCog: faCog,
      faTimes: faTimes,
      menuOpen: false,
      tabName: 'Preference',
      config: Object.assign({}, global.Configs.get()),
      system: mainConfigs.get()
    }
  },
  computed: {
    zoom () {
      return {zoom: this.$store.state.Overlay.zoom}
    },
    open () {
      return this.menuOpen
    }
  },
  methods: {
    menuToggle () {
      this.menuOpen = !this.menuOpen
    },
    changeTab (tabName) {
      this.tabName = tabName
    },
    cleanStorage (type) {
      if (confirm(this.$t(`option.alert.clearStorage.${type}`))) {
        if (type !== 'login') window.webview.getWebContents().session.clearCache(() => {})
        if (type !== 'cache') window.webview.getWebContents().session.clearStorageData()
      }
    },
    changeWidthOffset () {
      mainConfigs.set({platformOffset: this.system.platformOffset})
      global.wm.applyWidth()
    },
    autoCalibration () {
      let previousZoom = this.config.window.zoom
      let platformOffset = this.system.platformOffset
      window.wm.autoCalibration().then(result => {
        if (!result) {
          window.alert(this.$t('option.alert.calibrationFailed'))
          mainConfigs.set({platformOffset: platformOffset})
          global.Configs.set({window: {zoom: previousZoom}})
        }
        this.refrashConfig()
      })
    },
    refrashConfig () {
      this.system = mainConfigs.get()
      this.config = global.Configs.get()
    },
    setDefault () {
      if (confirm(this.$t('option.alert.setDefault'))) {
        if (this.tabName === 'Preference') {
          this.config.window = global.Configs.getDefaults().window
        }
        if (this.tabName === 'Advanced') {
          this.system = mainConfigs.getDefaults()
          this.config.proxy = global.Configs.getDefaults().proxy
        }
        this.applyConfig()
      }
    },
    setInitZoom (zoom) {
      this.config.window.zoom = zoom
    },
    applyConfig () {
      mainConfigs.set(this.system)
      global.Configs.set(this.config)
      window.webview.reload()
    }
  },
  components: {
    FontAwesomeIcon
  }
}
</script>

<style lang="scss">

#the-option-layer {
  #option-button {
    background-image: -webkit-linear-gradient(bottom, #3a5764 0%,#0a1f29 97%);
    color: darken($standardWhite, 3%);
    width: 18px;
    height: 25px;
    right: 0px;
    bottom: 0px;
    padding-top: 4px;
    padding-right: 1px;
    position: absolute;
    text-align: center;
    border-top: 1px solid #839d9e;
    border-radius: 0 10px 0 0;
    box-sizing: border-box;
  }
  #option-page {
    display: none;
  }
}
#the-option-layer.open {
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
      #option-titleBar {
        display: flex;
        div {
          background-color: $standardWhite;
          border-color: lighten($standardBlack, 10%);
          border-width: 1px;
          border-style: solid;
          color: $standardBlack;
          width: 100%;
          text-align: center;
          text-shadow: initial;
        }
      }
    #container {
      margin: 0px 10px;
      .option-group {
        font-size: 12px;
        margin: 15px 0px;
        .option-groupTitle {
          margin: 4px 0px;
          font-size: 18px;
        }
        #option-widthOffset {
          display: flex;
          margin: 4px 0px;
          span {
            vertical-align: middle;
          }
          input {
            width: 3em;
          }
        }
        &#option-zoom {
          .option-flex {
            justify-content: space-around;
          }
          input {
            width: 3em;
          }
        }
        &#option-proxy {
          #option-item-proxyServer {
            width: 100%;
          }
          #option-item-proxyPort {
            width: 5em;
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

