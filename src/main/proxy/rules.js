import {URL} from 'url'
import {JSDOM} from 'jsdom'

// FIXME: no hardcoded rule, use object instead.
export default {
  summary: 'GBF resource process',
  * beforeSendResponse (requestDetail, responseDetail) {
    let url = new URL(requestDetail.url)
    if (url.hostname === 'game.granbluefantasy.jp') {
      let newResponse = Object.assign({}, responseDetail.response)
      if (url.pathname === '/' || url.pathname === '/maintain') {
        let {document} = new JSDOM(responseDetail.response.body, {resources: 'usable'}).window
        let elements = document.head.querySelectorAll('script')
        for (let element of elements) {
          if (!element.src) {
            element.text = element.text.replace(/^[ \t]+deviceRatio.*\n/gm, '')
          }
        }
        let cssContent = require('fs').readFileSync(require('path').join(__dirname, 'resources/override.css'), 'utf8')
        let cssOverride = document.createElement('style')
        cssOverride.appendChild(document.createTextNode(cssContent))
        document.head.appendChild(cssOverride)
        Object.assign(newResponse, {body: document.documentElement.innerHTML})
        return {response: newResponse}
      }
    }
    return null // keep response clean if target not found.
  }
}
