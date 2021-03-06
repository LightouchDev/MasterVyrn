import { assign } from 'lodash'

/**
 * Default parameters:
 *  zoom: the zoom of game that read from header or calculate from window size
 *  maintenance: game is in maintenance or not.
 *  autoResize: game is in responsive mode (or call "Full size")
 *  isJssdkSideMenu: is there has a useless sidebar.
 *  platformName: account provider.
 *  sidePadding: the width of sidebar of account provider, use for hiding that.
 *  baseSize: the basic size for full game width size, use for detecting zoom.
 *  baseWidth: the basic size for single game width.
 *  unknownPadding: extra width that I don't know the purpose.
 *  subOpen: submenu is opened or not.
 *  subMenuWidth: submenu width.
 */
const defaults = {
  zoom: 1.5,
  maintenance: false,
  autoResize: false,
  sidePadding: 0,
  baseSize: 0,
  unknownPadding: 0,
  subMenuWidth: 64 // ensure there always has submenu.
}

const preset = {
  // hard-coded widths for current version: 2017-12-21(1513867784)
  sidePadding: 64,
  baseSize: 704,
  subMenuWidth: 64
}

// only set variables when initialize
const state = assign({
  isJssdkSideMenu: false,
  platformName: '',
  baseWidth: 320,
  subOpen: false
}, defaults)

const mutations = {
  UPDATE (state, payload) {
    assign(state, payload)
  },
  PRESET (state) {
    assign(state, preset)
  },
  RESET (state) {
    assign(state, defaults)
  }
}

const actions = {
  // async update for non-blocking mutation for component use
  UPDATE ({ commit }, payload) {
    commit('UPDATE', payload)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
