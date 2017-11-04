/**
 * # message type and content
 *
 *   type: CREATE_NODE
 *   body: {
 *           id:        (String),  - The id of the node.
 *           data:      (Object),  - It should work with preset.
 *           preset:    (String),  - The preset process/event.
 *           style: {              - CSS rules.
 *             top:     (Any),
 *             ... etc
 *           },
 *           clickable: (Boolean), - Set this element is clickable
 *           js: {callback}        - Not implemented
 *         }
 */

const state = {
  zoom: 1,
  elements: [],
  data: {}
}

const mutations = {
  SET_ZOOM (state, payload) {
    state.zoom = payload
  },
  CLEAN_ELEMENTS (state, payload) {
    state.elements = []
  },
  CREATE_NODE (state, payload) {
    const {id, className, data, preset, style, clickable} = payload
    if (!state.data[preset]) { state.data[preset] = {} }
    Object.assign(state.data[preset], {[id]: data})
    state.elements.push({id, className, preset, style, clickable})
  }
}

export default {
  state,
  mutations
}
