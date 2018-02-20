import { forEach } from 'lodash'
/**
 * The file enables `@/i18n/index.js` to import all vue-i18n language
 * in a one-shot manner. There should not be any reason to edit this file.
 */

const files = require.context('.', false, /\.json$/)
const language = {}

forEach(files.keys(), key => {
  if (key === './index.js') return
  language[key.replace(/(\.\/|\.json)/g, '')] = files(key)
})

export default language
