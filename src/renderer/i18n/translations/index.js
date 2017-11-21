/**
 * The file enables `@/i18n/index.js` to import all vue-i18n language
 * in a one-shot manner. There should not be any reason to edit this file.
 */

const files = require.context('.', false, /\.js$/)
const language = {}

files.keys().forEach(key => {
  if (key === './index.js') return
  language[key.replace(/(\.\/|\.js)/g, '')] = files(key).default
})

export default language
